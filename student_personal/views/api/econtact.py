# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from student_personal.views.api import RESTDispatch
from django.core.exceptions import ObjectDoesNotExist

# from django.utils.decorators import method_decorator


class EmergencyContact(RESTDispatch):
    def get(self, request):
        try:
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
            return self.json_response(ecjson)
        except ObjectDoesNotExist as ex:
            return self.error_response(404, "Contact not found")
