# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.http import HttpResponse
from student_personal.views.api import BaseAPIView
from student_personal.exceptions import (
    MissingStudentAffiliation, InvalidContactList)
from student_personal.dao.person import DataFailureException
from uw_sps_contacts import FamilyContacts
from logging import getLogger
import uw_sps_contacts
import json

logger = getLogger(__name__)


class FamilyContactView(BaseAPIView):
    def _serialize(self, contact=None):
        if contact is None:
            return json.dumps({"family_contact": None})

        data = contact.json_data()
        phone_number = data.get("phone_number", "")
        if phone_number is not None and len(phone_number) == 10:
            # Coerce phone number to US format
            data["phone_number"] = "+1" + phone_number

        return json.dumps({"family_contact": data})

    def get(self, request):
        try:
            system_key = self.valid_user(request)
            contact = FamilyContacts().get_contact(system_key)
            return self.response_ok(self._serialize(contact))

        except MissingStudentAffiliation as ex:
            return self.response_unauthorized(ex)

        except DataFailureException as ex:
            return HttpResponse(ex, status=ex.status)
