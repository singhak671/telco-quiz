const controller = require('../controller/customerController');
const router = require('express').Router();
router.post('/customerDataCapture', controller.customerDataCapture);
router.post('/suspendAccount', controller.suspendAccount);

module.exports = router;