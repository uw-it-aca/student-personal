# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from uw_pws import PWS, InvalidNetID, DataFailureException
from uw_saml.utils import get_attribute
from userservice.user import UserService
from student_personal.exceptions import MissingStudentAffiliation


class SPSPerson():
    """
    Get the login attributes for the logged-in user. If user override is
    active, the attributes must be retrieved via the Person Web Service,
    otherwise the SAML session will contain the asserted attributes.
    """
    def __init__(self, request):
        us = UserService()
        if us.get_override_user() is not None:
            person = PWS().get_person_by_netid(us.get_user())
            self.is_student = person.is_student
            self.display_name = person.display_name
            self.preferred_first_name = person.preferred_first_name
            self.preferred_surname = person.preferred_surname
            self.system_key = person.student_system_key
            self.uwregid = person.uwregid
        else:
            self.is_student = "student" in get_attribute(
                request, "affiliations")
            self.display_name = get_attribute(request, "displayName")
            self.preferred_first_name = get_attribute(
                request, "preferredFirst")
            self.preferred_surname = get_attribute(request, "preferredSurname")
            self.system_key = get_attribute(request, "uwStudentSystemKey")
            self.uwregid = get_attribute(request, "uwregid")

    def get_view_context(self):
        return {
            "isStudent": self.is_student,
            "displayName": self.display_name,
            "preferredFirst": self.preferred_first_name,
            "preferredSurname": self.preferred_surname,
        }

    def get_photo(self, image_size="medium"):
        if not self.is_student:
            raise MissingStudentAffiliation()

        return PWS().get_idcard_photo(self.uwregid, size=image_size)


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
