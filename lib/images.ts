/* eslint-disable import/no-anonymous-default-export */
import { createReadStream } from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

type FileUpload = {
    size: number;
    originalFilename: string;
    mimetype: string;
    filepath: string;
};

export async function upload(file: FileUpload) {
    try {
        // Check file size (bytes) - Defaults to 2mb
        if (file.size > 2000000) {
            return {
                error: true,
                message: 'File size exceeds the 2mb limit',
            };
        }

        const fileExt = (/[^./\\]*$/.exec(file.originalFilename) || [''])[0];
        const s3Client = new S3Client({});
        const s3Bucket = process.env.S3_BUCKET_NAME;
        const fileUUID = uuidv4();
        const fileName = `${fileUUID}.${fileExt}`;

        // Check the mimetype of the file upload
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/bmp',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return {
                error: true,
                message:
                    'File type not supported. Supported types: jpeg, jpg, png, gif, bmp',
            };
        }

        // Upload the file
        const uploadCommand = new PutObjectCommand({
            Bucket: s3Bucket,
            Key: fileName,
            Body: createReadStream(file.filepath),
            ACL: 'public-read',
            ContentType: file.mimetype,
            ContentLength: file.size,
        });
        await s3Client.send(uploadCommand);

        // File response
        const fileResponse = {
            url: `https://${s3Bucket}.s3.amazonaws.com/${fileName}`,
            error: false,
        };

        return fileResponse;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export default {
    upload,
};
