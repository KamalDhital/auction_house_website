import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let CheckAccountExist = (email) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Sellers WHERE email=?",
                [email], (error, rows) => {
                    if (error) {return reject(error);}
                    if ((rows) && (rows.length == 1)) {
                        return resolve(true)
                    } else {
                        return resolve(false)
                    }
                });
        });
    }


    let CreateAccount = (firstName, lastName, email, password) => {
        return new Promise((resolve, reject) => {
            //let id = Math.floor(1000 + Math.random() * 9000)
            pool.query("SELECT MAX(sellerID) as maxId FROM Sellers", (error, result) => {
                if (error) { return reject(error); }
                
                 // Convert to number and add 1
                const nextId = Number(result[0].maxId) + 1;

                pool.query("INSERT INTO Sellers (sellerID, firstName, lastName, email, password, fund) VALUES (?, ?, ?, ?, ?, 0)", 
                    [nextId, firstName, lastName, email, password], (error, rows) => {
                        if (error) { return reject(error);}
                        return resolve(rows);
                }); 
            });
        });
    }
     //NOTE: whatt if fails?
    const check_account = await CheckAccountExist(event.email)
    let response;
    if (check_account) {
        response = {
            statusCode: 400,
            error: "Account already exists."
        }
    }  else {
        const all_result = await CreateAccount(event.firstName, event.lastName, event.email, event.password)

        response = {
            statusCode: 200,
            result: {
                "firstName" : event.firstName,
                "lastName" : event.lastName,
                "email" : event.email,
                "password" : event.password
            }
        }
    }

    pool.end()   //close connections to DB

    return response;

}
