const Notification = require('../models').Notification;
const Parameter = require('../models').Parameter;

module.exports = {
    create(notification, res) {
        return Notification
            .create({
                idUser: notification.idUser,
                idCampana: notification.idCampana,
                mensaje: notification.mensaje,
                idMensaje: notification.idMensaje
            })
            .then(notification => res.status(201).send(notification))
            .catch(error => res.status(400).send(error));
    },
};