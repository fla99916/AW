class DAOQestions {

    constructor(pool) {
        this.pool = pool;
    }

    /**
     * 
     * @param {*Question que queremos insertar} question 
     * @param {*Devuelve err y el id insertado} callback 
     */
    insertQuestion(question, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertQuestion): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO question(text) VALUES (?);", [question.text],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la primera consulta (insertQuestion)'), null);
                        else {
                            if (question.answers.length > 0) {
                                let values = [];
                                for (let i = 0; i < question.answers.length; i++) {
                                    values[i] = [result.insertId, question.answers[i]];
                                }
                                connection.query("INSERT INTO answer(id_question, text) VALUES ?", [values],
                                    function (err, rows) {
                                        if (err) callback(new Error('Error al ejecutar la segunda consulta (insertQuestion)'));
                                        else callback(null, rows.insertId);
                                    });
                            }
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id de la pregunta} idQuestion 
     * @param {*Respuesta de la pregunta} answers 
     * @param {*Devuelve err y el id de la respuesta insertada} callback 
     */
    insertAnswer(idQuestion, answer, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertAnswer): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO answer(id_question, text) VALUES (?, ?)", [idQuestion, answer],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (insertAnswer)'), null);
                        else callback(null, rows.insertId);
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que adivina} idUser 
     * @param {*id del amigo al que se le intenta adivinar la pregunta} idFriend 
     * @param {*id de la pregunta que se intenta adivinar} idQuestion 
     * @param {*Respuesta que elije el usuario} answer 
     * @param {*Devuelve err} callback 
     */
    insertOther(idUser, idFriend, idQuestion, answer, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertOther): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO other VALUES (?, ?, ?, ?)", [idUser, idFriend, idQuestion, answer],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (insertOther)'));
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*Devuelve err y la lista de preguntas} callback 
     */
    getQuestions(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getQuestions): ${err.message}`), false);
            else {
                connection.query(
                    //elegir todas las preguntas menos que aparecen en la tabla de my self
                    "SELECT * FROM question",
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getQuestions)'), null);
                        else {
                            if (rows.length > 0) {
                                let questionList = [];
                                for (let i = 0; i < rows.length; i++) {
                                    let question = {
                                        idQuestion: rows[i].id_question,
                                        textQuestion: rows[i].text
                                    };
                                    questionList.push(question);
                                }
                                callback(null, questionList);
                            } else callback(null, []);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id de la pregunta que queremos consultar} idQuestion 
     * @param {*Devuelve err y la pregunta} callback 
     */
    getQuestion(idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getQuestion): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT text FROM question WHERE id_question = ?", [idQuestion],
                    function (err, row) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getQuestion)'), null);
                        else callback(null, row[0]);

                    });
            }
        });
    }

    /**
     * 
     * @param {*id de la pregunta a la que queremos consultar sus respuestas} idQuestion 
     * @param {*Devuelve err y la lista de respuestas de la pregunta} callback 
     */
    getAnswers(idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getAnswers): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT answer.id_answer, answer.text AS a, question.text AS q FROM answer, question WHERE answer.id_question = ? AND question.id_question = ?", [idQuestion, idQuestion],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getAnswers)'), null);
                        else {
                            if (rows.length > 0) {
                                let answers = [];
                                for (let i = 0; i < rows.length; i++) {
                                    let answer = {
                                        question: rows[i].q,
                                        idAnswer: rows[i].id_answer,
                                        text: rows[i].a,
                                    };
                                    answers.push(answer);
                                }
                                callback(null, answers);
                            } else callback(null, []);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que contestó la pregunta} idUser 
     * @param {*id de la respuesta que eligió el usuario} idAnswer 
     * @param {*id de la pregunta que contestó el usuario} idQuestion 
     * @param {*Devuelve err} callback 
     */
    insertMySelf(idUser, idAnswer, idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertMySelf): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO myself VALUES (?,?,?)", [idUser, idQuestion, idAnswer],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (insertMySelf)'));
                        else {
                            callback(null);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que queremos consultar} idUser 
     * @param {*id de la pregunta que queremos consultar} idQuestion 
     * @param {*Devuelve err y el id de la respuesta a la pregunta idQuestion} callback 
     */
    getMyself(idUser, idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getMyself): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT * FROM myself WHERE id_user = ? AND id_question = ?", [idUser, idQuestion],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getMyself)'), null);
                        else {
                            callback(null, result);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario al que queremos consultar los amigos} idUser 
     * @param {*id de la pregunta que queremos consultar} idQuestion 
     * @param {*Devuelve err y la lista de amigos que contestaron esa pregunta} callback 
     */
    getFriendsAnwseredQuestion(idUser, idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getFriendsAnwseredQuestion): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT f.id_friend, m.id_answer, u.name, u.img_profile" +
                    " FROM friendship AS f, myself AS m, user AS u" +
                    " WHERE f.request = 'accepted'" +
                    " AND f.id_friend = m.id_user" +
                    " AND f.id_friend = u.id_user" +
                    " AND f.id_user = ?" +
                    " AND m.id_question = ? ORDER BY f.id_friend", [idUser, idQuestion],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getFriendsAnwseredQuestion)'), null);
                        else {
                            let friends = [];
                            if (result.length > 0) {
                                for (let i = 0; i < result.length; i++) {
                                    let friend = {
                                        imgProfile: result[i].img_profile,
                                        name: result[i].name,
                                        id_friend: result[i].id_friend,
                                        id_answer: result[i].id_answer
                                    }
                                    friends.push(friend);
                                }
                            }
                            callback(null, friends);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que queremos consultar} idUser 
     * @param {*id de la pregunta que queremos consultar} idQuestion 
     * @param {*Devuelve err y la lista de preguntas de amigos adivinadas por el usuario} callback 
     */
    getOther(idUser, idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getOther): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT DISTINCT o.id_friend, o.answer FROM other AS o WHERE o.id_user = ? AND o.id_question = ? ORDER BY o.id_friend", [idUser, idQuestion],
                    function (err, result) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getOther)'), null);
                        else {
                            let friends = [];
                            if (result.length > 0) {
                                for (let i = 0; i < result.length; i++) {
                                    let friend = {
                                        id_friend: result[i].id_friend,
                                        answer: result[i].answer,
                                    }
                                    friends.push(friend);
                                }
                            }
                            callback(null, friends);
                        }
                    });
            }
        });
    }
}

module.exports = DAOQestions;