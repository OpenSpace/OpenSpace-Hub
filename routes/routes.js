const express = require('express');
const Model = require('./../models/model');

const router = express.Router()


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
 *          500:
 *              description: Internal server error.
 */
router.get('/getItem/:id', (req, res) => {
    res.send(req.params.id)
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
 *          500:
 *              description: Internal server error.
 */
router.post('/addItem', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        image: req.body.image,
        date_added: req.body.date_added,
        date_modified: req.body.date_modified
    })

    try {
        const dataToSave = await data.save();
        console.log(dataToSave)
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})