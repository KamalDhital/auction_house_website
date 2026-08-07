import mysql from 'mysql';

const pool = mysql.createPool({
    host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
    user: "prolog",
    password: "Prologauctionhouse24",
    database: "auctionhouse"
});

export const handler = async (event) => {
    const fetchForensicsReport = () => {
        return new Promise((resolve, reject) => {
            const query = `
             SELECT 
    i.itemID,
    i.itemName,
    b.firstName AS buyerFirstName,
    b.lastName AS buyerLastName,
    s.firstName AS sellerFirstName,
    s.lastName AS sellerLastName,
    bds.bidPrice AS bidAmount,
    bds.bidDate
FROM Bids bds
INNER JOIN Items i ON bds.itemID = i.itemID
INNER JOIN Buyers b ON bds.buyerID = b.buyerID
INNER JOIN Sellers s ON i.sellerID = s.sellerID
ORDER BY bds.bidDate DESC;

 `;

            pool.query(query, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    let response;

    try {
        const reportData = await fetchForensicsReport();

        response = {
            statusCode: 200,
            body: JSON.stringify(reportData) // Return report data to frontend
        };
    } catch (error) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to fetch auction report", error: error.message })
        };
    }

    return response;
};