const fs = require('fs');
const unzipper = require('unzipper');
const moment = require('moment');

exports.getFormattedDate = (date) => {
    return moment(date).format('MM/DD/YYYY, HH:mm:ss [GMT]ZZ');
}

exports.validateInputFields = (body) =>  {
    console.log(body);
    if (!body.title || !body.title.trim() || 
        !body.itemType || !body.itemType.trim() || 
        !body.license || !body.license.trim() || 
        !body.author || !body.author.trim() ||
        !body.description || !body.description.trim()
    ){
        throw new Error('Invalid Input Fields');
    }
}

exports.validateItemFileType = (file) => {
    const fileName = file.originalname;
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'zip' && fileExtension !== 'asset') {
        throw new Error('Invalid file type. Please upload a .zip or .asset file.');
    }
}

exports.validateItemFileSize = (file) => {
    if (file.size > 5 * Math.pow(10, 9)) {
        throw new Error('File size exceeds 5 GB limit');
    }
}


exports.uploadItemToServer = async (req) => {
    if (req.file.mimetype === 'application/zip') {
        originalItemname = req.file.originalname.split('.')[0];
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(unzipper.Extract({ path: `frontend/public/upload/unzipped/` }))
                .on('close', () => {
                    resolve();
                })
                .on('error', (err) => {
                    console.log(err);
                    reject(new Error('Error extracting zip file'));
                });
        });

        const files = await fs.promises.readdir(`frontend/public/upload/unzipped/${originalItemname}`);
        const assetFiles = files.filter(file => file.endsWith('.asset') && (file === `${originalItemname}.asset`));
        if (assetFiles.length <= 0) {
            unlinkUploadedDir(`frontend/public/upload/unzipped/${originalItemname}`);
            unlinkUploadedfile(req.file);
            return Promise.reject(new Error(`Zip file does not contain ${originalItemname}.asset file`));
        }
        unlinkUploadedfile(req.file);
        return Promise.resolve();
    } else if (req.file.originalname.split('.').pop() === 'asset') {
        return Promise.resolve();
    } else {
        unlinkUploadedfile(req.file);
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