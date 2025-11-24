# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.http import HttpResponse, StreamingHttpResponse
from django.core.exceptions import ObjectDoesNotExist
from student_personal.exceptions import MissingStudentAffiliation
from student_personal.views.api import BaseAPIView
from student_personal.dao.person import SPSPerson, DataFailureException
from datetime import datetime, timedelta


class PhotoView(BaseAPIView):
    cache_time = 60 * 60 * 4
    date_format = "%a, %d %b %Y %H:%M:%S GMT"

    def get(self, request, *args, **kwargs):
        """
        Displays the UW photo for the signed-in user.  The uwregid in the photo
        url is for cache-busting while user-override is activated.
        """
        now = datetime.utcnow()
        expires = now + timedelta(seconds=self.cache_time)
        try:
            photo = SPSPerson(request).get_photo()
            response = StreamingHttpResponse(photo, content_type="image/jpeg")
            response["Cache-Control"] = "public,max-age={}".format(
                self.cache_time)
            response["Expires"] = expires.strftime(self.date_format)
            response["Last-Modified"] = now.strftime(self.date_format)
            return response
        except MissingStudentAffiliation as ex:
            return self.response_unauthorized()
        except (ObjectDoesNotExist, DataFailureException) as ex:
            status = 304 if ("HTTP_IF_MODIFIED_SINCE" in request.META) else 404
            return HttpResponse(status=status)
