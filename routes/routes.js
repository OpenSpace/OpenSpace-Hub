const express = require('express');
const Model = require('../models/Model');
const Config = require('../models/Config');
const utility = require('./../utils/utility')
const multer = require('multer');
const path = require('path');
const itemUtility = require('../utils/itemUtility');
const authUtility = require('../utils/authUtility');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destination = file.fieldname === 'file' ? 'uploads/' : 'uploads/images/';
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
 * /api/items:
 *  get:
 *      summary: Get items.
 *      description: Retrieve the items from the database.
 *      parameters:
 *          - in : query
 *            name : page
 *            required : false
 *            description: Page number
 *          - in : query
 *            name : limit
 *            required : false
 *            description: Number of items per page
 *          - in : query
 *            name : search
 *            required : false
 *            description: Search string
 *          - in : query
 *            name : sort
 *            required : false
 *            description: Sort by field
 *          - in : query
 *            name : itemType
 *            required : false
 *            description: Type of the item
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          500:
 *              description: Internal server error.
 *          404:
 *              description: Item not found
 *          401:
 *              description: Unauthorized request
 */
router.get('/items', async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        let sort = req.query.sort || 'modified';
        let type = req.query.type || '';
        const itemOptions = ['asset', 'profile', 'recording', 'webpanel', 'video', 'config', 'package'];
        const username = req.query.username || '';

        type === 'all'
            ? (type = [...itemOptions])
            : (type = req.query.type.split(","));

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1] === 'asc' ? 1 : -1;
        } else {
            sortBy[sort[0]] = 1;
        }

        let query = {
            $and: [
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { 'author.name': { $regex: search, $options: 'i' } },
                        { license: { $regex: search, $options: 'i' } },
                        { type: { $regex: search, $options: 'i' } },
                    ]
                },
                { type: { $in: type } }
            ]
        };

        let queryForToal = {
            $and: [
                { name: { $regex: search, $options: 'i' } },
                { type: { $in: type } },
            ],
        };

        if (username !== '') {
            query.$and.push({ 'author.username': username });
            queryForToal.$and.push({ 'author.username': username });
        }

        const items = await Model.find(query)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);
        
        const total = await Model.find(queryForToal).countDocuments();

        const response = {
            error: false,
            message: 'Items fetched successfully',
            total,
            page: page + 1,
            limit: limit,
            types: itemOptions,
            items: items,
        };
        res.status(200).json(response);
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

/**
 * @swagger
 * /api/getUserItems/{username}:
 *  get:
 *      summary: Get user items.
 *      description: Retrieve the items using username from the database.
 *      parameters:
 *          - in : path
 *            name : username
 *            required : true
 *            description: Username of the user to get items
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          404:
 *              description: Item not found
 *          500:
 *              description: Internal server error.
 */
router.get('/getUserItems/:username', verifyToken, async (req, res) => {
    try {
        const data = await Model.find({ 'author.username': req.params.username });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const data = new Model({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        author: req.body.author,
        currentVersion: req.body.currentVersion,
        license: req.body.license,
        openspaceVersion: req.body.openspaceVersion,
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
router.post('/upload', verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await authUtility.getUserInfo(req.user);
        if (req.body && req.body.video && req.body.video !== '') {
            await itemUtility.validateInputFields(req.body);
            const data = await itemUtility.uploadVideo(req, user);
            const message = "Uploaded successfully on server";
            return res.status(200).json({ message: message, data: data });
        }

        if (!req.files || (!req.files['image'] && !req.body.itemType === 'config') || !req.files['file']) {
            return res.status(400).json({ error: 'Both image and hub-item file are required' });
        }

        await itemUtility.validateInputFields(req.body);
        let data = await itemUtility.uploadItem(req, user);
        const message = "Uploaded successfully on server";
        res.status(200).json({ message: message, data: data });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
})

/**
 * @swagger
 * /api/validateItemName/{name}:
 *  get:
 *      summary: Validate item name.
 *      description: Validate the item name from the database.
 *      parameters:
 *          - in : path
 *            name : name
 *            required : true
 *            description: Name of the item to validate
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          400:
 *              description: Item name already exists
 *          500:
 *              description: Internal server error.
 */
router.get('/validateItemName/:name', verifyToken, async (req, res) => {
    try {
        const user = await authUtility.getUserInfo(req.user);
        const data = await Model.findOne({ name: req.params.name });
        if (!data) {
            return res.status(200).json({ message: 'Item name is available' });
        }
        res.status(400).json({ error: 'Item name already exists' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @swagger
 * /api/updateItem/{id}:
 *  put:
 *      summary: Update item by id.
 *      description: Update the item using id from the database.
 *      parameters:
 *          - in : path
 *            name : itemId
 *            required : true
 *            description: ID of the item to update
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          404:
 *              description: Item not found
 *          500:
 *              description: Internal server error.
 */
router.put('/updateItem/:id', verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await authUtility.getUserInfo(req.user);

        let item = await Model.findById(req.params.id);
        if (req.files && req.files['file']) {
            item = await itemUtility.uploadItem(req, user, true);
        }

        if (req.files && req.files['image']) {
            item = await itemUtility.updateImage(req, user);
        }

        item = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const message = "Uploaded successfully on server";
        res.status(200).json({ message: message, item: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @swagger
 * /api/deleteItem/{id}:
 *  delete:
 *      summary: Delete item by id.
 *      description: Delete the item using id from the database.
 *      parameters:
 *          - in : path
 *            name : itemId
 *            required : true
 *            description: ID of the item to delete
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          404:
 *              description: Item not found
 *          500:
 *              description: Internal server error.
 */
router.delete('/deleteItem/:id', verifyToken, async (req, res) => {
    try {
        const data = await Model.findOneAndDelete({ _id: req.params.id });
        if (!data) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @swagger
 * /api/config:
 *  get:
 *      summary: Get configs.
 *      description: Retrieve the configs from the database.
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          500:
 *              description: Internal server error.
 */
router.get('/config', async (req, res) => {
    try {
        const config = await Config.findOne();
        const response = {
            error: false,
            message: 'Configs fetched successfully',
            config,
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.post('/config', async (req, res) => {
    const data = new Config();
    try {
        const resp = await Config.findOne();
        if (resp) {
            return res.status(400).json({ message: 'Config already exists' });
        }
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

