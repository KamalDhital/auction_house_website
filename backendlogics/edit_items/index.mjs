import mysql from 'mysql';

export const handler = async (event) => {
    // Get credentials from the db_access layer (loaded separately via AWS console)
    const pool = mysql.createPool({
        host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
        user: "prolog",
        password: "Prologauctionhouse24",
        database: "auctionhouse"
    });


    // Function to add a new item to the database
    let addItem = (itemName, itemDescription, initialPrice, auctionLength, fileName, itemID) => {
        
        let imagepath = "https://auctionhouse.s3.us-east-1.amazonaws.com/images/"
        let itemImageURL = imagepath + fileName
        
        return new Promise((resolve, reject) => {

            pool.query(
                "Update Items set itemName = ?, itemDescription = ?, initialPrice = ?, currentPrice = ?, auctionLength = ?, itemImage = ? where itemID = ?",
                
                [itemName, itemDescription, initialPrice, initialPrice, auctionLength, itemImageURL, itemID],
                (error, results) => {
                    if (error) { return reject(error); }
                    return resolve(results);
                });

        });
    }

    let response;

    const result = await addItem(event.itemName, event.itemDescription, event.initialPrice, event.auctionLength, event.fileName, event.itemID)
    response = {
        statusCode: 200,
        result: {
            "itemID": event.itemID,
            "itemName": event.itemName,
            "itemDescription": event.itemDescription,
            "initialPrice": event.initialPrice,
            "auctionLength": event.auctionLength,
            "fileName": event.fileName,
            
        }
    }

    pool.end()
    return response;
}

