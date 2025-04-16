const express = require('express');
const router = express.Router();
const selectionController = require('../controllers/selectionController');

// get /api/select/leaveType
router.get('/leaveType', selectionController.leaveType);

// get /api/select/departmentType
router.get('/departmentType', selectionController.departmentType);

module.exports = router;