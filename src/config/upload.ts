import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'temp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tempFolder: string;
  uploadFolder: string;

  multer: {
    storage: multer.StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DIRVE,

  tempFolder,
  uploadFolder: path.resolve(__dirname, '..', '..', 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber',
    },
  },
} as IUploadConfig;
