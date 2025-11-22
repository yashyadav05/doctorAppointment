const express = require('express');
const { registerUser, loginUser, getUserProfile, logOut, getAllDoctors } = require('../controller/user');
const { auth } = require('../middleware/jwt');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/signup',upload.single("image"),registerUser)
router.post('/login',loginUser)
router.get('/getdoctors',auth,getAllDoctors)
router.get('/usersProfile',auth,getUserProfile)
router.get('/logout',logOut)

module.exports = router;