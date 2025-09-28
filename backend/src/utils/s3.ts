import AWS from 'aws-sdk';
import path from 'path';
import { S3UploadResult } from '../types';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

export const uploadToS3 = (
  file: Express.Multer.File,
  folder: string = 'uploads',
  ownerId?: number
): Promise<S3UploadResult> => {
  const safeOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const keyPrefix = ownerId ? `${folder}/user-${ownerId}` : folder;
  const fileName = `${keyPrefix}/${timestamp}-${randomSuffix}-${safeOriginalName}`;
  
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET || 'tech-challenge-blog-uploads',
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (error) {
        reject(error);
      } else {
        resolve(data as S3UploadResult);
      }
    });
  });
};

export const deleteFromS3 = (key: string): Promise<void> => {
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET || 'tech-challenge-blog-uploads',
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(deleteParams, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const generateSignedUrl = (key: string, expiresIn: number = 3600): string => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET || 'tech-challenge-blog-uploads',
    Key: key,
    Expires: expiresIn,
  });
};
