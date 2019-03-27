const express = require('express');
const router = express.Router();
const userManagement = require('../controller/user_management.js');
const questionManagement = require('../controller/question_management.js');
const middlewares = require('../controller/middlewares.js');
const path = require("path");
const multer = require("multer");
const multerFactory = multer({
    dest: path.join(__dirname, '..', "uploads")
});

// User
router.get('/', userManagement.redirectToLogin);

router.get("/login", userManagement.login);
router.post("/login", userManagement.loginPOST);

router.get("/logout", userManagement.logout);

router.get("/profile", middlewares.existsCurrentUser, userManagement.profile);

router.get("/imgProfile/:id", userManagement.imgProfile);

router.get("/signup", userManagement.signup);
router.post("/signupValidator", multerFactory.single("imgProfile"), userManagement.signupValidator);

router.get("/friends", middlewares.existsCurrentUser, userManagement.friends);

router.get("/friendProfile/:id", middlewares.existsCurrentUser, userManagement.friendProfile);

router.get("/acceptFriend/:id", middlewares.existsCurrentUser, userManagement.acceptFriend);

router.get("/findFriends", middlewares.existsCurrentUser, userManagement.findFriend);
router.post("/searchFriends", middlewares.existsCurrentUser, userManagement.searchFriends);

router.get("/rejectFriend/:id", middlewares.existsCurrentUser, userManagement.rejectFriend);

router.get("/modifyProfile", middlewares.existsCurrentUser, userManagement.modifyProfile);
router.post("/modifyValidator", middlewares.existsCurrentUser, multerFactory.single("imgProfile"), userManagement.modifyValidator);

router.get("/requestFriend/:id", middlewares.existsCurrentUser, userManagement.requestFriend);

router.get("/uploadPhoto", middlewares.existsCurrentUser, userManagement.uploadPhoto);
router.post("/uploadPhoto", middlewares.existsCurrentUser, multerFactory.single("imgProfile"), userManagement.uploadPhotoPOST);

router.get("/deletePhoto/:id", middlewares.existsCurrentUser, userManagement.deletePhoto);

// Questions
router.get("/questions", middlewares.existsCurrentUser, questionManagement.questions);

router.get("/newQuestion", middlewares.existsCurrentUser, questionManagement.newQuestion);
router.post("/newQuestion", middlewares.existsCurrentUser, questionManagement.newQuestionPOST);

router.get("/answerQuestion", middlewares.existsCurrentUser, middlewares.question, questionManagement.answerQuestion);
router.post("/answerQuestion", middlewares.existsCurrentUser, middlewares.question, questionManagement.answerQuestionPOST);

router.get("/question/:id", middlewares.existsCurrentUser, questionManagement.question);
router.post("/getFriendAnswer/:id_friend", middlewares.existsCurrentUser, middlewares.question, questionManagement.getFriendAnswer);

router.get("/guess/:id_friend", middlewares.existsCurrentUser, middlewares.question, questionManagement.guess);

module.exports = router;