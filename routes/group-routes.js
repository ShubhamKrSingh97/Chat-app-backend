const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group-controller');
const authenticate = require('../middlewares/authenticate');

router.post('/create-group', authenticate, groupController.makeGroup);
router.post('/add-member',authenticate,groupController.addMember);
router.get('/get-all-groups',authenticate,groupController.getAllGroups);
router.get('/get-members',authenticate,groupController.getAllMembers);
router.post('/make-admin',authenticate,groupController.makeAdmin);
router.delete('/remove-member',authenticate,groupController.removeMember);
module.exports = router;