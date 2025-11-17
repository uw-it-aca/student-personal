# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.urls import reverse
from userservice.user import UserService
from student_personal.dao.person import SPSPerson, DataFailureException
from logging import getLogger

logger = getLogger(__name__)


@method_decorator(login_required, name="dispatch")
class DefaultPageView(TemplateView):
    template_name = "index.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response({"context_data": context})

    def get_context_data(self, **kwargs):
        context = {}

        try:
            person = SPSPerson(self.request)
            context.update(person.get_view_context())
        except DataFailureException as ex:
            logger.error(ex)

        us = UserService()
        context["loginUser"] = us.get_original_user()
        context["overrideUser"] = us.get_user()
        context["signoutUrl"] = reverse("saml_logout")
        context["clearOverrideUrl"] = reverse("userservice_override")
        context["emergencyContactUrl"] = reverse("emergency-contact-api")
        context["photoUrl"] = reverse("photo-api")
        context["debugMode"] = settings.DEBUG
        return context
