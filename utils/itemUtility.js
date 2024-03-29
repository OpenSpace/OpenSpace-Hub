const fs = require('fs');
const unzipper = require('unzipper');
const moment = require('moment');
const jwt = require('jsonwebtoken')
const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sharp = require('sharp')

exports.validateInputFields = (body) =>  {
    console.log(body);
    if (!body.title || !body.title.trim() || 
        !body.itemType || !body.itemType.trim() || 
        !body.license || !body.license.trim() || 
        !body.description || !body.description.trim()
    ){
        throw new Error('Invalid Input Fields');
    }
}

exports.validateItemFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'zip' && fileExtension !== 'asset') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .zip or .asset file.');
    }
}

validateFileName = (file) => {
    if(file.originalname.split('.').length > 2) {
        unlinkUploadedfile(file);
        throw new Error('Invalid file name. Please remove any special characters from the file name');
    }
}

exports.validateImageFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    const allowedImageTypes = ['jpg', 'jpeg', 'png'];
    if (!(allowedImageTypes.includes(fileExtension))) { 
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .jpg, .jpeg, or .png file');
     }
}

exports.validateItemFileSize = (file) => {
    if (file.size > 5 * Math.pow(10, 9)) {
        throw new Error('File size exceeds 5 GB limit');
    }
}

// 10^3 = 1 KB
// 10^6 = 1 MB
// 10^9 = 1 GB
exports.validateImageFileSize = (file) => {
    if (file.size > 5 * Math.pow(10, 6)) {
        throw new Error('File size exceeds 5 MB limit');
    }
}

exports.resizeImage = async (file) => {
    let resizedFileName = 'r_' + file.filename;
    let resizedFilePath = file.destination + resizedFileName;
    let resizeResult = await sharp(file.path)
    .resize(1280, 720)
    .toFile(resizedFilePath)
    .then(() => {
        let newFile = {...file}
        newFile.path = resizedFilePath;
        newFile.filename = resizedFileName;
        return newFile;
    });
    unlinkUploadedfile(file);
    return resizeResult;
}

exports.uploadItemToServer = async (file) => {
    if (file.mimetype === 'application/zip') {
        originalItemname = file.originalname.split('.')[0];
        await new Promise((resolve, reject) => {
            fs.createReadStream(file.path)
                .pipe(unzipper.Extract({ path: `public/upload/unzipped/` }))
                .on('close', () => {
                    resolve();
                })
                .on('error', (err) => {
                    console.log(err);
                    reject(new Error('Error extracting zip file'));
                });
        });

        const files = await fs.promises.readdir(`public/upload/unzipped/${originalItemname}`);
        const assetFiles = files.filter(file => file.endsWith('.asset') && (file === `${originalItemname}.asset`));
        if (assetFiles.length <= 0) {
            unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
            unlinkUploadedfile(file);
            return Promise.reject(new Error(`Zip file does not contain ${originalItemname}.asset file`));
        }
        unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
        return Promise.resolve();
    } else if (file.originalname.split('.').pop() === 'asset') {
        return Promise.resolve();
    } else if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        return Promise.resolve();
    } else {
        console.log('Invalid file type');
        unlinkUploadedfile(file);
        return Promise.reject(new Error('Invalid file type. Please upload a .zip or .asset file.'));
    }
}

function unlinkUploadedfile(file) {
    fs.unlink(file.path, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function unlinkUploadedDir(dir) {
    fs.rm(dir, { recursive: true }, (err) => {
        if (err) {
            console.log(err);
        }
    });
}