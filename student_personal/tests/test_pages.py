# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import Client, TestCase


class PagesTest(TestCase):
    def test_default_page(self):
        client = Client()
        resp = client.get("/")
        self.assertEqual(200, resp.status_code)
        self.assertEqual(
            "text/html; charset=utf-8", resp.headers["Content-Type"]
        )
