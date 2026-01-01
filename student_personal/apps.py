# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.apps import AppConfig
from django.contrib.staticfiles.apps import StaticFilesConfig
from restclients_core.dao import MockDAO
import os


class ViteStaticFilesConfig(StaticFilesConfig):
    ignore_patterns = ["CVS", "*~"]


class StudentPersonalConfig(AppConfig):
    name = "student_personal"

    def ready(self):
        mocks = os.path.join(os.path.dirname(__file__), "resources")
        MockDAO.register_mock_path(mocks)
