# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from django.views import View
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from student_personal.views.decorators import xhr_login_required
from student_personal.exceptions import (
        MissingStudentAffiliation, OverrideNotPermitted)
from student_personal.dao.person import SPSPerson
from userservice.user import UserService
from logging import getLogger
import json

logger = getLogger(__name__)


@method_decorator(xhr_login_required, name="dispatch")
class BaseAPIView(View):
    def valid_user(self, request):
        sps_person = SPSPerson(request)
        if sps_person.system_key and sps_person.is_student:
            return sps_person.system_key

        raise MissingStudentAffiliation()

    def valid_user_override(self):
        if (not getattr(settings, "ALLOW_USER_OVERRIDE_FOR_WRITE", False) and
                UserService().get_override_user() is not None):
            raise OverrideNotPermitted()

    def response_ok(self, content):
        return HttpResponse(
            content, status=200, content_type="application/json")

    def response_badrequest(self, content="Missing parameters"):
        return HttpResponse(content, status=400)

    def response_unauthorized(self, content="Not authorized"):
        # content may be an Exception object
        if isinstance(content, BaseException):
            content = str(content)
        return HttpResponse(content, status=401)

    def response_notfound(self, content="Not found"):
        return HttpResponse(content, status=404)
