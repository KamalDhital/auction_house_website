import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse",
        connectionLimit: 1,  // Reduce connection limit
        connectTimeout: 5000,  // Shorter timeout
        waitForConnections: false  // Don't wait for connections
    });

    const body = JSON.parse(event.body)
    const sellerID = body.sellerID

    let updateSellerStatus = (sellerID) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Sellers SET isActive = 0 WHERE sellerID = ?",
                [sellerID], (error, result) => {
                    if (error) {return reject(error)}
                    return resolve({
                        success: true
                    })
                })
        })
    }

    try {
        const result = await updateSellerStatus(sellerID)
        await pool.end()
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Seller account closed successfully"
            })
        }
    } catch (error) {
        if (pool) await pool.end()
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}
