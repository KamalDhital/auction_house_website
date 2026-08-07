import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let PlaceBid = (itemID, buyerID, bidPrice) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT MAX(bidID) as maxId FROM Bids", (error, result) => {
                if (error) { return reject(error); }

                // Convert to number and add 1
                const nextId = Number(result[0].maxId) + 1;
            
                pool.query("INSERT INTO Bids (bidID, buyerID, bidPrice, bidDate, itemID) VALUES (?, ?, ?, curDate(), ?)",
                [nextId, buyerID, bidPrice, itemID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
            });
        });
    }
    
    let UpdateCurrentPrice = (bidPrice, itemID) => {
        return new Promise ((resolve, reject) => {
            pool.query("UPDATE Items set currentPrice = ?, hasBid = true WHERE itemID = ?",
            [bidPrice, itemID],
            (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows)
            })
        })
    }
   
    let CheckFund = (buyerID) => {
        return new Promise((resolve, reject) => {
            pool.query("Select fund from Buyers WHERE buyerID = ?; ",
                [buyerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }

    let UpdateFund = (bidPrice, buyerID) => {
       
        return new Promise((resolve, reject) => {
            pool.query("UPDATE auctionhouse.Buyers set fund = fund - ? WHERE buyerID = ?; ",
                [bidPrice, buyerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }
    

    let response;

    const placebid = await PlaceBid(event.itemID, event.buyerID, event.bidPrice)
    
 
    if (placebid) {
        const updatePrice = await UpdateCurrentPrice(event.bidPrice, event.itemID)
        const updatefund = await UpdateFund(event.bidPrice, event.buyerID);
        
        if(updatePrice && updatefund) {
        const fund = await CheckFund(event.buyerID);
        response = {
            statusCode: 200,
            result: {
                "success": true
            },
            bid: {
                "itemID": event.itemID,
                "buyerID": event.buyerID,
                "bidPrice": event.bidPrice,
            },
            buyer_fund: fund
        }}
    } else {
        response = {
            statusCode: 400,
            error: "Cannot place a bid."
        }
    }
    



    pool.end()   //close connections to DB

    return response;

}
