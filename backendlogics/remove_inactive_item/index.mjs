import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let RemoveItem = (itemID) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Items WHERE itemID=?", [itemID], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.affectedRows == 1)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let response

    try {
        const result = await RemoveItem(event.itemID)
        if (result) {
            response = { statusCode: 200, result: { "success": true } }
        } else {
            response = { statusCode: 400, error: "No such item" }
        }
    } catch (err) {
        response = { statusCode: 400, error: err }
    }

    pool.end()     // close DB connections

    return response;
}

