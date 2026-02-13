# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

import json

from uw_pws.util import fdao_pws_override
from uw_sps_contacts.utils import fdao_sps_contacts_override

from student_personal.tests.views.api import ApiTest
from student_personal.views.api.family_contact import FamilyContacts


@fdao_pws_override
@fdao_sps_contacts_override
class FamilyContactAPITest(ApiTest):
    def test_get(self):
        response = self.get_response("family-contact-api", "javerage")
        self.assertEqual(response.status_code, 200, "OK")

        data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(
            data,
            {
                "family_contact": {
                    "address_line_1": "C/O STUDENT TEAM",
                    "address_line_2": "UW TOWER O-3 BOX 359565",
                    "city": "SEATTLE",
                    "country": "91",
                    "name": "Average, Hank",
                    "phone_number": "+912212345678",
                    "postal_cd": "",
                    "state": "WA",
                    "zip_5": "98195",
                    "zip_filler_b": None,
                }
            },
        )

        response = self.get_response("family-contact-api", "bill")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content, b"Person is not a current student")
