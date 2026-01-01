# Copyright 2026 UW-IT, University of Washington
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

    def test_get_context_data_student(self):
        self.user = User.objects.create_user("javerage", password="a")

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
            "displayName": "Jamesy McJamesy",
            "emergencyContactUrl": "/api/internal/emergency_contact/",
            "familyContactUrl": "/api/internal/family_contact/",
            "isStudent": True,
            "loginUser": "javerage",
            "overrideUser": "javerage",
            "photoUrl": "/api/internal/photo/9136CCB8F66711D5BE060004AC494FFE",
            "preferredFirst": "Jamesy",
            "preferredSurname": "McJamesy",
            "signoutUrl": "/saml/logout",
            "studentNumber": "1033334",
            "pronouns": None,
        })

    def test_get_context_data_staff(self):
        self.user = User.objects.create_user("bill", password="a")

        request = self.factory.get("/")
        request.session = {}
        request.session["samlUserdata"] = MOCK_SAML_ATTRIBUTES.get("bill")

        request.user = self.user
        UserServiceMiddleware().process_request(request)

        view = DefaultPageView()
        view.request = request

        kwargs = {}
        context = view.get_context_data(**kwargs)

        self.assertEqual(context, {
            "clearOverrideUrl": "/support",
            "debugMode": False,
            "displayName": "Bill Teacher",
            "isStudent": False,
            "loginUser": "bill",
            "overrideUser": "bill",
            "preferredFirst": None,
            "preferredSurname": None,
            "signoutUrl": "/saml/logout"
        })
