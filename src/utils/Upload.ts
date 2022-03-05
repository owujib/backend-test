import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  // destination: (req, file, callback) => {
  //   callback(null, 'uploads/files/');
  // },
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${file.fieldname}-file-${uniqueSuffix}`);
  },
});

const fileFilter = (req: Request, file: any, callback: Function) => {
  const supportedFiles = ['video/mov', 'video/mp4', 'video/webm', 'image/jpeg', 'image/png'];
  if (supportedFiles.includes(file.mimetype)) {
    return callback(null, true);
  }
  // reject file
  return callback(
    'Unsupported file format, please upload in webm or mp4 or mov format',
    false,
  );
};

export default multer({
  storage,
  limits: { fileSize: 2e+8 },
  fileFilter,
});
