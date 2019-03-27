const path = require("path");

const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config.mysqlConfig);

const DAOQuestions = require("../DAOQuestions");
const DAOUsers = require("../DAOUsers");

let daoQuestions = new DAOQuestions(pool);
let daoUsers = new DAOUsers(pool);

function questions(request, response) {
    response.status(200);
    daoQuestions.getQuestions(function (err, questionList) {
        if (err) console.log(err);
        else {
            response.render("questions", {
                questionList: questionList
            });
        }
    });
}

function newQuestion(request, response) {
    response.status(200);
    response.render("new_question", {
        error: false
    });
}

function newQuestionPOST(request, response) {
    request.checkBody("text").notEmpty();
    request.checkBody("answer1").notEmpty();
    request.checkBody("answer2").notEmpty();
    request.checkBody("answer3").notEmpty();
    request.checkBody("answer4").notEmpty();
    request.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            let question = {
                text: request.body.text,
                answers: [request.body.answer1,
                    request.body.answer2,
                    request.body.answer3,
                    request.body.answer4
                ]
            };
            daoQuestions.insertQuestion(question, function (err, insertId) {
                if (err) console.log(err);
                else response.redirect("/questions");
            });
        } else {
            response.render("new_question", {
                error: true
            });
        }
    });
}

function answerQuestion(request, response) {
    daoQuestions.getAnswers(response.locals.questionId, function (err, answers) {
        if (err) console.log(err);
        else {
            response.render("answer_question", {
                question: answers[0].question,
                listAnswers: answers
            });
        }
    });
}

function answerQuestionPOST(request, response) {
    if (request.body.radAnswer === "newAnswerButton") {
        daoQuestions.insertAnswer(response.locals.questionId, request.body.newAnswerText, function (err, idAnswer) {
            if (err) console.log(err);
            else {
                daoQuestions.insertMySelf(response.locals.id_user, idAnswer, response.locals.questionId, function (err) {
                    if (err) console.log(err);
                    else response.redirect("/questions");
                });
            }
        });
    } else {
        daoQuestions.insertMySelf(response.locals.id_user, request.body.radAnswer, response.locals.questionId, function (err) {
            if (err) console.log(err);
            else response.redirect("/questions");
        });
    }
}

function question(request, response) {
    //Coger el texto de la pregunta
    daoQuestions.getAnswers(request.params.id, function (err, answers) {
        if (err) console.log(err);
        else {
            request.session.questionId = request.params.id;
            //coger si el user_id ha contestado o no a la pregunta
            daoQuestions.getMyself(response.locals.id_user, request.params.id, function (err, result) {
                if (err) console.log(err);
                else {
                    //coger los amigos que contestaron a la pregunta
                    daoQuestions.getFriendsAnwseredQuestion(response.locals.id_user, request.params.id, function (err, friendsList) {
                        if (err) console.log(err);
                        else {
                            //coger los amigos que has adivinado
                            daoQuestions.getOther(response.locals.id_user, request.params.id, function (err, friendsAnwsered) {
                                if (err) console.log(err);
                                else {
                                    let j = 0;
                                    for (let i = 0; i < friendsList.length && j < friendsAnwsered.length; i++) {
                                        //console.log(friendsList.indexOf(friendsAnwsered[i].id_friend));
                                        //f(friendsAnwsered[i].id_friend.indexOf(friendsList[].id_friend))
                                        if (friendsList[i].id_friend === friendsAnwsered[j].id_friend) {
                                            friendsList[i].answer = friendsAnwsered[j].answer;
                                            j++;
                                        }
                                    }
                                    response.render("question", {
                                        question: answers[0].question,
                                        existMyself: result,
                                        friends: friendsList
                                    });
                                }

                            });

                        }
                    });
                }
            });
        }
    });
}

function guess(request, response) {
    daoQuestions.getMyself(request.params.id_friend, response.locals.questionId, function (err, result) {
        if (err) console.log(err);
        else {
            //Coger todas las respuestas de la pregunta
            daoQuestions.getAnswers(response.locals.questionId, function (err, rows) {
                //shuffle rows
                for (var i = rows.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = rows[i];
                    rows[i] = rows[j];
                    rows[j] = temp;
                }
                let answer;
                for (let j = 0; j < rows.length; j++) {
                    if (rows[j].idAnswer == result[0].id_answer) answer = rows[j];
                }
                //reducir a 4 respuestas
                let posAnswer = Math.floor(Math.random() * 5);
                let randomAnswers = [];
                randomAnswers = rows.slice(0, 4);
                if (!randomAnswers.includes(answer))
                    randomAnswers[posAnswer] = answer;

                response.render("answer_friend_question", {
                    question: randomAnswers[0].question,
                    listAnswers: randomAnswers,
                    id_friend: request.params.id_friend
                });

            })
        }
    });
}

function getFriendAnswer(request, response) {
    if (request.body.radAnswer !== undefined) {
        daoQuestions.getMyself(request.params.id_friend, response.locals.questionId, function (err, result) {
            if (err) console.log(err);
            else {
                if (result[0].id_answer == request.body.radAnswer)
                    daoQuestions.insertOther(response.locals.id_user, request.params.id_friend, response.locals.questionId, 'C', function (err) {
                        if (err) console.log(err);
                        else daoUsers.insertPoints(response.locals.id_user, 50, function (err, points) {
                            if (err) console.log(err);
                            else {
                                request.session.currentUser.points = points;
                                response.redirect("/question/" + response.locals.questionId);
                            }
                        });
                    });
                else {
                    daoQuestions.insertOther(response.locals.id_user, request.params.id_friend, response.locals.questionId, 'F', function (err) {
                        if (err) console.log(err);
                        else {
                            response.redirect("/question/" + response.locals.questionId);
                        }
                    });
                }

            }
        });
    }
}

module.exports = {
    questions: questions,
    newQuestion: newQuestion,
    newQuestionPOST: newQuestionPOST,
    answerQuestion: answerQuestion,
    answerQuestionPOST: answerQuestionPOST,
    question: question,
    guess: guess,
    getFriendAnswer: getFriendAnswer
};