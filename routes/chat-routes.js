const express=require('express');
const router= express.Router();
const chatController=require('../controllers/chat-controller');
const authenticate=require('../middlewares/authenticate');

router.post('/send-message',authenticate,chatController.addMessage);
router.get('/get-all-chats',authenticate,chatController.getAllChats);
module.exports=router;