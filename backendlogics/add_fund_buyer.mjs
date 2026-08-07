import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse",
        connectionLimit: 10,
        connectTimeout: 20000,
        waitForConnections: true
    });

    let AddFund = (buyerID, amount) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE auctionhouse.Buyers set fund = fund + ? WHERE buyerID = ?; ",
                [amount, buyerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }
    const newfund = await AddFund(event.buyerID, event.amount)

    let response;
    if (newfund) {
        if (update_fund) {
            response = {
                statusCode: 200,
                result: {
                    "buyerID": event.buyerID,
                    "success": true
                },
                fund: newfund
            }
        }
    }


    pool.end()   //close connections to DB

    return response;
}

    // const body = JSON.parse(event.body)
    // const buyerID = body.buyerID
    // const amount = body.amount

    // let CheckBuyerFunds = (buyerID) => {
    //     return new Promise((resolve, reject) => {
    //         pool.query("SELECT fund FROM Buyers WHERE buyerID=?",
    //             [buyerID], (error, rows) => {
    //                 if (error) {return reject(error);}
    //                 if ((rows) && (rows.length == 1)) {
    //                     return resolve({
    //                         exists: true, 
    //                         fund: rows[0].fund
    //                     })
    //                 } else {
    //                     return resolve({exists: false})
    //                 }
    //             });
    //     });
    // }

    // let UpdateBuyerFunds = (buyerID, currentFund, addAmount) => {
    //     const newTotal = currentFund + addAmount;
    //     return new Promise((resolve, reject) => {
    //         pool.query("UPDATE Buyers SET fund = ? WHERE buyerID = ?",
    //             [newTotal, buyerID], (error, result) => {
    //                 if (error) {return reject(error);}
    //                 return resolve({
    //                     success: true,
    //                     newFund: newTotal
    //                 });
    //             });
    //     });
    // }

    // try {
    //     const fundCheck = await CheckBuyerFunds(buyerID);
    //     if (!fundCheck.exists) {
    //         return {
    //             statusCode: 404,
    //             body: JSON.stringify({ error: "Buyer not found" })
    //         };
    //     }

    //     // If amount is 0, just return current fund
    //     if (amount === 0) {
    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify({
    //                 message: "Current fund retrieved",
    //                 newFund: fundCheck.fund
    //             })
    //         };
    //     }

    //     // Otherwise update the fund
    //     const updateResult = await UpdateBuyerFunds(buyerID, fundCheck.fund, amount);
    //     return {
    //         statusCode: 200,
    //         headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             message: "Fund updated successfully",
    //             newFund: updateResult.newFund
    //         })
    //     };
    // } catch (error) {
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({ error: error.message })
    //     };
    // }
// }