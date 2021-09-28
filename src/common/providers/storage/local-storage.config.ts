import { randomBytes } from 'crypto';
import { diskStorage } from 'multer';

export const LocalStorageConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const { originalname } = file;

      const parsedName = originalname.replace(' ', '_');
      cb(null, `${randomBytes(8).toString('hex')}-${parsedName}`);
    },
  }),
};
