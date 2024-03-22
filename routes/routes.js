const express = require('express');
const Model = require('./../models/model');
const utility = require('./../utils/utility')
const multer = require('multer');
const path = require('path');


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destination = file.fieldname === 'file' ? 'public/upload/' : 'public/upload/images/';
        cb(null, destination)
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
        created: utility.getFormattedDate(new Date()),
        modified: utility.getFormattedDate(new Date()),
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
router.post('/upload', upload.fields([{name: 'image', maxCount:1}, {name: 'file', maxCount:1}]), async (req, res) => {
    try {
        console.log(req.files);

        if (!req.files || !req.files['image'] || !req.files['file']) {
            return res.status(400).json({ message: 'Both image and asset files are required' });
        }
        const imageFile = req.files['image'][0];
        const assetFile = req.files['file'][0];

        utility.validateInputFields(req.body);

        // asset file upload
        utility.validateItemFileType(assetFile);
        utility.validateItemFileSize(assetFile);
        await utility.uploadItemToServer(assetFile);

        // image file upload
        utility.validateImageFileType(imageFile);
        utility.validateImageFileSize(imageFile);
        await utility.uploadItemToServer(imageFile);

        const author = {
            name: req.body.author,
            link: req.body.link
        }

        const currentVersion = {
            version: "1.0",
            url: path.relative('public', assetFile.path)
        }

        const data = new Model({
            name: req.body.title,
            type: req.body.itemType,
            description: req.body.description,
            author: author,
            currentVersion: currentVersion,
            image: path.relative('public', imageFile.path),
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date()),
        })
        const dataToSave = await data.save();
        const message = "Uploaded successfully on server";
        res.status(200).json({ message: message, data: dataToSave })
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
})