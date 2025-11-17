# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase
from student_personal.dao.person import SPSPerson
from student_personal.tests import MOCK_SAML_ATTRIBUTES
from uw_pws.util import fdao_pws_override


@fdao_pws_override
class PersonDAOTest(TestCase):
    pass
