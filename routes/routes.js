const express = require('express');
const Model = require('../models/Model');
const Config = require('../models/Config');
const utility = require('./../utils/utility')
const multer = require('multer');
const path = require('path');
const itemUtility = require('../utils/itemUtility');
const authUtility = require('../utils/authUtility');
const jwt = require('jsonwebtoken')


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
        let sort = req.query.sort || 'name';
        let type = req.query.type || '';
        const itemOptions = ['asset', 'profile', 'recording', 'webpanel', 'video', 'config', 'package'];

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

        const items = await Model.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { 'author.name': { $regex: search, $options: 'i' } },
                        { license: { $regex: search, $options: 'i' } },
                    ]
                },
                { type: { $in: type } },
            ],
        })
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        console.log('items: ', items)

        const total = await Model.find({
            $and: [
                { name: { $regex: search, $options: 'i' } },
                { type: { $in: type } },
            ],
        }).countDocuments();

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
router.get('/getUserItems/:username', async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token || token === 'null') {
            console.log('Unauthorized request');
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        jwt.verify(token, process.env.SECRET_KEY);
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
 * /api/uploadItem:
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
router.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
    try {
        const jwtToken = req.headers['authorization'].split(' ')[1];
        const user = await authUtility.getUserInfo(jwtToken);
        if (req.body && req.body.video && req.body.video !== '') {
            itemUtility.validateInputFields(req.body);
            const data = await itemUtility.uploadVideo(req, user);
            const message = "Uploaded successfully on server";
            return res.status(200).json({ message: message, data: data });
        }

        if (!req.files || (!req.files['image'] && !req.body.itemType === 'config') || !req.files['file']) {
            return res.status(400).json({ error: 'Both image and hub-item file are required' });
        }

        itemUtility.validateInputFields(req.body);
        let data = ""
        switch (req.body.itemType) {
            case 'asset':
                data = await itemUtility.uploadAsset(req, user);
                break;
            case 'profile':
                data = await itemUtility.uploadProfile(req, user);
                break;
            case 'recording':
                data = await itemUtility.uploadRecording(req, user);
                break;
            case 'webpanel':
                data = await itemUtility.uploadWebPanel(req, user);
                break;
            case 'video':
                data = await itemUtility.uploadVideo(req, user);
                break;
            case 'config':
                data = await itemUtility.uploadConfig(req, user);
                break;
            case 'package':
                data = await itemUtility.uploadPackage(req, user);
                break;
            default:
                throw new Error('Invalid item type');
        }
        const message = "Uploaded successfully on server";
        res.status(200).json({ message: message, data: data });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
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
router.put('/updateItem/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
    try {
        const jwtToken = req.headers['authorization'].split(' ')[1];
        const user = await authUtility.getUserInfo(jwtToken);
        if (!jwtToken || jwtToken === 'null') {
            console.log('Unauthorized request');
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        jwt.verify(jwtToken, process.env.SECRET_KEY);
        
        let item = await Model.findById(req.params.id);
        if (req.files && req.files['file']) {
            switch (req.body.itemType) {
                case 'asset':
                    item = await itemUtility.updateAsset(req, user);
                    break;
                case 'profile':
                    item = await itemUtility.updateProfile(req, user);
                    break;
                case 'recording':
                    item = await itemUtility.updateRecording(req, user);
                    break;
                case 'webpanel':
                    item = await itemUtility.updateWebPanel(req, user);
                    break;
                case 'video':
                    item = await itemUtility.updateVideo(req, user);
                    break;
                case 'config':
                    item = await itemUtility.updateConfig(req, user);
                    break;
                case 'package':
                    item = await itemUtility.updatePackage(req, user);
                    break;
                default:
                    throw new Error('Invalid item type');
            }
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
router.delete('/deleteItem/:id', async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token || token === 'null') {
            console.log('Unauthorized request');
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        jwt.verify(token, process.env.SECRET_KEY);
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

