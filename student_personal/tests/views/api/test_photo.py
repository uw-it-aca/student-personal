# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.tests.views.api import ApiTest
from uw_pws.util import fdao_pws_override


@fdao_pws_override
class PhotoAPITest(ApiTest):
    def test_get(self):
        response = self.get_response("photo-api", "javerage", kwargs={
            "uwregid": "12345678123456781234567812345678"})
        self.assertEqual(response.status_code, 200, "OK")
        self.assertEqual(response.headers["Content-Type"], "image/jpeg")

        response = self.get_response("photo-api", "bill", kwargs={
             "uwregid": "12345678123456781234567812345678"})
        self.assertEqual(response.status_code, 401, "Not authorized")
