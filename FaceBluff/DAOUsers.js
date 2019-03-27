class DAOUsers {

    constructor(pool) {
        this.pool = pool;
    }

    /**
     * 
     * @param {*Email del usuario que queremos comprobar} email 
     * @param {*Contraseña del usuario que queremos comprobar} password 
     * @param {*Devuelve err, si el usuario existe o no y el usuario en caso de existir} callback 
     */
    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (isUserCorrect): ${err.message}`), false);
            else {
                // ... realizar consulta ...
                connection.query(
                    "SELECT * FROM user WHERE email = ? AND password = ?", [email, password],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (isUserCorrect)'), false);
                        else {

                            // Acceso a las filas resultado de la consulta
                            if (rows.length != 0) {
                                let user = {
                                    id_user: rows[0].id_user,
                                    email: rows[0].email,
                                    password: rows[0].password,
                                    name: rows[0].name,
                                    gender: rows[0].gender,
                                    birthdate: rows[0].birthdate,
                                    imgProfile: rows[0].img_profile,
                                    points: rows[0].points
                                };
                                callback(null, true, user);
                            } else callback(null, false, null);
                        }
                    }
                );
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que queremos consultar} idUser 
     * @param {*Devuelve err y el usuario consultado} callback 
     */
    getUserByID(idUser, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getUserByID): ${err.message}`), false);
            else {
                // ... realizar consulta ...
                connection.query(
                    "SELECT *, DATE(birthdate) FROM user WHERE id_user = ?", [idUser],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getUserByID)'), false);
                        else {
                            // Acceso a las filas resultado de la consulta
                            if (rows.length != 0) {
                                let user = {
                                    id_user: rows[0].id_user,
                                    email: rows[0].email,
                                    password: rows[0].password,
                                    name: rows[0].name,
                                    gender: rows[0].gender,
                                    birthdate: rows[0].birthdate,
                                    imgProfile: rows[0].img_profile,
                                    points: rows[0].points
                                };
                                callback(null, user);
                            } else callback(null, null);
                        }
                    }
                );
            }
        });
    }

    /**
     * 
     * @param {*Email que queremos comprobar} email 
     * @param {*Devuelve err y si el email existe o no} callback 
     */
    emailExist(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (emailExist): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT * FROM user WHERE email = ?", [email],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (emailExist)'), false);
                        else {
                            if (rows.length != 0) callback(null, true);
                            else callback(null, false);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*Usuario que queremos insertar} user 
     * @param {*Devuelve err y el id del usuario insertado} callback 
     */
    insertUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertUser): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO user(email, password, name, gender, birthdate, img_profile, points) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                    [user.email, user.password, user.name, user.gender, user.birthdate, user.imgProfile, user.points],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (insertUser)'), null);
                        else callback(null, rows.insertId);
                    });
            }
        });
    }

    /**
     * 
     * @param {*Usuario que queremos actualizar} user 
     * @param {*Devuelve err} callback 
     */
    updateUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (updateUser): ${err.message}`), false);
            else {
                connection.query(
                    "UPDATE user SET email = ?, password = ?, name = ?, gender = ?, birthdate = ?, img_profile = ? WHERE id_user = ?", [user.email, user.password, user.name, user.gender, user.birthdate, user.imgProfile, user.id_user],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (updateUser)'));
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {id del usuario al que queremos consultar sus amigos} idUser 
     * @param {*Devuelve err y la lista de amigos} callback 
     */
    getFriends(idUser, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getFriends): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT f.id_user, f.id_friend, f.request, u.name, u.img_profile FROM friendship AS f, user AS u WHERE f.id_friend = u.id_user AND f.id_user = ?", [idUser],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getFriends)'), null);
                        else {
                            if (rows.length > 0) {
                                let friendList = [];
                                for (let i = 0; i < rows.length; i++) {
                                    let friend = {
                                        idFriend: rows[i].id_friend,
                                        request: rows[i].request,
                                        name: rows[i].name,
                                        imgProfile: rows[i].img_profile
                                    };
                                    friendList.push(friend);
                                }
                                callback(null, friendList);
                            } else callback(null, []);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que solicita la amistad} idUser 
     * @param {*id del usuario que acepta la amistad} idFriend 
     * @param {*Devuelve err} callback 
     */
    acceptFriend(idUser, idFriend, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (acceptFriend): ${err.message}`), false);
            else {
                connection.query(
                    "UPDATE friendship SET request = 'accepted' WHERE id_user = ? AND id_friend = ?", [idUser, idFriend],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (acceptFriend)'), null);
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que solicita la amistad} idUser 
     * @param {*id del usuario que recibe la amistad} idFriend 
     * @param {*Devuelve err} callback 
     */
    addFriendship(idUser, idFriend, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (addFriendship): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO friendship(id_user, id_friend, request) VALUES (?, ?, ?)", [idUser, idFriend, 'accepted'],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (addFriendship)'), null);
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que solicita la amistad} idUser 
     * @param {*id del usuario que rechaza la amistad} idFriend 
     * @param {*Devuelve err} callback 
     */
    rejectFriend(idUser, idFriend, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (rejectFriend): ${err.message}`), false);
            else {
                connection.query(
                    "DELETE FROM friendship WHERE id_user = ? AND id_friend = ?", [idUser, idFriend],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (rejectFriend)'), null);
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*Palabra clave a buscar} name 
     * @param {*id del usuario que realiza la busqueda} id_user 
     * @param {*Devuelve err y una lista de usuarios que no son ni amigos ni estan pendientes de serlo} callback 
     */
    searchFriends(name, id_user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (searchFriends): ${err.message}`), null);
            else {
                connection.query("SELECT user.id_user, user.name, user.img_profile FROM user WHERE user.id_user != ? " +
                    "AND user.id_user NOT IN (SELECT friendship.id_user FROM friendship WHERE friendship.id_user = ? " +
                    "OR friendship.id_friend = ?) AND user.id_user NOT IN (SELECT friendship.id_friend FROM friendship " +
                    "WHERE friendship.id_friend = ? OR friendship.id_user = ?) AND user.name LIKE ?", [id_user, id_user, id_user, id_user, id_user, '%' + name + '%'],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (searchFriends)'), null);
                        else {
                            //Need to check if the friends is already his friend.
                            if (rows.length > 0) {
                                let amigos = [];
                                rows.forEach(row => {
                                    amigos.push({
                                        name: row.name,
                                        imgProfile: row.img_profile,
                                        id_user: row.id_user
                                    });
                                });
                                callback(null, amigos);
                            } else callback(null, []);
                        }
                    }
                );
            }
        });
    }

    /**
     * 
     * @param {*id del usuario que realiza la petición de amistad} idUser 
     * @param {*id del usuario que recibe la petición de amistad} idFriend 
     * @param {*Devuelve err} callback 
     */
    requestFriend(idUser, idFriend, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (requestFriend): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO friendship(id_user, id_friend, request) VALUES (?, ?, ?)", [idFriend, idUser, 'waiting'],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (requestFriend)'), null);
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario al que queremos consultar sus amigos} idUser 
     * @param {*Devuelve err y la lista de amigos del usuario} callback 
     */
    getFriendsAccepted(idUser, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getFriendsAccepted): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT f.id_user, f.id_friend, f.request, u.name, u.img_profile FROM friendship AS f, user AS u WHERE f.id_friend = u.id_user AND f.id_user = ?", 
                    [idUser],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getFriendsAccepted)'), null);
                        else {
                            if (rows.length > 0) {
                                let friendList = [];
                                for (let i = 0; i < rows.length; i++) {
                                    let friend = {
                                        idFriend: rows[i].id_friend,
                                        request: rows[i].request,
                                        name: rows[i].name,
                                        imgProfile: rows[i].img_profile
                                    };
                                    friendList.push(friend);
                                }
                                callback(null, friendList);
                            } else callback(null, []);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario al que queremos agregar una foto} idUser 
     * @param {*Foto que queremos agregar} photo 
     * @param {*Descripción de la foto que queremos agregar} description 
     * @param {*Devuelve err y el id de la foto insertada} callback 
     */
    insertPhoto(idUser, photo, description, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertPhoto): ${err.message}`), false);
            else {
                connection.query(
                    "INSERT INTO photo(id_user, photo, description) VALUES (?, ?, ?)", [idUser, photo, description],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (insertPhoto)'), null);
                        else callback(null, rows.insertId);
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario al que queremos consultar las fotos} idUser 
     * @param {*Devuelve err y una lista de las fotos del usuario} callback 
     */
    getPhotos(idUser, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (getPhotos): ${err.message}`), false);
            else {
                connection.query(
                    "SELECT * FROM photo WHERE id_user = ?", [idUser],
                    function (err, rows) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (getPhotos)'), null);
                        else {
                            if (rows.length > 0) {
                                let photoList = [];
                                for (let i = 0; i < rows.length; i++) {
                                    let photo = {
                                        idPhoto: rows[i].id_photo,
                                        idUser: rows[i].id_user,
                                        name: rows[i].photo,
                                        description: rows[i].description
                                    };
                                    photoList.push(photo);
                                }
                                callback(null, photoList);
                            } else callback(null, []);
                        }
                    });
            }
        });
    }

    /**
     * 
     * @param {*id de la foto que queremos eliminar} idPhoto 
     * @param {*Devuelve err} callback 
     */
    deletePhotos(idPhoto, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (deletePhotos): ${err.message}`), false);
            else {
                connection.query(
                    "DELETE FROM photo WHERE id_photo = ?", [idPhoto],
                    function (err) {
                        connection.release();
                        if (err) callback(new Error('Error al ejecutar la consulta (deletePhotos)'));
                        else callback(null);
                    });
            }
        });
    }

    /**
     * 
     * @param {*id del usuario al que queremos sumar puntos} idUser 
     * @param {*Puntos que queremos sumar} points 
     * @param {*Devuelve err y los puntos totales del usuario después de sumarle points} callback 
     */
    insertPoints(idUser, points, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error(`Error al obtener la conexión (insertPoints): ${err.message}`), false);
            else {
                connection.query(
                    "UPDATE user SET user.points = user.points + ? WHERE user.id_user = ?", [points, idUser],
                    function (err) {
                        if (err) callback(new Error('Error al ejecutar la primera consulta (insertPoints)'));
                        else {
                            connection.query(
                                "SELECT points FROM user WHERE id_user = ?", [idUser],
                                function (err, rows) {
                                    connection.release();
                                    if (err) callback(new Error('Error al ejecutar la segunda consulta (insertPoints)'), null);
                                    else callback(null, rows[0].points);
                                });
                        }
                    });
            }
        });
    }
}

module.exports = DAOUsers;