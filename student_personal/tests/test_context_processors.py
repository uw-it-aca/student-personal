# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase, RequestFactory
from student_personal.context_processors import persistent_messages
from persistent_message.models import Message


class ContextProcessorTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_persistent_messages(self):
        request = self.factory.get("/")

        # Empty messages list
        self.assertEqual(persistent_messages(request), {"messages": []})

        message = Message()
        message.content = "Hello World!"
        message.level = message.INFO_LEVEL
        message.save()

        # Single message
        self.assertEqual(persistent_messages(request), {
            "message_level": "info", "messages": ["Hello World!"]
        })
