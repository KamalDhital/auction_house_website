import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse",
        
    });


    let CheckFund = (buyerID) => {
        return new Promise((resolve, reject) => {
            pool.query("Select fund from Buyers WHERE buyerID = ?; ",
                [buyerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }
    
    let UpdateFund = (amount, buyerID) => {
       
        return new Promise((resolve, reject) => {
            pool.query("UPDATE auctionhouse.Buyers set fund = fund - ? WHERE buyerID = ?; ",
                [amount, buyerID], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                })
        })
    }
    

    let response;
    const addfund = await UpdateFund(event.amount, event.buyerID);

        if (addfund) {
            // Fetch the updated fund
            const fund = await CheckFund(event.buyerID);

            // Build success response
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    buyerID: event.buyerID,
                    success: true,
                    newFund: fund
                }),
            };
        } else {
            // Handle failure to update funds
            response = {
                statusCode: 400,
                body: JSON.stringify({
                    buyerID: event.buyerID,
                    success: false,
                    message: "Failed to update funds. Please try again."
                }),
            };
        }


    pool.end()   //close connections to DB

    return response;
}