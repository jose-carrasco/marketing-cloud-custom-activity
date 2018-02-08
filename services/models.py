# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models


class Notification(models.Model):
    class Meta:
        verbose_name = u"Notificación"
        verbose_name_plural = u"Notificaciones"

    idUser = models.CharField(max_length=50, verbose_name=u'ID User')
    idCampana = models.CharField(max_length=50, verbose_name=u'ID Campaña')
    mensaje = models.CharField(max_length=255, verbose_name=u'Mensaje')
    idMensaje = models.CharField(max_length=50, verbose_name=u'ID Mensaje')

    def __unicode__(self):
        return u"%s, %s" % (self.idUser, self.idCampana)

    def __str__(self):
        return u"%s, %s" % (self.idUser, self.idCampana)


class Parameter(models.Model):
    class Meta:
        verbose_name = u"Parámetro"
        verbose_name_plural = u"Parámetros"

    name = models.CharField(max_length=50, verbose_name=u'Nombre')
    value = models.CharField(max_length=50, verbose_name=u'Valor')
    notification = models.ForeignKey(Notification, related_name='listParameters', verbose_name=u'Notificación')

    def __unicode__(self):
        return u"%s, %s" % (self.name, self.value)

    def __str__(self):
        return u"%s, %s" % (self.name, self.value)

