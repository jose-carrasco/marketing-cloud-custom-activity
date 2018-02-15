'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define('Notification', {
    idUser: DataTypes.STRING,
    idCampana: DataTypes.STRING,
    mensaje: DataTypes.STRING,
    idMensaje: DataTypes.STRING
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
  };

    Notification.associate = (models) => {
        Notification.hasMany(models.Parameter, {
            foreignKey: 'notificationId',
            as: 'parameters',
        });
    };


    return Notification;
};