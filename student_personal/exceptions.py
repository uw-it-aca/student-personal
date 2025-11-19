# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0


class MissingStudentAffiliation(Exception):
    def __str__(self):
        return "Person is not a current student"


class InvalidContactList(Exception):
    def __str__(self):
        return "Incorrect ContactList count"


class OverrideNotPermitted(Exception):
    def __str__(self):
        return "Action not permitted while using admin override"
