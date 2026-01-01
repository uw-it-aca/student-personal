# Copyright 2026 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from django.urls import reverse
from uw_pws import PWS, InvalidNetID, DataFailureException
from uw_saml.utils import get_attribute, is_member_of_group
from userservice.user import UserService
from student_personal.exceptions import MissingStudentAffiliation


class SPSPerson():
    """
    Get the login attributes for the logged-in user. If user override is
    active, the attributes must be retrieved via the Person Web Service,
    otherwise the SAML session will contain the asserted attributes.
    """
    def __init__(self, request):
        person = PWS().get_person_by_netid(UserService().get_user())

        self.is_student = person.is_student and person.is_stud_state_current()
        self.display_name = person.display_name
        self.preferred_first_name = person.preferred_first_name
        self.preferred_surname = person.preferred_surname
        self.pronouns = person.pronouns
        self.student_number = person.student_number
        self.system_key = person.student_system_key
        self.uwregid = person.uwregid

    def get_view_context(self):
        context = {
            "isStudent": self.is_student,
            "displayName": self.display_name,
            "preferredFirst": self.preferred_first_name,
            "preferredSurname": self.preferred_surname,
        }

        if self.is_student:
            context.update({
                "pronouns": self.pronouns,
                "studentNumber": self.student_number,
                "photoUrl": reverse("photo-api", kwargs={
                    "uwregid": self.uwregid}),
                "emergencyContactUrl": reverse("emergency-contact-api"),
                "familyContactUrl": reverse("family-contact-api"),
            })

        return context

    def get_photo(self, image_size="medium"):
        if not self.is_student:
            raise MissingStudentAffiliation()

        return PWS().get_idcard_photo(self.uwregid, size=image_size)


"""
Authorization functions that permit activities in dependent apps.
"""


def can_override_user(request):
    return (is_member_of_group(request, settings.ADMIN_GROUP) or
            is_member_of_group(request, settings.SUPPORT_GROUP))


def can_proxy_restclient(request, service, url):
    return (is_member_of_group(request, settings.ADMIN_GROUP) or
            is_member_of_group(request, settings.SUPPORT_GROUP))


def can_manage_persistent_messages(request):
    return is_member_of_group(request, settings.ADMIN_GROUP)


def is_overridable_uwnetid(username):
    error_msg = "No override user supplied, please enter a UWNetID"
    if username is not None and len(username) > 0:
        try:
            person = PWS().get_person_by_netid(username)
            if username.lower() == person.uwnetid:
                error_msg = None
            else:
                error_msg = "Current UWNetID: {}, Prior UWNetID: ".format(
                    person.uwnetid)
        except InvalidNetID:
            error_msg = "Not a valid UWNetID: "
        except DataFailureException as err:
            if err.status == 404:
                error_msg = 'UWNetID not found: '
            else:
                error_msg = "Error ({}) {}: ".format(err.status, err.msg)
    return error_msg
