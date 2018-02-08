# -*- coding: utf-8 -*-
from django.contrib.auth.models import User, Group
from rest_framework.decorators import detail_route
from rest_framework import viewsets
from services.models import Notification
from services.serializers import NotificationSerializer
from rest_framework.response import Response
from rest_framework import status


class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def create(self, request):

        if request.method == 'POST':
            serializer = NotificationSerializer(data=request.data)
            if serializer.is_valid():
                return Response({'exitoso': True}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

