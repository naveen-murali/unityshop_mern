import express from 'express';
import multer from 'multer';
const router = express.Router();
import { protect, admin } from '../middlewares/authMiddlewares.js';
import { s3UpdataSingle } from '../middlewares/awsUpload.js';

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, '');
    }
});

const upload = multer({ storage });

router.post('/',
    protect, admin,
    upload.single('image'),
    s3UpdataSingle,
    (req, res, next) => {
        res.send(req.file.path);
    }
);


export default router;