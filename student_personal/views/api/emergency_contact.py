# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.views.api import BaseAPIView
from student_personal.dao.emergency_contact import (
    get_emergency_contacts, update_emergency_contacts)
from logging import getLogger

logger = getLogger(__name__)


class EmergencyContactView(BaseAPIView):
    def get(self, request, system_key):
        pass

    def put(self, request, system_key):
        pass
