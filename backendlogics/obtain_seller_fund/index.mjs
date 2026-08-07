import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let GetSellerFund = (sellerID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Sellers WHERE sellerID=?",
                [sellerID], (error, rows) => {
                    if (error) {return reject(error);}
                    if ((rows) && (rows.length == 1)) {
                        return resolve(rows[0].fund)
                    } else {
                        return resolve(false)
                    }
                });
        });
    }

    const seller_fund = await GetSellerFund(event.sellerID)
    let response;
    
        response = {
            statusCode: 200,
            result: {
                "sellerID" : event.sellerID
                
        },
    fund: seller_fund}
    

    pool.end()   //close connections to DB

    return response;

}
