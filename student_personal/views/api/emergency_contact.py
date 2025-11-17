# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.http import HttpResponse
from student_personal.views.api import BaseAPIView
from student_personal.exceptions import (
    MissingStudentAffiliation, OverrideNotPermitted)
from student_personal.dao.person import SPSPerson, DataFailureException
from uw_sps_contacts import ContactsList
from uw_sps_contacts.models import EmergencyContact
from logging import getLogger
import json

logger = getLogger(__name__)


class EmergencyContactView(BaseAPIView):
    def _authorize(self, request):
        sps_person = SPSPerson(request)
        if sps_person.system_key and sps_person.is_student:
            return sps_person.system_key

        raise MissingStudentAffiliation()

    def _serialize(self, contacts=[]):
        # Ensure two EmergencyContact models for the response
        while len(contacts) < 2:
            contacts.append(EmergencyContact())

        return {"emergency_contacts": [c.json_data() for c in contacts]}

    def get(self, request):
        try:
            system_key = self._authorize(request)
            contacts = ContactsList().get_contacts(system_key)
            return self.response_ok(self._serialize(contacts))
        except MissingStudentAffiliation as ex:
            return self.response_unauthorized(ex)
        except DataFailureException as ex:
            return HttpResponse(ex, status=ex.status)

    def put(self, request):
        try:
            system_key = self._authorize(request)
            self.valid_user_override()
        except (MissingStudentAffiliation, OverrideNotPermitted) as ex:
            return self.response_unauthorized(ex)
        except DataFailureException as ex:
            return HttpResponse(ex, status=ex.status)

        request_data = []
        try:
            request_data = json.loads(request.body)
        except Exception as ex:
            return self.response_badrequest(content=ex)

        try:
            contacts = ContactsList().update_contacts(system_key, request_data)
            return self.response_ok(self._serialize(contacts))
        except DataFailureException as ex:
            logger.error(f"PUT contacts failed for {system_key}: {ex}")
            return HttpResponse(ex, status=ex.status)
