# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from userservice.user import UserServiceMiddleware
from uw_pws.util import fdao_pws_override
from student_personal.tests import MOCK_SAML_ATTRIBUTES
from student_personal.views.pages import DefaultPageView


@fdao_pws_override
class DefaultPageTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user("javerage", password="a")

    def test_get_context_data(self):
        request = self.factory.get("/")
        request.session = {}
        request.session["samlUserdata"] = MOCK_SAML_ATTRIBUTES.get("javerage")

        request.user = self.user
        UserServiceMiddleware().process_request(request)

        view = DefaultPageView()
        view.request = request

        kwargs = {}
        context = view.get_context_data(**kwargs)

        self.assertEqual(context, {
            "clearOverrideUrl": "/support",
            "debugMode": False,
            "displayName": "James Average",
            "emergencyContactUrl": "/api/internal/emergency_contact/",
            "isStudent": True,
            "loginUser": "javerage",
            "overrideUser": "javerage",
            "photoUrl": "/api/internal/photo/",
            "preferredFirst": "James",
            "preferredSurname": "Average",
            "signoutUrl": "/saml/logout"
        })
