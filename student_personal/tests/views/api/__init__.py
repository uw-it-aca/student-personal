# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from student_personal.tests import MOCK_SAML_ATTRIBUTES
import mock


class ApiTest(TestCase):
    def setUp(self):
        self.client = Client(HTTP_USER_AGENT='Mozilla/5.0',
                             HTTP_X_REQUESTED_WITH='XMLHttpRequest')

    def _set_user(self, netid):
        if netid is not None:
            self.client.force_login(User.objects.get_or_create(
                username=netid)[0])

        session = self.client.session
        session['samlUserdata'] = MOCK_SAML_ATTRIBUTES.get(netid, {})
        session.save()

    def _set_group(self, group):
        session = self.client.session
        session['samlUserdata'].get('isMemberOf', []).append(group)
        session.save()

    def get_response(self, url_name, netid=None, get_args=None, **kwargs):
        self._set_user(netid)
        url = reverse(url_name, **kwargs)
        return self.client.get(url, get_args, **kwargs)

    def put_response(self, url_name, netid=None, data=None, **kwargs):
        self._set_user(netid)
        url = reverse(url_name, **kwargs)
        return self.client.put(
            url, data=data, content_type="application/json")
