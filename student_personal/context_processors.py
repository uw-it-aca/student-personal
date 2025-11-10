# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from django.urls import reverse
from userservice.user import UserService
from persistent_message.models import Message


def auth_user(request):
    us = UserService()
    ret = {
        'user_netid': us.get_original_user(),
        'user_override': us.get_user(),
        'signout_url': reverse('saml_logout'),
        'messages': [],
    }

    for message in Message.objects.active_messages():
        if 'message_level' not in ret:
            ret['message_level'] = message.get_level_display().lower()
        ret['messages'].append(message.render())

    return ret


def google_analytics(request):
    return {"google_analytics": getattr(settings, "GOOGLE_ANALYTICS_KEY", " ")}


def django_debug(request):
    return {"django_debug": getattr(settings, "DEBUG", False)}
