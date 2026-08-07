import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let CheckHasBid = (itemID) => {
        return new Promise((resolve, reject) => {
            pool.query("Select hasBid From Items Where itemID = ?",
                [itemID], (error, rows) => {
                    if (error) {return reject(error)}
                    if ((rows) && (rows.length == 1)) {
                        return resolve(rows[0].hasBid)
                    } 
                })
        })
    }

    let PublishItem = (itemID) => {
        return new Promise((resolve, reject) => {
            //NOTE: RDS uses UTC, which is 5 hour ahead of Boston, MA. Fixed this issue by -5 hours for the startDate
            pool.query("UPDATE Items set isActive = false, startDate = null, endDate = null WHERE itemID = ?",
                [itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }

    
    const check_bid = await CheckHasBid(event.itemID)
    let response;
    if (check_bid) {
        response = {
            statusCode: 400,
            error: "Item has bid! Cannot unpublish this item."
        }
    }  else {
        const all_result = await PublishItem(event.itemID)

        response = {
            statusCode: 200,
            result: {
                "itemID" : event.itemID,
                "success": true
            }
        }
    }


pool.end()   //close connections to DB

return response;
}

