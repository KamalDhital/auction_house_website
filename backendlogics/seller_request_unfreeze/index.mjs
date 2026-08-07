import mysql from 'mysql';

export const handler = async (event) => {
    // Initialize MySQL connection pool
    const pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    // Function to update item status to unfreeze
    const unfreezeItem = (itemID) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Items SET isFrozen = 0 WHERE itemID = ?", [itemID], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    };

    let response;

    try {
        // Log the received event
        console.log('Received event:', JSON.stringify(event, null, 2));

        // Parse itemID from the event body
        const body = JSON.parse(event.body);
        console.log('Parsed body:', body);
        const { itemID } = body;

        // Validate itemID
        if (!itemID || typeof itemID !== 'number') {
            throw new Error('Invalid or missing itemID');
        }

        // Call function to unfreeze the item
        const affectedRows = await unfreezeItem(itemID);

        // Prepare the response based on the result
        response = affectedRows === 1
            ? { statusCode: 200, body: JSON.stringify({ message: 'Unfreeze successful' }) }
            : { statusCode: 404, body: JSON.stringify({ message: 'Item not found' }) };
    } catch (error) {
        console.error('Error unfreezing item:', error);
        response = { statusCode: 500, body: JSON.stringify({ message: 'Unfreeze failed', error: error.message }) };
    }

    // Close the database connection pool
    pool.end((err) => {
        if (err) {
            console.error('Error closing pool:', err);
        }
    });

    return response;
};
