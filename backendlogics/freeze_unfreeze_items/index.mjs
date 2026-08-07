import mysql from 'mysql';

export const handler = async (event) => {

    // Get credentials from the db_access layer (loaded separately via AWS console)
    const pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    // Function to freeze or unfreeze an item
    let toggleItemFreeze = (itemID, freezeStatus) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Items SET isFrozen=? WHERE itemID=?";
            pool.query(query, [freezeStatus, itemID], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                if (rows.affectedRows === 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    };

    let response;

    try {
        // Determine the freeze status based on the action ('freeze' or 'unfreeze')
        const freezeStatus = event.action === 'freeze' ? 1 : 0;
        
        // Call function to toggle freeze status in the database
        const result = await toggleItemFreeze(event.itemID, freezeStatus);

        // Return a response based on the result of the database update
        if (result) {
            response = {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Item freeze status updated successfully.' })
            };
        } else {
            response = {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'No such item or action failed.' })
            };
        }
    } catch (err) {
        response = {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: err.message })
        };
    }

    pool.end();  // Close DB connections

    return response;
};
