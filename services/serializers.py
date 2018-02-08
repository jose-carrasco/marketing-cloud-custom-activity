from django.contrib.auth.models import User, Group
from services.models import Notification, Parameter
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = ('name', 'value')


class NotificationSerializer(serializers.ModelSerializer):
    listParameters = ParameterSerializer(many=True)

    class Meta:
        model = Notification
        fields = ('idUser', 'idCampana', 'mensaje', 'idMensaje', 'listParameters')

    def create(self, validated_data):
        parameters_data = validated_data.pop('listParameters')
        notification = Notification.objects.create(**validated_data)

        for parameter in parameters_data:
            parameter = Parameter.objects.create(name=parameter['name'], value=parameter['value'], notification=notification)

        return notification


