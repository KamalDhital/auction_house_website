import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let RetrieveItem = (buyerID) => {
        const myquery = "SELECT b.itemID, b.bidPrice, b.bidDate, i.itemName, i.itemDescription, i.currentPrice, i.endDate FROM auctionhouse.Bids b JOIN( SELECT itemID, MAX(bidID) AS latestBidID FROM auctionhouse.Bids WHERE buyerID = ? GROUP BY itemID ) sub ON b.itemID = sub.itemID AND b.bidID = sub.latestBidID JOIN auctionhouse.Items i ON b.itemID = i.itemID WHERE b.buyerID = ? AND i.endDate < CURDATE() AND i.status = 'completed';"

        return new Promise((resolve, reject) => {
            pool.query(myquery,
                [buyerID, buyerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }

    const items = await RetrieveItem(event.buyerID)

    let response;
    if (items.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: true,
                message: "No purchases found for the given buyer.",
            }),
            items: items
        };
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Purchase information has been retrieved",
            }),
            buyerID: event.buyerID,
            items: items
        };
    }
}
