# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings

MOCK_SAML_ATTRIBUTES = {
    "javerage": settings.MOCK_SAML_ATTRIBUTES,
    "jbothell": {
        "uwnetid": ["jbothell"],
        "uwregid": ["9136CCB8F66711D5BE060004AC494FFF"],
        "uwStudentSystemKey": ["000140585"],
        "affiliations": ["student", "member"],
        "eppn": ["jbothell@uw.edu"],
        "scopedAffiliations": [
            "student@washington.edu",
            "member@washington.edu",
        ],
        "isMemberOf": [],
        "displayName": ["Jane Bothell"],
        "preferredFirst": ["Jane"],
        "preferredSurname": ["Bothell"],
    },
    "jstaff": {
        "uwnetid": ["jstaff"],
        "uwregid": ["9136CCB8F66711D5BE060004AC490000"],
        "affiliations": ["staff", "member"],
        "eppn": ["jstaff@uw.edu"],
        "scopedAffiliations": [
            "staff@washington.edu",
            "member@washington.edu",
        ],
        "isMemberOf": ["u_test_group"],
        "displayName": ["Jack Staff"],
        "preferredFirst": ["Jack"],
        "preferredSurname": ["Staff"],
    },
}
