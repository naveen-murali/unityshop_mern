import path from 'path';
import asynHandler from 'express-async-handler';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: 'AKIA3XO2Y5UIBVC5BPU6',
    secretAccessKey: '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',
    region: 'ap-south-1'
});

export const s3Multiple = asynHandler(async (req, res, next) => {
    console.log(req.files);
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
    const file = req.file;
    console.log(req.file);

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