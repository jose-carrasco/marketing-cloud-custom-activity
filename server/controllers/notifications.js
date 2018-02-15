const Notification = require('../models').Notification;
const Parameter = require('../models').Parameter;

module.exports = {
    create(req, res) {
        return Notification
            .create({
                idUser: req.body.idUser,
                idCampana: req.body.idCampana,
                mensaje: req.body.mensaje,
                idMensaje: req.body.idMensaje
            })
            .then(notification => res.status(201).send(notification))
            .catch(error => res.status(400).send(error));
    },
};