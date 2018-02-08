# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from services.models import Notification, Parameter


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['idUser', 'idCampana', 'mensaje', 'idMensaje']
    fieldsets = [
        (None, {'fields': ['idUser', 'idCampana', 'mensaje', 'idMensaje']}),
    ]


class ParameterAdmin(admin.ModelAdmin):
    list_display = ['name', 'value']
    fieldsets = [
        (None, {'fields': ['name', 'value']}),
    ]

admin.site.register(Notification, NotificationAdmin)
admin.site.register(Parameter, ParameterAdmin)
