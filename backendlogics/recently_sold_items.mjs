import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });

    let RecentSoldItems = () => {
        return new Promise((resolve, reject) => {
            
            pool.query("SELECT * FROM Items WHERE isActive = true and isSold = true and endDate <= NOW() + INTERVAL 1 DAY;",
                [], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows)
                });
        });
    }
    
    const items = await RecentSoldItems()
  
    const response = {
      statusCode: 200,
      items: items
    }
    


    pool.end()   //close connections to DB

    return response;

}