import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library to generate unique IDs
const s3 = new AWS.S3();

export const handler = async (event) => {
    let UploadImage = (itemImage) => {
        return new Promise((resolve, reject) => {
            if (itemImage) {
                resolve(itemImage); 
            } else {
                reject('Invalid image input');
            }
        });
    };
    let Image_FileName = (fileName) => {
        return new Promise((resolve, reject) => {
            if (fileName) {
                resolve(fileName); 
            } else {
                reject('Invalid file name input');
            }
        });
    };

    try {
        const base64Image = await UploadImage(event.itemImage);
        let imageFileName = await Image_FileName(event.fileName);

        // Check if the file already exists in the bucket
        const headParams = {
            Bucket: 'auctionhouse',
            Key: `images/${imageFileName}`
        };

        try {
            await s3.headObject(headParams).promise();
            // If no error is thrown, the file exists; make the filename unique
            const timestamp = Date.now(); // Alternatively, use `uuidv4()` for a unique identifier
            imageFileName = `${timestamp}_${imageFileName}`;
        } catch (error) {
            if (error.code !== 'NotFound') {
                // If the error isn't a "Not Found" error, rethrow it
                throw error;
            }
            // If the error is "Not Found", the file doesn't exist; proceed with the original filename
        }

        const buffer = Buffer.from(base64Image, 'base64');
        const params = {
            Bucket: 'auctionhouse',
            Key: `images/${imageFileName}`, // Specify the new unique file name and path
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg' // Adjust the content type as needed
        };

        const data = await s3.putObject(params).promise();
       
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image uploaded successfully', data }),
            filename: imageFileName //get this for storing image s3 url into database in frontend codings
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading image', error: err })
        };
    }
};

// import AWS from 'aws-sdk'
// const s3 = new AWS.S3();
// export const handler = async (event) => {
    

//     let UploadIamge = (itemImage) => {
//         return new Promise((resolve, reject) => { 
//             if (itemImage) {
//                 resolve(itemImage); // For now, just resolving the input image
//             } else {
//                 reject('Invalid image input');
//             }
//         })
//     }

    

//     let Iamge_FileName = (fileName) => {
//         return new Promise((resolve, reject) => { 
//             if (fileName) {
//                 resolve(fileName); // For now, just resolving the input image
//             } else {
//                 reject('Invalid image input');
//             }
//         })
//     }
//     try {
//         const base64Image = await UploadIamge(event.itemImage);
//         const imagefileName = await Iamge_FileName(event.fileName);

//         const buffer = Buffer.from(base64Image, 'base64');
//         const params = {
//             Bucket: 'auctionhouse',
//             Key: `images/${imagefileName}`, // Specify the desired file name and path
//             Body: buffer,
//             ContentEncoding: 'base64',
//             ContentType: 'image/jpeg' // Adjust the content type as needed
//         };
//         const data = await s3.putObject(params).promise();
//         return {
//             statusCode: 200,
//             body: JSON.stringify({ message: 'Image uploaded successfully', data })
//         };
//     } catch (err) {
//         console.error(err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ message: 'Error uploading image', error: err })
//         };
//     }
// };
