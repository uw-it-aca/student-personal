# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from django.contrib.sessions.backends.db import SessionStore
from student_personal.dao.person import (
    SPSPerson, UserService, PWS, is_overridable_uwnetid)
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

    @mock.patch("student_personal.dao.person.get_attribute")
    def test_init_saml(self, mock_get_attribute):
        request = self._get_request_for_user("javerage")

        sps = SPSPerson(request)
        mock_get_attribute.assert_called_with(request, "uwregid")

    def test_get_view_context(self):
        request = self._get_request_for_user("javerage")

        sps = SPSPerson(request)
        self.assertEqual(sps.get_view_context(), {
            "displayName": "James Average",
            "isStudent": True,
            "preferredFirst": "James",
            "preferredSurname": "Average"
        })

    def test_get_photo(self):
        request = self._get_request_for_user("javerage")

        sps = SPSPerson(request)
        photo = sps.get_photo()
        self.assertEqual(len(photo.read()), 4661)


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
