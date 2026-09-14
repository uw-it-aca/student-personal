# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from datetime import UTC, datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, StreamingHttpResponse

from student_personal.dao.person import DataFailureException, SPSPerson
from student_personal.exceptions import MissingStudentAffiliation
from student_personal.views.api import BaseAPIView


class PhotoView(BaseAPIView):
    cache_time = 60 * 60 * 4
    date_format = "%a, %d %b %Y %H:%M:%S GMT"

    def get(self, request, *args, **kwargs):
        """
        Displays the UW photo for the signed-in user.  The uwregid in the photo
        url is for cache-busting while user-override is activated.
        """
        now = datetime.now(UTC)
        expires = now + timedelta(seconds=self.cache_time)
        try:
            photo = SPSPerson(request).get_photo()
            response = StreamingHttpResponse(photo, content_type="image/jpeg")
            response["Cache-Control"] = f"public,max-age={self.cache_time}"
            response["Expires"] = expires.strftime(self.date_format)
            response["Last-Modified"] = now.strftime(self.date_format)
            return response
        except MissingStudentAffiliation:
            return self.response_unauthorized()
        except (ObjectDoesNotExist, DataFailureException):
            status = 304 if ("HTTP_IF_MODIFIED_SINCE" in request.META) else 404
            return HttpResponse(status=status)
