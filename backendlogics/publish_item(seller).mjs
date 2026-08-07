import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let PublishItem = (itemID) => {
        return new Promise((resolve, reject) => {
            //NOTE: RDS uses UTC, which is 5 hour ahead of Boston, MA. Fixed this issue by -5 hours for the startDate
            pool.query("UPDATE Items set isActive = true, startDate = DATE_ADD(CURDATE(), INTERVAL -5 HOUR), endDate = DATE_ADD(startDate, INTERVAL auctionLength DAY) WHERE itemID = ?",
                [itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }

    //What about 400 error?
    const all_result = await PublishItem(event.itemID)

    const response = {
        statusCode: 200,
        result: {
            "itemID": event.itemID,
            "isActive": true
        }
    }



pool.end()   //close connections to DB

return response;
}

