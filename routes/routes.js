const express = require('express');
// const NodeClam = require('clamscan');
// const formidable = require('formidable');
const Model = require('./../models/model');
const utility = require('./../utils/utility')
const multer = require('multer');
const fs = require('fs');
const unzipper = require('unzipper');
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'frontend/public/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = router;

/**
 * @swagger
 * /api/health:
 *  get:
 *      summary: Health Check
 *      description: Check if server is up.
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          500:
 *              description: Internal server error.
 */
router.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    res.status(200).send(data);
});

/**
 * @swagger
 * /api/getAllItems:
 *  get:
 *      summary: Get all items
 *      description: Retrieve all itmes from the database.
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          500:
 *              description: Internal server error.
 */
router.get('/getAllItems', async (req, res) => {
    try {
        const data = await Model.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

/**
 * @swagger
 * /api/getItem/{id}:
 *  get:
 *      summary: Get item by id.
 *      description: Retrieve the item using id from the database.
 *      parameters:
 *          - in : path
 *            name : itemId
 *            required : true
 *            description: ID of the item to get
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          404:
 *              description: Item not found
 *          500:
 *              description: Internal server error.
 */
router.get('/getItem/:id', async (req, res) => {
    try {
        const data = await Model.findOne({ _id: req.params.id });
        if (!data) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})

/**
 * @swagger
 * /api/addItem:
 *  post:
 *      summary: Add a new item.
 *      description: Add a new hub item.
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          404:
 *              description: Item not found
 *          500:
 *              description: Internal server error.
 */
router.post('/addItem', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        author: req.body.author,
        currentVersion: req.body.currentVersion,
        image: req.body.image,
        archives: req.body.archives,
        created: fomateDate(new Date()),
        modified: fomateDate(new Date()),
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/**
 * @swagger
 * /api/upload:
 *  post:
 *      summary: Upload an item.
 *      consumes:
 *         - multipart/form-data
 *      parameters:
 *        - in: formData
 *          name: file
 *          required: true
 *          type: file
 * 
 *      description: Upload an item to the database.
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          400:
 *              description: Bad request.
 *          500:
 *              description: Internal server error.
 */
router.post('/upload_old', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ message: "No files were uploaded" });
    }


    let file = req.files.file;
    try {
        utility.validateItemFile(file);
        utility.saveItemFile(file);
        res.status(200).json({ message: "Uploaded successfully on server" });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
})

router.post('/upload', upload.single('file'), async (req, res) => {
    originalItemname = req.file.originalname.split('.')[0];
    if (req.file.mimetype === 'application/zip') {
        console.log('file is of type zip');
        fs.createReadStream(req.file.path)
            .pipe(unzipper.Extract({ path: `frontend/public/upload/unzipped/` }))
            .on('close', () => {
                fs.readdir(`frontend/public/upload/unzipped/${originalItemname}`, (err, files) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ error: 'Error reading directory' });
                    }
                    const assetFiles = files.filter(file => file.endsWith('.asset') && (file === originalItemname + ".asset"));
                    if (assetFiles.length > 0) {
                        res.status(200).send({ message: 'Zip file contains .asset files' });
                    } else {
                        fs.rm(`frontend/public/upload/unzipped/${originalItemname}`, { recursive: true }, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Folder deleted');
                            }
                        });
                        res.status(200).send({ message: 'Zip file does not contain .asset files' });
                    }
                });
                fs.unlink(req.file.path, (err) => {
                    console.log('file deleted');
                    if (err) {
                        console.log(err);
                    }
                });
            });
    }
    else if (req.file.originalname.split('.').pop() === 'asset') {
        console.log('file is of type asset');
        res.status(200).send({ message: 'file is of type.asset' });
    } else {
        fs.unlink(req.file.path, (err) => {
            console.log('unwanted file deleted');
            if (err) {
                console.log(err);
            }
        });
        res.status(400).json({ message: "Invalid file type. Please upload a .zip or .asset file." });
    }

    // return;
    // let file = req.files.file;
    // try {
    //     utility.validateItemFile(file);
    //     utility.saveItemFile(file);
    //     res.status(200).json({ message: "Uploaded successfully on server" });
    // } catch (error) {
    //     console.log(`Error: ${error.message}`);
    //     res.status(400).json({ message: error.message });
    // }
})