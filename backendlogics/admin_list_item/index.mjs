import mysql from 'mysql';

const pool = mysql.createPool({
    host: "auctionhousedb.cxyk4yi6kiox.us-east-1.rds.amazonaws.com",
    user: "prolog",
    password: "Prologauctionhouse24",
    database: "auctionhouse",
    connectionLimit: 10
});

export const handler = async (event) => {
    let response;

    const getAllItems = () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Items";
            pool.query(query, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    try {
        const items = await getAllItems();

        response = {
            statusCode: 200,
            items: items // Ensure `items` is returned in the response
        };
    } catch (err) {
        response = {
            statusCode: 500,
            error: err.message
        };
    }

    return response; // Always return a response object
};
