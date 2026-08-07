import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let FulfillItem = (itemID) => {
        return new Promise((resolve, reject) => {

            pool.query("UPDATE auctionhouse.Items set isArchived = true WHERE itemID = ?;  ",
                [itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }

    let UpdateSellerfund = (sellerID, sellerincome) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE auctionhouse.Sellers set fund = fund + ? WHERE sellerID = ?;",
                [sellerincome, sellerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }


    let obtainItemInfo = (itemID) => {
        return new Promise((resolve, reject) => {

            pool.query("SELECT * FROM Items WHERE itemID = ?;  ",
                [itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows[0])
                });
        });
    }
    let addTrade = (itemID, income, currentPrice, sellerID, buyerID) => {

        return new Promise((resolve, reject) => {
            pool.query("SELECT MAX(tradeID) as maxId FROM Trades", (error, result) => {
                if (error) { return reject(error); }

                // Convert to number and add 1
                const nextId = Number(result[0].maxId) + 1;
                pool.query(
                    "INSERT INTO Trades (tradeID, income, date, itemID, itemPrice, sellerID, buyerID) VALUES (?, ?, curdate(), ?, ?, ?, ?)",
                    [nextId, income, itemID, currentPrice, sellerID, buyerID],
                    (error, rows) => {
                        if (error) { return reject(error); }
                        return resolve(rows[0]);
                    });
            });
        });
    }

    let UpdateAuctionHouseFund = (income) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE auctionhouse.AuctionHouse SET fund = fund + ? WHERE auctionhouse = 1;",
                [income], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }

    let response;

    const item = await obtainItemInfo(event.itemID);
    if (item) {
        const currentPrice = item.currentPrice;
        const income = 0.05 * currentPrice;
        const sellerIncome = 0.95 * currentPrice;

        // Update seller and auction house funds
        const updateSellerFund = await UpdateSellerfund(event.sellerID, sellerIncome);
        const updateAuctionHouseFund = await UpdateAuctionHouseFund(income);

        // Add trade record
        const tradeAdded = await addTrade(event.itemID, income, currentPrice, item.sellerID, item.winnerBuyer);

        // Fulfill the item 
        const fulfillItem = await FulfillItem(event.itemID);
        if (fulfillItem) {
            response = {
                statusCode: 200,
                result: {
                    itemID: event.itemID,
                    success: true,
                    sellerIncome: sellerIncome,
                    tradeInfo: tradeAdded,
                },
            };
        } else {
            response = {
                statusCode: 400,
                result: {
                    itemID: event.itemID,
                    success: false,
                    message: "Failed to fulfill item.",
                },
            };
        }

    } else {
        response = {
            statusCode: 400,
            result: {
                itemID: event.itemID,
                success: false,
                message: "Item not found.",
            },
        };
    }


    pool.end()   //close connections to DB

    return response;
}

