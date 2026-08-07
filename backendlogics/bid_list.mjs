import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });


    let ItemBids = (itemID) => {
        return new Promise((resolve, reject) => {
          
            pool.query("SELECT * FROM Bids WHERE itemID = ?",
                [itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }


    let response;


    const itemBids = await ItemBids(event.itemID) 

    if (itemBids) {
        response = {
            statusCode: 200,
            result: {
                "itemID": event.itemID,
               
                "success": true
            },
            bids: itemBids
        }
    } else {
        response = {
            statusCode: 400,
            error: "Failed to retrieve item bids"
        }
    }
    



    pool.end()   //close connections to DB

    return response;

}
