import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });



    let FailedItems = (sellerID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM auctionhouse.Items WHERE sellerID = ? and endDate < CURDATE() and hasBid = false",
                [sellerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }
    


    let response;


    const failedItems = await FailedItems(event.sellerID)

    if (failedItems) {
        response = {
            statusCode: 200,
            result: {
                "sellerID": event.sellerID,
                "list": "Failed Items",
                "success": true
            },
            items: failedItems
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
