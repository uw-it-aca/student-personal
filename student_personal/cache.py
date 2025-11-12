# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from memcached_clients import RestclientPymemcacheClient
import re

ONE_MINUTE = 60
ONE_HOUR = ONE_MINUTE * 60
ONE_DAY = ONE_HOUR * 24


class RestClientCache(RestclientPymemcacheClient):
    def get_cache_expiration_time(self, service, url, status=None):
        if 'pws' == service:
            return ONE_HOUR * 8
        elif 'gws' == service:
            return ONE_HOUR

        return ONE_HOUR
