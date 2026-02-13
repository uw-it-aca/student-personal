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

        self.assertEqual(context.get("debugMode"), False)
        self.assertEqual(context.get("displayName"), "Jamesy McJamesy")
        self.assertEqual(context.get("isStudent"), True)
        self.assertEqual(context.get("loginUser"), "javerage")
        self.assertEqual(context.get("overrideUser"), "javerage")
        self.assertEqual(context.get("preferredFirst"), "Jamesy")
        self.assertEqual(context.get("preferredSurname"), "McJamesy")
        self.assertEqual(context.get("studentNumber"), "1033334")
        self.assertEqual(context.get("pronouns"), None)

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

        self.assertEqual(context.get("debugMode"), False)
        self.assertEqual(context.get("displayName"), "Bill Teacher")
        self.assertEqual(context.get("isStudent"), False)
        self.assertEqual(context.get("loginUser"), "bill")
        self.assertEqual(context.get("overrideUser"), "bill")
        self.assertEqual(context.get("preferredFirst"), None)
        self.assertEqual(context.get("preferredSurname"), None)
