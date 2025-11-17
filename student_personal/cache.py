# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from memcached_clients import RestclientPymemcacheClient
import re

ONE_MINUTE = 60
ONE_HOUR = ONE_MINUTE * 60
ONE_DAY = ONE_HOUR * 24


class RestClientCache(RestclientPymemcacheClient):
    def get_cache_expiration_time(self, service, url, status=None):
        if "pws" == service:
            if status == 200:
                return ONE_HOUR * 4
        elif "gws" == service:
            return ONE_HOUR
        elif "sps_contacts_auth" == service:
            return ONE_HOUR

        return ONE_HOUR
