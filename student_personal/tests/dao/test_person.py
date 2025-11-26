# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from django.contrib.sessions.backends.db import SessionStore
from student_personal.dao.person import (
    SPSPerson, UserService, PWS, is_overridable_uwnetid, can_override_user,
    can_proxy_restclient, can_manage_persistent_messages)
from student_personal.tests import MOCK_SAML_ATTRIBUTES
from userservice.user import UserServiceMiddleware
from uw_pws.util import fdao_pws_override
import mock


@fdao_pws_override
class PersonDAOTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def _get_request_for_user(self, netid):
        user = User.objects.get_or_create(username=netid)[0]

        session = SessionStore()
        session["samlUserdata"] = MOCK_SAML_ATTRIBUTES.get(netid, {})
        session.save()

        request = self.factory.get("/")
        request.user = user
        request.session = session

        UserServiceMiddleware().process_request(request)

        return request

    @mock.patch.object(UserService, "get_override_user")
    @mock.patch.object(UserService, "get_user")
    @mock.patch.object(PWS, "get_person_by_netid")
    def test_init_userservice(self,
                              mock_get_person_by_netid,
                              mock_get_user,
                              mock_get_override_user):
        mock_get_user.return_value = "javerage"
        mock_get_override_user.return_value = "javerage"

        request = self._get_request_for_user(mock_get_user.return_value)

        sps = SPSPerson(request)
        mock_get_person_by_netid.assert_called_once_with("javerage")

    def test_get_view_context_student(self):
        request = self._get_request_for_user("javerage")
        sps = SPSPerson(request)
        self.assertEqual(sps.get_view_context(), {
            "isStudent": True,
            "displayName": "Jamesy McJamesy",
            "preferredFirst": "Jamesy",
            "preferredSurname": "McJamesy",
            "pronouns": None,
            "studentNumber": "1033334",
            "emergencyContactUrl": "/api/internal/emergency_contact/",
            "photoUrl": "/api/internal/photo/9136CCB8F66711D5BE060004AC494FFE",
        })

    def test_get_view_context_staff(self):
        request = self._get_request_for_user("bill")
        sps = SPSPerson(request)
        self.assertEqual(sps.get_view_context(), {
            "isStudent": False,
            "displayName": "Bill Teacher",
            "preferredFirst": None,
            "preferredSurname": None,
        })

    def test_get_photo(self):
        request = self._get_request_for_user("javerage")

        sps = SPSPerson(request)
        photo = sps.get_photo()
        self.assertEqual(len(photo.read()), 4661)


class AuthFunctionsTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def _get_request_for_user(self, netid):
        user = User.objects.get_or_create(username=netid)[0]

        session = SessionStore()
        session["samlUserdata"] = MOCK_SAML_ATTRIBUTES.get(netid, {})
        session.save()

        request = self.factory.get("/")
        request.user = user
        request.session = session

        UserServiceMiddleware().process_request(request)

        return request

    def test_can_override_user(self):
        request = self._get_request_for_user("bill")
        self.assertTrue(can_override_user(request))

        request = self._get_request_for_user("jbothell")
        self.assertFalse(can_override_user(request))

    def test_can_proxy_restclient(self):
        request = self._get_request_for_user("bill")
        self.assertTrue(can_override_user(request))

        request = self._get_request_for_user("jbothell")
        self.assertFalse(can_override_user(request))

    def test_can_manage_persistent_messages(self):
        request = self._get_request_for_user("bill")
        self.assertTrue(can_override_user(request))

        request = self._get_request_for_user("jbothell")
        self.assertFalse(can_override_user(request))


@fdao_pws_override
class OverridableNetidTest(TestCase):
    def test_username(self):
        self.assertEqual(is_overridable_uwnetid("javerage"), None)
        self.assertEqual(is_overridable_uwnetid("jbothell"),
                         "Current UWNetID: javerage, Prior UWNetID: ")
        self.assertEqual(is_overridable_uwnetid("1average"),
                         "Not a valid UWNetID: ")
        self.assertEqual(is_overridable_uwnetid("z1z1z1z1"),
                         "UWNetID not found: ")
        self.assertEqual(is_overridable_uwnetid(""),
                         "No override user supplied, please enter a UWNetID")
