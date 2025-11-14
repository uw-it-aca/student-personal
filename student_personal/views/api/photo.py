# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.http import HttpResponse, StreamingHttpResponse
from django.core.exceptions import ObjectDoesNotExist
from restclients_core.exceptions import DataFailureException
from student_personal.views.api import BaseAPIView
from student_personal.dao.person import get_user_photo
from datetime import datetime, timedelta


class PhotoView(BaseAPIView):
    cache_time = 60 * 60 * 4
    date_format = '%a, %d %b %Y %H:%M:%S GMT'

    def get(self, request, *args, **kwargs):
        now = datetime.utcnow()
        expires = now + timedelta(seconds=self.cache_time)
        try:
            photo = get_user_photo(request)
            response = StreamingHttpResponse(photo, content_type='image/jpeg')
            response['Cache-Control'] = 'public,max-age={}'.format(
                self.cache_time)
            response['Expires'] = expires.strftime(self.date_format)
            response['Last-Modified'] = now.strftime(self.date_format)
            return response
        except (ObjectDoesNotExist, DataFailureException):
            status = 304 if ('HTTP_IF_MODIFIED_SINCE' in request.META) else 404
            return HttpResponse(status=status)
