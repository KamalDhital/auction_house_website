import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let RetrieveItem = (buyerID) => {
        const myquery = "SELECT b.itemID, b.bidPrice, b.bidDate, i.itemName, i.itemDescription, i.currentPrice, i.endDate FROM auctionhouse.Bids b JOIN( SELECT  itemID, MAX(bidID) AS latestBidID FROM  auctionhouse.Bids WHERE  buyerID = ? GROUP BY  itemID ) sub ON b.itemID = sub.itemID AND b.bidID = sub.latestBidID JOIN auctionhouse.Items i ON b.itemID = i.itemID WHERE b.buyerID = ? AND i.endDate >= CURDATE();"

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
        // Handle case where no itemIDs are found
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: true,
                message: "No items found for the given buyer.",
            }),
            items: items
        };
    } else {
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Item information has retrieved",
            }),
            buyerID: event.buyerID,
            items: items
        };
    }
}


// Previous Version:
// import mysql from 'mysql'

// export const handler = async (event) => {

//     // get credentials from the db_access layer (loaded separately via AWS console)
//     var pool = mysql.createPool({
//         host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
//         user: "prolog",
//         password: "Prologauctionhouse24",
//         database: "auctionhouse"
//     });
//     //NOT DONE!!
//     //Use BuyerID to search the items that the buyer had bid on.
//     //Outcome example:  "itemID": [{ "itemID": 1}, {"itemID": 2}, {"itemID": 5}, {"itemID": 13}, {"itemID": 10}]
//     let FindItemID = (buyerID) => {
//         return new Promise((resolve, reject) => {
//             pool.query("SELECT DISTINCT itemID FROM auctionhouse.Bids WHERE buyerID = ?;",
//                 [buyerID], (error, rows) => {
//                     if (error) { return reject(error); }
//                     return resolve(rows)
//                 });
//         });
//     }
//     let RetrieveItem = (itemID) => {
//         return new Promise((resolve, reject) => {
//             pool.query("SELECT * FROM auctionhouse.Items WHERE itemID = ?;",
//                 [itemID], (error, rows) => {
//                     if (error) { return reject(error); }
//                     return resolve(rows)
//                 });
//         });
//     }

//     const itemIDList = await FindItemID(event.buyerID)

//     let response;
//     if (itemIDList.length === 0) {
//         // Handle case where no itemIDs are found
//         return {
//             statusCode: 400,
//             body: JSON.stringify({
//                 success: false,
//                 message: "No items found for the given buyer.",
//             }),
//             items: itemIDList
//         };
//     } else {
//         //retrieve item information from database by giving itemID from the itemIDList.
//         const items = [];
//         for (const item of itemIDList) {
//             const itemDetails = await RetrieveItem(item.itemID);
//             if (itemDetails) {
//                 items.push(itemDetails);
//             }
//         }
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 success: true,
//                 message: "Item information has retrieved.",
//             }),
//             buyerID: event.buyerID,
//             items: items
//         };
//     }
// }

    

