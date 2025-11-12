# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.urls import reverse
from userservice.user import UserService
from student_personal.dao.person import get_user_attr, DataFailureException
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
            context.update(get_user_attr(self.request))
        except DataFailureException as ex:
            logger.error(ex)

        us = UserService()
        context["login_user"] = us.get_original_user()
        context["override_user"] = us.get_user()
        context["signout_url"] = reverse("saml_logout")
        context["debug_mode"] = settings.DEBUG
        return context
