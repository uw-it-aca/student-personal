# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

import os
import re
import unittest
from django.test import TestCase
from student_personal.templatetags.vite import vite_styles, vite_scripts


class ViteTestClass(TestCase):
    def setUp(self):
        # Setup run before every test method.
        pass

    def tearDown(self):
        # Clean up run after every test method.
        pass

    @unittest.skipUnless(os.getenv("ENV") == "localdev", "Skipping Vite tests")
    def test_vite_styles(self):
        entries = ("student_personal_vue/main.js",)
        link = vite_styles(*entries)
        pattern = re.compile(r'<link\s+[^>]*href="[^"]*main-[^"]*"[^>]*>')
        self.assertTrue(pattern.search(link))

    @unittest.skipUnless(os.getenv("ENV") == "localdev", "Skipping Vite tests")
    def test_vite_scripts(self):
        entries = ("student_personal_vue/main.js",)
        script = vite_scripts(*entries)
        pattern = re.compile(
            r'<script\s+[^>]*src="[^"]*main-[^"]*"[^>]*></script>'
        )
        self.assertTrue(pattern.search(script))
