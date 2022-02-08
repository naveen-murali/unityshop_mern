import path, { extname } from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();
import { protect, admin } from '../middlewares/authMiddlewares.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post('/',
    protect, admin,
    upload.single('image'),
    (req, res, next) => {
        res.send(req.file.path);
    }
);


export default router;