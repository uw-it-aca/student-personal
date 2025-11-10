# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0


class OverrideNotPermitted(Exception):
    def __str__(self):
        return "Action not permitted while using admin override"


class InvalidSystemKey(Exception):
    def __str__(self):
        return "system_key is invalid"
