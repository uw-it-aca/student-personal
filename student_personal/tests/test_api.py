# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import Client, TestCase, override_settings


@override_settings(DEBUG=True)
class FakeApiTest(TestCase):
    def test_api_v0(self):
        client = Client()
        ecjson = [
            {
                "name": "John Doe",
                "phone": "1234567890",
                "email": "e1@gmail.com",
                "relationship": "",
                "last_updated": "",
            },
            {
                "name": "Jane Doe",
                "phone": "5555555555",
                "email": "janedoe@gmail.com",
                "relationship": "",
                "last_updated": "",
            },
        ]
        resp = client.get("/api/v0/econtact")
        self.assertEqual('application/json', resp.headers['Content-Type'])
        self.assertEqual(ecjson, resp.json())
