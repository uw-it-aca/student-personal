# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0


from uw_pws import PWS, InvalidNetID, DataFailureException
from userservice.user import UserService


def get_user_attr(request):
    """
    Get the actual login attributes for the logged-in user. If user override
    is active, the attributes must be retrieved via the Person Web Service,
    otherwise the SAML session will contain the asserted attributes.
    """
    us = UserService()
    if us.get_override_user() is not None:
        person = PWS().get_person_by_netid(us.get_user())
        return {}  # TODO
    else:
        return request.session.get("samlUserdata", {})


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
