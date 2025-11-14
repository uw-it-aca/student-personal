# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.http import HttpResponse
from student_personal.exceptions import OverrideNotPermitted
from student_personal.views.api import BaseAPIView
from student_personal.dao.emergency_contact import (
    get_emergency_contacts, update_emergency_contacts)
from student_personal.dao.person import get_user_context, DataFailureException
from logging import getLogger
import json

logger = getLogger(__name__)


class EmergencyContactView(BaseAPIView):
    def get(self, request, system_key):
        try:
            context = get_user_context(request)
            if system_key != context.get("systemKey"):
                return self.response_unauthorized()
        except DataFailureException as ex:
            return HttpResponse(ex, status=543)

        contacts = get_emergency_contacts(system_key)

        # TODO serialize contacts
        return self.response_ok()

    def put(self, request, system_key):
        try:
            self.valid_user_override()

            context = get_user_context(request)
            if system_key != context.get("systemKey"):
                return self.response_unauthorized()
        except OverrideNotPermitted as ex:
            return self.response_unauthorized(ex)
        except DataFailureException as ex:
            return HttpResponse(ex, status=543)

        try:
            contact_data = json.loads(request.body)
            contacts = update_emergency_contacts(system_key, contact_data)
        except Exception as ex:
            logger.error(f"PUT contacts failed for {system_key}: {ex}")
            return HttpResponse(ex, status=543)

        # TODO serialize contacts
        return self.response_ok()
