# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.tests.views.api import ApiTest
from uw_sps_contacts.utils import fdao_sps_contacts_override
from uw_pws.util import fdao_pws_override
import mock
import json


@fdao_pws_override
@fdao_sps_contacts_override
class EmergencyContactAPITest(ApiTest):
    def test_get_student(self):
        response = self.get_response("emergency-contact-api", "javerage")
        self.assertEqual(response.status_code, 200, "OK")
        data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(len(data.get("emergency_contacts")), 2)
        self.assertEqual(data.get("emergency_contacts")[0], {
                "email": "haverage@example.com",
                "id": "ab269f37-2807-4b10-b9d3-b5f7c602d45f",
                "last_modified": "2025-11-11T21:28:40.180882",
                "name": "Hank Average",
                "phone_number": "+12065551234",
                "relationship": "",
                "syskey": "000083856"
            })

    def test_get_staff(self):
        response = self.get_response("emergency-contact-api", "bill")
        self.assertEqual(response.status_code, 401, "Not authorized")
        self.assertEqual(response.content, b"Person is not a current student")

    def test_validate_emergency_contacts(self):
        from student_personal.views.api.emergency_contact import (
            EmergencyContactView, InvalidContactList)
        putdata = {"emergency_contacts": [{
            "name": "Hank Average", "phoneNumber": "+12065551234",
            "email": "haverage@example.com", "relationship": "Parent",
        }, {
            "name": "Jane Average", "phoneNumber": "+14255554321",
            "email": "javg@example.com", "relationship": None,
        }]}

        contacts = EmergencyContactView()._validate(
            "000083856", putdata["emergency_contacts"])
        self.assertNotEqual("", contacts[0].syskey)
        self.assertNotEqual("", contacts[1].syskey)
        self.assertEqual("000083856", contacts[0].syskey)
        self.assertEqual("000083856", contacts[1].syskey)
        self.assertEqual(contacts[0].syskey, contacts[1].syskey)

    def test_put_student(self):
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

    def test_put_staff(self):
        response = self.put_response(
            "emergency-contact-api", "bill", data=json.dumps({}))
        self.assertEqual(response.status_code, 401, "Not authorized")
        self.assertEqual(response.content, b"Person is not a current student")
