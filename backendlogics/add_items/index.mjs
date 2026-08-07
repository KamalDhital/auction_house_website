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
    let addItem = (itemName, itemDescription, fileName, initialPrice, auctionLength, sellerID) => {
        let imagepath = "https://auctionhouse.s3.us-east-1.amazonaws.com/images/"
        // let new_fileName = fileName.replace(/ /g, '+');
        // let itemImageURL = imagepath + new_fileName 
        let itemImageURL = imagepath + fileName
        
        return new Promise((resolve, reject) => {
            pool.query("SELECT MAX(itemID) as maxId FROM Items", (error, result) => {
                if (error) { return reject(error); }

                // Convert to number and add 1
                const nextId = Number(result[0].maxId) + 1;
                pool.query(
                    "INSERT INTO Items (itemID, itemName, itemDescription, itemImage, initialPrice, currentPrice, auctionLength, sellerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [nextId, itemName, itemDescription, itemImageURL, initialPrice, initialPrice, auctionLength, sellerID],
                    (error, results) => {
                        if (error) { return reject(error); }
                        return resolve(results);
                    });
            });
        });
    }

    let response;

    const result = await addItem(event.itemName, event.itemDescription, event.fileName, event.initialPrice, event.auctionLength, event.sellerID)
    response = {
        statusCode: 200,
        results:{
            "itemID": result.insertId,
            "itemName": event.itemName,
            "itemDescription": event.itemDescription,
            "initialPrice": event.initialPrice,
            "auctionLength": event.auctionLength,
            "sellerID": event.sellerID,
            "fileName": event.fileName,
            
        },
        
        
    }

    pool.end()
    return response;
}

// Kamal's original code
//     try {
//         // Extract required fields from the event object
//         const { itemName, itemDescription, itemImage, initialPrice, auctionLength, startDate, endDate } = event;

//         // Check for missing required fields
//         if (!itemName || !itemDescription || !itemImage || !initialPrice || !auctionLength || !startDate || !endDate) {
//             response = { statusCode: 400, error: "Missing required fields" };
//         } else {
//             // Add the new item to the database
//             const result = await addItem(itemName, itemDescription, itemImage, initialPrice, auctionLength, startDate, endDate);

//             // Check if the insert was successful
//             if (result.affectedRows > 0) {
//                 response = {
//                     statusCode: 200,
//                     result: {

//                         itemName,
//                         itemDescription,
//                         itemImage,
//                         initialPrice,
//                         auctionLength,
//                         startDate,
//                         endDate,
//                         message: "Item added successfully"
//                     }
//                 };
//             } else {
//                 response = { statusCode: 400, error: "Failed to add the item" };
//             }
//         }
//     } catch (err) {
//         response = { statusCode: 500, error: "An error occurred while adding the item", details: err.message };
//     }

//     pool.end();  // Close DB connections

//     return response;}
