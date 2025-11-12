# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0


from django.conf import settings
from django.urls import re_path
from django.views.generic import TemplateView
from student_personal.views.pages import DefaultPageView
from student_personal.views.api.emergency_contact import EmergencyContactView


# start with an empty url array
urlpatterns = []

# add debug routes for developing error pages
if settings.DEBUG:
    urlpatterns += [
        re_path(
            r"^500$",
            TemplateView.as_view(template_name="500.html"),
            name="500_response",
        ),
        re_path(
            r"^404$",
            TemplateView.as_view(template_name="404.html"),
            name="404_response",
        ),
    ]

urlpatterns += [
    # Emergency comtact API
    re_path(
        r"^api/v1/emergency_contact/(?P<system_key>[\d]*)$",
        EmergencyContactView.as_view(), name="emergency-contact"),

    # Vue-router paths
    re_path(r"^emergency$", DefaultPageView.as_view(), name="emergency"),
    re_path(r"^$", DefaultPageView.as_view(), name="index"),
]
