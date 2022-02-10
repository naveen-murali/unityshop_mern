import path from 'path';
import asynHandler from 'express-async-handler';
import AWS from 'aws-sdk';

export const s3Multiple = asynHandler(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: 'ap-south-1'
    });
    const response = [];
    const files = req.files;

    files.forEach(async file => {
        const params = {
            Bucket: process.env.BUCKT_NAME,
            Key: `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
            Body: file.buffer
        };

        try {
            const data = await s3.upload(params).promise();
            response.push({ path: data.Location });

            if (response.length === files.length) {
                req.files = response;
                next();
            }
        } catch (err) {
            console.error(err);
            res.status(400);
            throw new Error('Upload failed');
        }
    });
});

export const s3UpdataSingle = asynHandler(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: 'ap-south-1'
    });
    const file = req.file;
    
    const params = {
        Bucket: process.env.BUCKT_NAME,
        Key: file.originalname,
        Body: file.buffer
    };

    try {
        const data = await s3.upload(params).promise();
        req.file = { path: data.Location };

        next();
    } catch (err) {
        console.error(err);
        res.status(400);
        throw new Error('Upload failed');
    }
});