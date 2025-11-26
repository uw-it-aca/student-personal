# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.tests.views.api import ApiTest
from student_personal.views.api.family_contact import FamilyContact
from uw_sps_contacts.utils import fdao_sps_contacts_override
from uw_pws.util import fdao_pws_override
from unittest import skip
import mock
import json


@fdao_pws_override
@fdao_sps_contacts_override
class FamilyContactAPITest(ApiTest):
    @skip("Not implemented")
    def test_get(self):
        response = self.get_response("family-contact-api", "javerage")
        self.assertEqual(response.status_code, 200, "OK")
        data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(data.get("family_contact"), {})

        response = self.get_response("family-contact-api", "bill")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content, b"Person is not a current student")
