const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// POST /api/request/requestLeave
router.post('/requestLeave', requestController.requestLeave);
// POST /api/request/getdataid/:id
router.get('/getdataid/:id', requestController.getDataByID);
// GET /api/request/getdatarequest
router.get('/getdatarequest', requestController.getDataReq);
// GET /api/request/getdatarequestbyid/:id
router.get('/getdatarequestbyid/:id', requestController.getDataReqByID);

module.exports = router;