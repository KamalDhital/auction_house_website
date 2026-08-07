import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });


    let ViewItem = (itemID) => {
        return new Promise((resolve, reject) => {
          
            pool.query("SELECT * FROM Items WHERE itemID = ?",
                [itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }


    let response;


    const viewItem = await ViewItem(event.itemID) 

    if (viewItem) {
        response = {
            statusCode: 200,
            result: {
                "sellerID": event.itemID,
            },
            item: viewItem
        }
    } else {
        response = {
            statusCode: 400,
            error: "Failed to retrieve item details"
        }
    }
    



    pool.end()   //close connections to DB

    return response;

}
