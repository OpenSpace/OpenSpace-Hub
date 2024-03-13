const { verify } = require('jsonwebtoken');
const moment = require('moment');
const { execOnce } = require('next/dist/shared/lib/utils');
var AdmZip = require("adm-zip");

function formatDate(date) {
    return moment(date).format('MM/DD/YYYY, HH:mm:ss [GMT]ZZ');
}

function validateItemFile(file) {
    validateItemFileType(file);
    validateItemFileSize(file);
    validateItemFileContents(file);
}

function validateItemFileType(file) {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();
    if (fileExtension !== 'zip' && fileExtension !== 'asset') {
        throw new Error('Invalid file type. Please upload a .zip or .asset file.');
    }
}

function validateItemFileSize(file) {
    if (file.size > 5 * Math.pow(10, 9) )   {
        throw new Error('File size exceeds 5 GB limit');
    }
}

function saveItemFile(file) {
    file.mv('frontend/public/filename.zip', function (err) {
        if (err) {
            throw new Error(err);
        }
    });
}

function saveItemToTempDir(file) {
    file.mv('frontend/public/temp/filename.zip', function (err) {
        if (err) {
            throw new Error(err);
        }
    });
}

function verifyZipItemIntegrity(file) {
    // verify the integrity and if integrity is not verified, throw error
    // zipFile = new AdmZip('frontend/public/temp/filename.zip');
    var zip = new AdmZip("frontend/public/temp/filename.zip");
    var zipEntries = zip.getEntries();
    console.log("dsaf");
    console.log(zipEntries);
    zipEntries.forEach(function (zipEntry) {
        console.log(zipEntry.toString());
        if (zipEntry.entryName == "filename.asset.pdf") {
            file.mv('frontend/public/filename.zip', function (err) {
                if (err) {
                    throw new Error(err);
                }
            });
            console.log(zipEntry.getData().toString("utf8"));
        }
    });
    zip.verify(function (err, success) {
        if (err) {
            throw new Error(err);
        }
        if (!success) {
            throw new Error('Integrity verification failed');
        }
    } );

    

}

function validateItemFileContents(file) {
    // zip -> store in temp dir -> verify the integrity -> scan the file -> unzip ->  folder name Fname -> check if there is a Fname.asset file
    // if not, throw error
    // if yes, check if there is a Fname folder
    // if not, throw error
    const fileExtension = file.name.split('.').pop();
    switch (fileExtension) {
        case 'zip':
            // store in temp dir
            saveItemToTempDir(file);

            // verify the integrity
            verifyZipItemIntegrity(file);

            // scan the file
            // unzip
            unzipFile(file);
            // check if there is a Fname.asset file
            // check if there is a Fname folder
            break;
        case 'asset':
            // check if there is a Fname folder
            break;
    }
    // file.mv('frontend/public/user/filename.zip', function (err) {
}

exports.formatDate = formatDate;
exports.validateItemFile = validateItemFile;
exports.saveItemFile = saveItemFile;