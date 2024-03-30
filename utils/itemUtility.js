const fs = require('fs');
const unzipper = require('unzipper');
const sharp = require('sharp')
const path = require('path');
const utility = require('./utility');
const Model = require('./../models/model');

exports.validateInputFields = (body) => {
    if (!body.title || !body.title.trim() ||
        !body.itemType || !body.itemType.trim() ||
        !body.license || !body.license.trim() ||
        !body.description || !body.description.trim()
    ) {
        throw new Error('Invalid Input Fields');
    }
}

exports.isAssetFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'zip' && fileExtension !== 'asset') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .zip or .asset file.');
    }
}

validateFileName = (file) => {
    if (file.originalname.split('.').length > 2) {
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

exports.isValidFileSize = (file) => {
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
            let newFile = { ...file }
            newFile.path = resizedFilePath;
            newFile.filename = resizedFileName;
            return newFile;
        });
    unlinkUploadedfile(file);
    return resizeResult;
}

exports.uploadAssetFileToServer = async (file, dir) => {
    try {
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
                throw new Error(`Zip file does not contain ${originalItemname}.asset file`);
            }
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
            return Promise.resolve();
        } else if (file.originalname.split('.').pop() === 'asset') {
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            // change file name
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else {
            console.log('Invalid file type');
            throw new Error('Invalid file type. Please upload a .zip or .asset file.');
        }
    } catch (err) {
        //delete uploaded file and directory
        fs.rm(dir, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            }
        });
        unlinkUploadedfile(file);
        return Promise.reject(err);
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

function getCurrentVersionNum(dir) {
    let version = 0;
    if (fs.existsSync(dir)) {
        let versions = fs.readdirSync(dir);
        versions.forEach(file => {
            let fileVersion = parseInt(file.split('_')[1]);
            if (fileVersion >= version) {
                version = fileVersion + 1;
            }
        });
    }
    return version;
}

exports.createUserDirectory = (dir, itemType) => {
    const itemTypes = ['asset', 'profile', 'recording', 'webPanel', 'config'];
    if (itemTypes.includes(itemType)) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    return dir;
}

exports.uploadAsset = async (req, user) => {
    const files = req.files;
    if (!files['image'] || !files['file']) {
        throw new Error('Both image and asset files are required');
    }

    const itemTitle = req.body.title.replace(/ /g, '_');
    const itemType = req.body.itemType;
    let dir = `public/upload/users/${user.username}/${itemType}/${itemTitle}`;
    let version = getCurrentVersionNum(dir);
    dir = `${dir}/V_${version}`;
    let uploadDirectory = this.createUserDirectory(dir, itemType);

    const imageFile = files['image'][0];
    const assetFile = files['file'][0];
    this.validateInputFields(req.body);

    // asset file upload
    this.isAssetFileType(assetFile);
    this.isValidFileSize(assetFile);
    await this.uploadAssetFileToServer(assetFile, uploadDirectory);

    // image file upload
    this.validateImageFileType(imageFile);
    this.validateImageFileSize(imageFile);
    let resizedFile = await this.resizeImage(imageFile);
    let imageFileName = resizedFile.originalname.split('.');
    imageFileName[0] = itemTitle;
    resizedFile.originalname = imageFileName.join('.');
    await this.uploadAssetFileToServer(resizedFile, uploadDirectory);

    const author = {
        name: user.name,
        link: user.link
    }

    const currentVersion = {
        version: `V_${version}`,
        url: path.relative('public', `${dir}/${assetFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.description = req.body.description;
        existingItem.currentVersion = currentVersion;
        existingItem.image = path.relative('public', `${dir}/${resizedFile.originalname}`);
        existingItem.modified = utility.getFormattedDate(new Date());
        const item = await existingItem.save();
        return item;
    } else {
        const newItem = new Model({
            name: req.body.title,
            type: req.body.itemType,
            description: req.body.description,
            author: author,
            currentVersion: currentVersion,
            image: path.relative('public', `${dir}/${resizedFile.originalname}`),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}