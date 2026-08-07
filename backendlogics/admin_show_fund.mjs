import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse",
        connectionLimit: 1,
        connectTimeout: 5000,
        waitForConnections: false
    });

    let getAdminFund = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT fund FROM AuctionHouse WHERE id = 1",
                (error, result) => {
                    if (error) return reject(error)
                    return resolve(result[0].fund)
                })
        })
    }

    try {
        const fund = await getAdminFund()
        await pool.end()
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fund: fund
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
