import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let CheckAccountExist = (email, password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT buyerID, email, firstName, fund FROM Buyers WHERE email=? and password=?",
                [email, password], (error, rows) => {
                    if (error) {return reject(error);}
                    if ((rows) && (rows.length == 1)) {
                        return resolve({
                            exists: true, 
                            buyerID: rows[0].buyerID,
                            firstName: rows[0].firstName,
                            fund: rows[0].fund
                        })
                    } else {
                        return resolve({exists: false})
                    }
                });
        });
    }

    const check_account = await CheckAccountExist(event.email, event.password)
    let response;
    if (!check_account) {
        response = {
            statusCode: 400,
            error: "Invalid credentials, please try again."
        }
    }  
    else {
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            result: {
                "email": event.email,
                "buyerID": check_account.buyerID,
                "firstName": check_account.firstName,
                "fund": check_account.fund
            }
        }
    }
    pool.end()   //close connections to DB

    return response;
}
