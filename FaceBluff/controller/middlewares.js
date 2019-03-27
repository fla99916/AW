function existsCurrentUser(request, response, next) {
    if (request.session.currentUser !== undefined) {
        response.locals.id_user = request.session.currentUser.id_user;
        response.locals.email = request.session.currentUser.email;
        response.locals.password = request.session.currentUser.password;
        response.locals.name = request.session.currentUser.name;
        response.locals.gender = request.session.currentUser.gender;
        response.locals.birthdate = request.session.currentUser.birthdate;
        response.locals.imgProfile = request.session.currentUser.imgProfile;
        response.locals.points = request.session.currentUser.points;
        response.locals.findName = request.session.findName;
        next();
    } else response.redirect("/login"); // Saltar al siguiente middleware
}

function question(request, response, next) {
    if (request.session.questionId !== undefined)
        response.locals.questionId = request.session.questionId;
    next();
}

module.exports = {
    existsCurrentUser: existsCurrentUser,
    question: question
};