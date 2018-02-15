'use strict';
module.exports = (sequelize, DataTypes) => {
  var Parameter = sequelize.define('Parameter', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  Parameter.associate = function(models) {
    // associations can be defined here
  };

    Parameter.associate = (models) => {
        Parameter.belongsTo(models.Notification, {
            foreignKey: 'notificationId',
            onDelete: 'CASCADE',
        });};

  return Parameter;
};