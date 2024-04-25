const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Config = require('../models/Config');


// Protected route
router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

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

module.exports = router;