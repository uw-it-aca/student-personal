# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.tests.views.api import ApiTest
from student_personal.views.api.emergency_contact import ContactsList
from uw_sps_contacts.utils import fdao_sps_contacts_override
from uw_pws.util import fdao_pws_override
import mock
import json


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
        self.assertEqual(response.status_code, 401, "Not authorized")
        self.assertEqual(response.content, b"Person is not a current student")

    def test_put(self):
        putdata = {"emergency_contacts": [{
            "name": "Hank Average", "phoneNumber": "+12065551234",
            "email": "haverage@example.com", "relationship": "Parent",
        }, {
            "name": "Jane Average", "phoneNumber": "+14255554321",
            "email": "javg@example.com", "relationship": None,
        }]}

        response = self.put_response("emergency-contact-api", "javerage",
                                     data=json.dumps(putdata))
        self.assertEqual(response.status_code, 200, "OK")
        data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(len(data.get("emergency_contacts")), 2)

        response = self.put_response("emergency-contact-api", "javerage",
                                     data=json.dumps({}))
        self.assertEqual(response.status_code, 400, "No data")

        response = self.put_response(
            "emergency-contact-api", "javerage", data=json.dumps(
                {"emergency_contacts": []}
            )
        )
        self.assertEqual(response.status_code, 400, "Empty list")

        response = self.put_response(
            "emergency-contact-api", "jstaff", data=json.dumps({}))
        self.assertEqual(response.status_code, 401, "Not authorized")
        self.assertEqual(response.content, b"Person is not a current student")
