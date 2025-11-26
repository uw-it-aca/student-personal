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
    "bill": {
        "uwnetid": ["bill"],
        "uwregid": ["FBB38FE46A7C11D5A4AE0004AC494FFE"],
        "affiliations": ["staff", "alum", "member"],
        "eppn": ["bill@uw.edu"],
        "scopedAffiliations": [
            "staff@washington.edu",
            "alum@washington.edu",
            "member@washington.edu",
        ],
        "isMemberOf": ["u_test_group"],
        "displayName": ["Bill Teacher"],
        "preferredFirst": ["Bill"],
        "preferredSurname": ["Teacher"],
    },
}
