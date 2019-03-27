const path = require("path");

const multer = require("multer");
const multerFactory = multer({
    dest: path.join(__dirname, '..', "uploads")
});

const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config.mysqlConfig);

const DAOUsers = require("../DAOUsers");

let daoUsers = new DAOUsers(pool);

function redirectToLogin(request, response) {
    response.status(200);
    response.redirect("/login");
}

function login(request, response) {
    response.status(200);
    response.render("login", {
        errorMsg: null
    });
}

function loginPOST(request, response) {
    response.status(200);
    daoUsers.isUserCorrect(request.body.email, request.body.password, function (err, isCorrect, user) {
        if (err) console.log(err);
        else {
            if (!isCorrect) {
                response.render("login", {
                    errorMsg: "Usuario o contraseña erroneos"
                });
            } else if (isCorrect) {
                request.session.currentUser = user;
                response.redirect("/profile");
            }
        }
    });
}

function logout(request, response) {
    response.status(200);
    request.session.destroy();
    response.render("login", {
        errorMsg: null
    });
}

function profile(request, response) {
    response.status(200);
    if (response.locals.imgProfile === "")
        response.locals.imgProfile == "default.png";
    daoUsers.getPhotos(response.locals.id_user, function (err, photoList) {
        if (err) console.log(err);
        else {
            response.render("profile", {
                photoList: photoList
            });
        }
    });
}

function imgProfile(request, response) {

    let pathImg = path.join(__dirname, '..', "uploads", request.params.id);
    response.sendFile(pathImg);
}

function signup(request, response) {
    response.status(200);
    response.render("signup", {
        errors: []
    });
}

function signupValidator(request, response) {
    request.checkBody("email",
        "Dirección de correo no válida").isEmail();
    request.checkBody("password",
        "La longitud de la contraseña debe ser entre 6 y 10 caracteres").isLength({
        min: 6,
        max: 10
    });
    request.checkBody("name",
        "Nombre de usuario vacío").notEmpty();
    request.checkBody("name",
        "Nombre de usuario no válido").matches(/^[A-Z0-9\s]+$/i);
    if (request.body.birthdate !== "")
        request.checkBody("birthdate",
            "Fecha de nacimiento no válida").isBefore();
    request.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            daoUsers.emailExist(request.body.email, function (err, exist) {
                if (err) console.log(err);
                else {
                    if (!exist) {
                        if (request.file) request.body.imgProfile = request.file.filename;
                        else request.body.imgProfile = "";
                        let user = {
                            email: request.body.email,
                            password: request.body.password,
                            name: request.body.name,
                            gender: request.body.gender,
                            birthdate: request.body.birthdate,
                            imgProfile: request.body.imgProfile,
                            points: 0
                        };
                        daoUsers.insertUser(user, function (err, idUser) {
                            if (err) console.log(err);
                            else {
                                user.id_user = idUser;
                                request.session.currentUser = user;
                                response.redirect("profile");
                            }
                        });
                    } else {
                        response.render("signup", {
                            errors: [{
                                msg: "El correo ya existe"
                            }]
                        });
                    }
                }
            });
        } else {
            response.render("signup", {
                errors: result.array()
            });
        }
    });
}

function friends(request, response) {
    response.status(200);
    daoUsers.getFriends(response.locals.id_user, function (err, friendList) {
        if (err) console.log(err);
        else {
            response.render("friends", {
                friendList: friendList
            });
        }
    });
}

function friendProfile(request, response) {
    response.status(200);
    daoUsers.getUserByID(request.params.id, function (err, user) {
        if (err) console.log(err);
        else {
            daoUsers.getPhotos(request.params.id, function (err, photoList) {
                if (err) console.log(err);
                else {
                    let current = {
                        imgProfile: response.locals.imgProfile,
                        points: response.locals.points
                    }
                    response.render("friend_profile", {
                        currentUser: current,
                        user: user,
                        photoList: photoList
                    });
                }
            });
        }
    });
}

function acceptFriend(request, response) {
    response.status(200);
    daoUsers.acceptFriend(response.locals.id_user, request.params.id, function (err) {
        if (err) console.log(err);
        else {
            daoUsers.addFriendship(request.params.id, response.locals.id_user, function (err) {
                if (err) console.log(err);
                else response.redirect("/friends");
            });
        }
    });
}

function findFriend(request, response) {
    daoUsers.searchFriends(response.locals.findName, response.locals.id_user, function (err, unknownFriends) {
        if (err) console.log(err);
        else {
            response.render("find_friends", {
                findName: response.locals.findName,
                friends: unknownFriends
            });
        }
    });
}

function searchFriends(request, response) {
    request.session.findName = request.body.findName;
    response.redirect("/findFriends");
}

function rejectFriend(request, response) {
    response.status(200);
    daoUsers.rejectFriend(response.locals.id_user, request.params.id, function (err) {
        if (err) console.log(err);
        else response.redirect("/friends");
    });
}

function modifyProfile(request, response) {
    response.status(200);
    response.render("modify_perfil", {
        errors: []
    });
}

function modifyValidator(request, response) {
    request.checkBody("password",
        "La longitud de la contraseña debe ser entre 6 y 10 caracteres").isLength({
        min: 6,
        max: 10
    });
    request.checkBody("name",
        "Nombre de usuario vacío").notEmpty();
    request.checkBody("name",
        "Nombre de usuario no válido").matches(/^[A-Z0-9\s]+$/i);
    if (request.body.birthdate !== "")
        request.checkBody("birthdate",
            "Fecha de nacimiento no válida").isBefore();
    request.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            if (request.file) request.body.imgProfile = request.file.filename;
            else request.body.imgProfile = response.locals.imgProfile;
            let user = {
                id_user: response.locals.id_user,
                email: request.body.email,
                password: request.body.password,
                name: request.body.name,
                gender: request.body.gender,
                birthdate: request.body.birthdate,
                imgProfile: request.body.imgProfile,
                points: response.locals.points
            };
            request.session.currentUser = user;
            daoUsers.updateUser(user, function (err) {
                if (err) console.log(err);
                else {
                    response.redirect("profile");
                }
            });
        } else {
            response.render("modify_perfil", {
                errors: result.array()
            });
        }
    });
}

function requestFriend(request, response) {
    response.status(200);
    daoUsers.requestFriend(response.locals.id_user, request.params.id, function (err) {
        if (err) console.log(err);
        else response.redirect("/findFriends");
    });
}

function uploadPhoto(request, response) {
    response.status(200);
    response.render("upload_photo", {
        error: false
    });
}

function uploadPhotoPOST(request, response) {
    if (!request.file || !request.body.description) {
        response.render("upload_photo", {
            error: true
        });
    } else {
        daoUsers.insertPhoto(response.locals.id_user, request.file.filename, request.body.description, function (err, idPhoto) {
            if (err) console.log(err);
            else {
                daoUsers.insertPoints(response.locals.id_user, 100, function (err, points) {
                    if (err) console.log(err);
                    else {
                        request.session.currentUser.points = points;
                        response.redirect("/profile");
                    }
                });
            }
        });
    }
}

function deletePhoto(request, response) {
    response.status(200);
    daoUsers.deletePhotos(request.params.id, function (err) {
        if (err) console.log(err);
        else response.redirect("/profile");
    });
}

module.exports = {
    redirectToLogin: redirectToLogin,
    login: login,
    loginPOST: loginPOST,
    logout: logout,
    profile: profile,
    imgProfile: imgProfile,
    signup: signup,
    signupValidator: signupValidator,
    friends: friends,
    friendProfile: friendProfile,
    acceptFriend: acceptFriend,
    findFriend: findFriend,
    searchFriends: searchFriends,
    rejectFriend: rejectFriend,
    modifyProfile: modifyProfile,
    modifyValidator: modifyValidator,
    requestFriend: requestFriend,
    uploadPhoto: uploadPhoto,
    uploadPhotoPOST: uploadPhotoPOST,
    deletePhoto: deletePhoto
};