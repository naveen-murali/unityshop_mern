import path from 'path';
import multer from 'multer';

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, '');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const checkFileType = (req, file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname)
        return cb(null, true);
    else
        return cb('Please provide images only with /jpg|jpeg|png/ types');
};

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) =>
        checkFileType(req, file, cb)
});