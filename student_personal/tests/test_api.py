# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import Client, TestCase, override_settings


@override_settings(DEBUG=True)
class FakeApiTest(TestCase):
    def test_api_v0(self):
        client = Client()
        ecjson = [
            {
                "syskey": 0,
                "name": "John Doe",
                "phoneNumber": "1234567890",
                "email": "e1@gmail.com",
                "relationship": "PARENT",
                "lastModified": "2025-10-21T23:23:02.573Z",
            },
            {
                "syskey": 0,
                "name": "Jane Doe",
                "phoneNumber": "5555555555",
                "email": "janedoe@gmail.com",
                "relationship": "PARENT",
                "lastModified": "2025-10-21T23:23:02.573Z",
            },
        ]
        resp = client.get("/api/v0/econtact")
        self.assertEqual(200, resp.status_code)
        self.assertEqual("application/json", resp.headers["Content-Type"])
        self.assertEqual(ecjson, resp.json())

    def test_html_404(self):
        client = Client()
        resp = client.get("/doesntexist")
        self.assertEqual(404, resp.status_code)
        self.assertEqual(
            "text/html; charset=utf-8", resp.headers["Content-Type"]
        )
