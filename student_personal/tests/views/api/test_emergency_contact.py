# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.tests.views.api import ApiTest
from student_personal.views.api.emergency_contact import ContactsList
from uw_sps_contacts.utils import fdao_sps_contacts_override
from uw_pws.util import fdao_pws_override
import mock
import json


def put_contacts(self):
    return []


ContactsList.put_contacts = put_contacts


@fdao_pws_override
@fdao_sps_contacts_override
class EmergencyContactAPITest(ApiTest):
    def test_get(self):
        response = self.get_response("emergency-contact-api", "javerage")
        self.assertEqual(response.status_code, 200, "OK")
        data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(len(data.get("emergency_contacts")), 2)

        response = self.get_response("emergency-contact-api", "jbothell")
        self.assertEqual(response.status_code, 200, "OK")
        data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(len(data.get("emergency_contacts")), 2)

        response = self.get_response("emergency-contact-api", "jstaff")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content, b"Person is not a current student")

    @mock.patch.object(ContactsList, "put_contacts")
    def test_put(self, mock_put_contacts):
        response = self.get_response("emergency-contact-api", "javerage")
        data = json.loads(response.content.decode("utf-8"))
