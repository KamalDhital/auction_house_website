import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let InactiveItems = (sellerID) => {
        return new Promise((resolve, reject) => {
            
            pool.query("SELECT * FROM Items WHERE sellerID = ? and isActive = false and isArchived = false ",
                [sellerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }
    
    let response;

    const inactiveItems = await InactiveItems(event.sellerID)
 
    if (inactiveItems) {
        response = {
            statusCode: 200,
            result: {
                "sellerID": event.sellerID,
                "success": true
            },
            items: inactiveItems
        }
    } else {
        response = {
            statusCode: 400,
            error: "Failed to retrieve item lists"
        }
    }
    



    pool.end()   //close connections to DB

    return response;

}