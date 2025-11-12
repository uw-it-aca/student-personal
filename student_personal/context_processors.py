# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from persistent_message.models import Message


def persistent_messages(request):
    msg = {"messages": []}
    for message in Message.objects.active_messages():
        if "message_level" not in msg:
            msg["message_level"] = message.get_level_display().lower()
        msg["messages"].append(message.render())
    return msg


def google_analytics(request):
    return {"google_analytics": getattr(settings, "GOOGLE_ANALYTICS_KEY", " ")}
