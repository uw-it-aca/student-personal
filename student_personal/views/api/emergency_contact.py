# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.http import HttpResponse
from student_personal.views.api import BaseAPIView
from student_personal.exceptions import (
    MissingStudentAffiliation, InvalidContactList, OverrideNotPermitted)
from student_personal.dao.person import DataFailureException
from uw_sps_contacts import EmergencyContacts
from uw_sps_contacts.models import EmergencyContact
from logging import getLogger
import json

logger = getLogger(__name__)


class EmergencyContactView(BaseAPIView):
    CONTACT_LIMIT = 2

    def _serialize(self, contacts=None):
        if contacts is None:
            contacts = []

        # Ensure two EmergencyContact models for the response
        while len(contacts) < self.CONTACT_LIMIT:
            contacts.append(EmergencyContact())

        return json.dumps({
            "emergency_contacts": [c.json_data() for c in contacts]
        })

    def _validate(self, system_key, contact_data=[]):
        if not (0 < len(contact_data) <= self.CONTACT_LIMIT):
            raise InvalidContactList()

        contacts = []
        for cdata in contact_data:
            contact = EmergencyContact()
            for key, val in cdata.items():
                setattr(contact, key, val)
            if not contact.syskey:
                contact.syskey = system_key
            if not contact.is_empty():
                contacts.append(contact)

        if not len(contacts):
            raise InvalidContactList()
        elif len(contacts) < self.CONTACT_LIMIT:
            contacts.append(EmergencyContact())

        return contacts

    def get(self, request):
        try:
            system_key = self.valid_user(request)
            contacts = EmergencyContacts().get_contacts(system_key)
            return self.response_ok(self._serialize(contacts))
        except MissingStudentAffiliation as ex:
            return self.response_unauthorized(ex)
        except DataFailureException as ex:
            return HttpResponse(ex, status=ex.status)

    def put(self, request):
        try:
            system_key = self.valid_user(request)
            self.valid_user_override()
        except (MissingStudentAffiliation, OverrideNotPermitted) as ex:
            return self.response_unauthorized(ex)
        except DataFailureException as ex:
            return HttpResponse(ex, status=ex.status)

        contact_list = []
        try:
            request_data = json.loads(request.body).get("emergency_contacts")
            contact_list = self._validate(system_key, request_data)
        except InvalidContactList as ex:
            return self.response_badrequest(content=ex)
        except Exception as ex:
            return self.response_badrequest(content=ex)

        try:
            contacts = EmergencyContacts().put_contacts(
                system_key, contact_list)
            return self.response_ok(self._serialize(contacts))
        except DataFailureException as ex:
            logger.error(f"PUT contacts failed for {system_key}: {ex}")
            return HttpResponse(ex, status=ex.status)
