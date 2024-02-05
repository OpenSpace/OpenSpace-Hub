const express = require('express');
const Model = require('./../models/model');

const router = express.Router()


module.exports = router;

//Post Method
// router.post('/post', (req, res) => {
//     res.send('Post API')
// })

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        // Assuming Model is the Mongoose model you're working with
        const data = await Model.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // res.send('Get All API')
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
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

router.post('/post', async (req, res) => {
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