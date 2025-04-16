const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// post /api/user/regisUser
router.post('/regisUser', usersController.regisUser);
// get /api/user/allUser
router.get('/allUser', usersController.getAllUser);
// get /api/user/allUser/:id
router.get('/getuserid/:id', usersController.getUserById);

module.exports = router;