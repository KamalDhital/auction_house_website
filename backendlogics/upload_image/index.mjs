
import AWS from 'aws-sdk'
const s3 = new AWS.S3();
export const handler = async (event) => {
    

    let UploadIamge = (itemImage) => {
        return new Promise((resolve, reject) => { 
            if (itemImage) {
                resolve(itemImage); // For now, just resolving the input image
            } else {
                reject('Invalid image input');
            }
        })
    }

    

    let Iamge_FileName = (fileName) => {
        return new Promise((resolve, reject) => { 
            if (fileName) {
                resolve(fileName); // For now, just resolving the input image
            } else {
                reject('Invalid image input');
            }
        })
    }
    try {
        // const base64Image =  "iVBORw0KGgoAAAANSUhEUgAAAD8AAABPCAIAAADTH4pJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEcSURBVGhD7dhhEkMwFEZR67Ig67Eam7EY5TFIJGE09UXn3n + E5DDaqVbDm0OvC70u9LrQ60KvC70u9LrQ60KvC72uf9N3TVVVTbdsWX1bb7tsw287PnD6rvTomB2wVLf9sjfWTX0c8IXeZl7J812KLzRVjt61W + m5xorRB6c94xejn0YOD7qtlXj8I /pAjt5rt8BNfcQZvKatUu79P + oj17RW / qc2gS9HHxo6wxekXwZXra2TtN /W + 23H2 + l + 63B61JvcRYQ66t8Uel3odaHXhV4Xel3odWXXuz9zfxx6pysvFdlC74T + cuidTH /+Pp2n7Hr7ykR / pfz6J8uun /9veujmo9eFXhd6Xeh1odeFXhd6Xeh1odeFXtUwfAAVZQCdTukGsgAAAABJRU5ErkJggg == "


        const base64Image = await UploadIamge(event.itemImage);
        const imagefileName = await Iamge_FileName(event.fileName);

        const buffer = Buffer.from(base64Image, 'base64');
        const params = {
            Bucket: 'auctionhouse',
            Key: `images/${imagefileName}`, // Specify the desired file name and path
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg' // Adjust the content type as needed
        };
        const data = await s3.putObject(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image uploaded successfully', data })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading image', error: err })
        };
    }
};
