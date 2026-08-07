import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let GetBuyerFund = (buyerID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Buyers WHERE buyerID=?",
                [buyerID], (error, rows) => {
                    if (error) {return reject(error);}
                    if ((rows) && (rows.length == 1)) {
                        return resolve(rows[0].fund)
                    } else {
                        return resolve(false)
                    }
                });
        });
    }

    const buyer_fund = await GetBuyerFund(event.buyerID)
    let response;
    
        response = {
            statusCode: 200,
            result: {
                "buyerID" : event.buyerID
                
        },
    fund: buyer_fund}
    

    pool.end()   //close connections to DB

    return response;

}
