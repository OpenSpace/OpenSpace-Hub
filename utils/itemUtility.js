const fs = require('fs');
const unzipper = require('unzipper');
const sharp = require('sharp')
const path = require('path');
const utility = require('./utility');
const Model = require('../models/Model');

exports.validateInputFields = (body) => {
    if (!body.title || !body.title.trim() ||
        !body.itemType || !body.itemType.trim() ||
        !body.license || !body.license.trim() ||
        !body.description || !body.description.trim()
    ) {
        throw new Error('Invalid Input Fields');
    }
}

function createAuthor(user) {
    return {
        name: user.name,
        username: user.username,
        link: user.link
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

exports.isPackageFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'zip') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .zip file.');
    }
}

exports.isProfileFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'profile') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .profile file.');
    }
}

exports.isrecordingFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'osrec' && fileExtension !== 'osrectxt') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .osrec or .osrectxt file.');
    }
}

exports.isWebPanelFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'zip') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .zip');
    }
}

exports.isConfigFileType = (file) => {
    const fileName = file.originalname;
    validateFileName(file);
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'json') {
        unlinkUploadedfile(file);
        throw new Error('Invalid file type. Please upload a .json file.');
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
            const containsExeFile = files.some(file => file.endsWith('.exe'));
            if (containsExeFile) {
                unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
                throw new Error('Zip file contains .exe file');
            }
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

exports.uploadPackageFileToServer = async (file, dir) => {
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
            const containsExeFile = files.some(file => file.endsWith('.exe'));
            if (containsExeFile) {
                unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
                throw new Error('Zip file contains .exe file');
            }
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
            return Promise.resolve();
        } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            // change file name
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else {
            console.log('Invalid file type');
            throw new Error('Invalid file type. Please upload a .zip file.');
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

exports.uploadProfileFileToServer = async (file, dir) => {
    try {
        if (file.originalname.split('.').pop() === 'profile') {
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            // change file name
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else {
            console.log('Invalid file type');
            throw new Error('Invalid file type. Please upload a .profile file.');
        }
    } catch (err) {
        console.log(err);
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

exports.uploadRecordingFileToServer = async (file, dir) => {
    try {
        if (file.originalname.split('.').pop() === 'osrec' || file.originalname.split('.').pop() === 'osrectxt') {
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            // change file name
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else {
            console.log('Invalid file type');
            throw new Error('Invalid file type. Please upload a .profile file.');
        }
    } catch (err) {
        console.log(err);
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

exports.uploadWebPanelFileToServer = async (file, dir) => {
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
            const containsExeFile = files.some(file => file.endsWith('.exe'));
            if (containsExeFile) {
                unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
                throw new Error('Zip file contains .exe file');
            }
            const assetFiles = files.filter(file => (file.endsWith('.html') || file.endsWith('.htm')) && (file === `index.html` || file === `index.htm`));
            if (assetFiles.length <= 0) {
                unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
                throw new Error(`Zip file does not contain index.html file`);
            }
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            unlinkUploadedDir(`public/upload/unzipped/${originalItemname}`);
            return Promise.resolve();
        } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            // change file name
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else {
            console.log('Invalid file type');
            throw new Error('Invalid file type. Please upload a .zip');
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

exports.uploadConfigFileToServer = async (file, dir) => {
    try {
        if (file.originalname.split('.').pop() === 'json') {
            fs.renameSync(file.path, `${dir}/${file.originalname}`);
            return Promise.resolve();
        } else {
            console.log('Invalid file type');
            throw new Error('Invalid file type. Please upload a .json file.');
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
    let version = 1;
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
    const itemTypes = ['asset', 'profile', 'recording', 'webpanel', 'config', 'package'];
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
    dir = `${dir}${version}`;
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

    const author = createAuthor(user);

    const currentVersion = {
        version: `${version}`,
        url: path.relative('public', `${dir}/${assetFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
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
            license: req.body.license,
            currentVersion: currentVersion,
            image: path.relative('public', `${dir}/${resizedFile.originalname}`),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}

exports.uploadPackage = async (req, user) => {
    const files = req.files;
    if (!files['image'] || !files['file']) {
        throw new Error('Both image and package files are required');
    }

    const itemTitle = req.body.title.replace(/ /g, '_');
    const itemType = req.body.itemType;
    console.log(req.body)
    let dir = `public/upload/users/${user.username}/${itemType}/${itemTitle}`;
    let version = getCurrentVersionNum(dir);
    dir = `${dir}${version}`;
    let uploadDirectory = this.createUserDirectory(dir, itemType);

    const imageFile = files['image'][0];
    const packageFile = files['file'][0];
    this.validateInputFields(req.body);

    // package file upload
    this.isPackageFileType(packageFile);
    this.isValidFileSize(packageFile);
    await this.uploadPackageFileToServer(packageFile, uploadDirectory);

    // image file upload
    this.validateImageFileType(imageFile);
    this.validateImageFileSize(imageFile);
    let resizedFile = await this.resizeImage(imageFile);
    let imageFileName = resizedFile.originalname.split('.');
    imageFileName[0] = itemTitle;
    resizedFile.originalname = imageFileName.join('.');
    await this.uploadPackageFileToServer(resizedFile, uploadDirectory);

    const author = createAuthor(user);

    const currentVersion = {
        version: `${version}`,
        url: path.relative('public', `${dir}/${packageFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
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
            license: req.body.license,
            currentVersion: currentVersion,
            image: path.relative('public', `${dir}/${resizedFile.originalname}`),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}


exports.uploadProfile = async (req, user) => {
    const files = req.files;
    if (!files['image'] || !files['file']) {
        throw new Error('Both image and asset files are required');
    }

    const itemTitle = req.body.title.replace(/ /g, '_');
    const itemType = req.body.itemType;
    let dir = `public/upload/users/${user.username}/${itemType}/${itemTitle}`;
    let version = getCurrentVersionNum(dir);
    dir = `${dir}/${version}`;
    let uploadDirectory = this.createUserDirectory(dir, itemType);

    const imageFile = files['image'][0];
    const profileFile = files['file'][0];
    this.validateInputFields(req.body);

    // profile file upload
    this.isProfileFileType(profileFile);
    this.isValidFileSize(profileFile);
    await this.uploadProfileFileToServer(profileFile, uploadDirectory);

    // image file upload
    this.validateImageFileType(imageFile);
    this.validateImageFileSize(imageFile);
    let resizedFile = await this.resizeImage(imageFile);
    let imageFileName = resizedFile.originalname.split('.');
    imageFileName[0] = itemTitle;
    resizedFile.originalname = imageFileName.join('.');
    await this.uploadProfileFileToServer(resizedFile, uploadDirectory);

    const author = createAuthor(user);

    const currentVersion = {
        version: `${version}`,
        url: path.relative('public', `${dir}/${profileFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
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
            license: req.body.license,
            currentVersion: currentVersion,
            image: path.relative('public', `${dir}/${resizedFile.originalname}`),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}

exports.uploadRecording = async (req, user) => {
    const files = req.files;
    if (!files['image'] || !files['file']) {
        throw new Error('Both image and asset files are required');
    }

    const itemTitle = req.body.title.replace(/ /g, '_');
    const itemType = req.body.itemType;
    let dir = `public/upload/users/${user.username}/${itemType}/${itemTitle}`;
    let version = getCurrentVersionNum(dir);
    dir = `${dir}/${version}`;
    let uploadDirectory = this.createUserDirectory(dir, itemType);

    const imageFile = files['image'][0];
    const recordingFile = files['file'][0];
    this.validateInputFields(req.body);

    // recording file upload
    this.isrecordingFileType(recordingFile);
    this.isValidFileSize(recordingFile);
    await this.uploadRecordingFileToServer(recordingFile, uploadDirectory);

    // image file upload
    this.validateImageFileType(imageFile);
    this.validateImageFileSize(imageFile);
    let resizedFile = await this.resizeImage(imageFile);
    let imageFileName = resizedFile.originalname.split('.');
    imageFileName[0] = itemTitle;
    resizedFile.originalname = imageFileName.join('.');
    await this.uploadRecordingFileToServer(resizedFile, uploadDirectory);

    const author = createAuthor(user);

    const currentVersion = {
        version: `${version}`,
        url: path.relative('public', `${dir}/${recordingFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
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
            license: req.body.license,
            currentVersion: currentVersion,
            image: path.relative('public', `${dir}/${resizedFile.originalname}`),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}

exports.uploadWebPanel = async (req, user) => {
    const files = req.files;
    if (!files['image'] || !files['file']) {
        throw new Error('Both image and webpanel files are required');
    }

    const itemTitle = req.body.title.replace(/ /g, '_');
    const itemType = req.body.itemType;
    let dir = `public/upload/users/${user.username}/${itemType}/${itemTitle}`;
    let version = getCurrentVersionNum(dir);
    dir = `${dir}/${version}`;
    let uploadDirectory = this.createUserDirectory(dir, itemType);

    const imageFile = files['image'][0];
    const webPanelFile = files['file'][0];
    this.validateInputFields(req.body);

    // web panel file upload
    this.isWebPanelFileType(webPanelFile);
    this.isValidFileSize(webPanelFile);
    await this.uploadWebPanelFileToServer(webPanelFile, uploadDirectory);

    // image file upload
    this.validateImageFileType(imageFile);
    this.validateImageFileSize(imageFile);
    let resizedFile = await this.resizeImage(imageFile);
    let imageFileName = resizedFile.originalname.split('.');
    imageFileName[0] = itemTitle;
    resizedFile.originalname = imageFileName.join('.');
    await this.uploadWebPanelFileToServer(resizedFile, uploadDirectory);

    const author = createAuthor(user);

    const currentVersion = {
        version: `${version}`,
        url: path.relative('public', `${dir}/${webPanelFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
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
            license: req.body.license,
            currentVersion: currentVersion,
            image: path.relative('public', `${dir}/${resizedFile.originalname}`),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}

exports.uploadVideo = async (req, user) => {
    if (!req.body.video) {
        throw new Error('Video link is required');
    }

    this.validateInputFields(req.body);

    const author = createAuthor(user);

    const currentVersion = {
        version: `1`,
        url: req.body.video
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
        existingItem.description = req.body.description;
        currentVersion.version = `${parseInt(existingItem.currentVersion.version.split('_')[1]) + 1}`;
        existingItem.currentVersion = currentVersion;
        existingItem.modified = utility.getFormattedDate(new Date());
        const item = await existingItem.save();
        return item;
    } else {
        const newItem = new Model({
            name: req.body.title,
            type: req.body.itemType,
            description: req.body.description,
            author: author,
            license: req.body.license,
            image: 'defaults/images/video-icon.jpg',
            currentVersion: currentVersion,
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}

exports.uploadConfig = async (req, user) => {
    const files = req.files;
    if (!files['file']) {
        throw new Error('Config file is required');
    }

    const itemTitle = req.body.title.replace(/ /g, '_');
    const itemType = req.body.itemType;
    let dir = `public/upload/users/${user.username}/${itemType}/${itemTitle}`;
    let version = getCurrentVersionNum(dir);
    dir = `${dir}/${version}`;
    let uploadDirectory = this.createUserDirectory(dir, itemType);

    const configFile = files['file'][0];
    this.validateInputFields(req.body);

    // web panel file upload
    this.isConfigFileType(configFile);
    this.isValidFileSize(configFile);
    await this.uploadConfigFileToServer(configFile, uploadDirectory);

    const author = createAuthor(user);

    const currentVersion = {
        version: `${version}`,
        url: path.relative('public', `${dir}/${configFile.originalname}`)
    }

    const existingItem = await Model.findOne({ name: req.body.title, type: req.body.itemType });
    if (existingItem) {
        const archive = {
            version: existingItem.currentVersion.version,
            url: existingItem.currentVersion.url
        }
        existingItem.archives.push(archive);
        existingItem.author = author;
        license: req.body.license,
        existingItem.description = req.body.description;
        existingItem.currentVersion = currentVersion;
        existingItem.modified = utility.getFormattedDate(new Date());
        const item = await existingItem.save();
        return item;
    } else {
        const newItem = new Model({
            name: req.body.title,
            type: req.body.itemType,
            description: req.body.description,
            author: author,
            image: 'defaults/images/config-icon.jpg',
            currentVersion: currentVersion,
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const item = await newItem.save();
        return item;
    }
}