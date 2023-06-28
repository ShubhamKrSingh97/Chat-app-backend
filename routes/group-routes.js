const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group-controller');
const authenticate = require('../middlewares/authenticate');

router.post('/create-group', authenticate, groupController.makeGroup);
router.post('/add-member',authenticate,groupController.addMember);
module.exports = router;