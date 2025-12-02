from .base_settings import *

INSTALLED_APPS += [
    "student_personal.apps.StudentPersonalConfig",
    "student_personal.apps.ViteStaticFilesConfig",
    "supporttools",
    "userservice",
    "persistent_message",
    "rc_django",
]

INSTALLED_APPS.remove("django.contrib.staticfiles")

MIDDLEWARE += [
    "userservice.user.UserServiceMiddleware",
    "student_personal.logging.UserLoggingMiddleware",
]

# If you have file data, define the path here
# DATA_ROOT = os.path.join(BASE_DIR, "student_personal/data")

TEMPLATES[0]["OPTIONS"]["context_processors"] += [
    "supporttools.context_processors.supportools_globals",
    "student_personal.context_processors.persistent_messages",
]

if os.getenv("ENV") == "localdev":
    DEBUG = True
    VITE_MANIFEST_PATH = os.path.join(
        BASE_DIR, "student_personal", "static", ".vite", "manifest.json"
    )
    MOCK_SAML_ATTRIBUTES = {
        "uwnetid": ["javerage"],
        "uwregid": ["9136CCB8F66711D5BE060004AC494FFE"],
        "uwStudentSystemKey": ["000083856"],
        "affiliations": ["student", "member"],
        "eppn": ["javerage@uw.edu"],
        "scopedAffiliations": [
            "student@washington.edu",
            "member@washington.edu",
        ],
        "isMemberOf": ["u_test_group"],
        "displayName": ["James Average"],
        "preferredFirst": ["James"],
        "preferredSurname": ["Average"],
    }
    ADMIN_GROUP = "u_test_group"
    SUPPORT_GROUP = "u_test_group"
else:
    VITE_MANIFEST_PATH = os.path.join(os.sep, "static", ".vite", "manifest.json")
    RESTCLIENTS_DAO_CACHE_CLASS = "student_personal.cache.RestClientCache"
    ADMIN_GROUP = os.getenv("ADMIN_GROUP", "")
    SUPPORT_GROUP = os.getenv("SUPPORT_GROUP", "")

    # Django cache backend for the api tokens
    CACHES = {
        "default": {
            "BACKEND": "memcached_clients.django_backend.PymemcacheCache",
            "LOCATION": MEMCACHED_SERVERS,
            "OPTIONS": {
                "use_pooling": MEMCACHED_USE_POOLING,
                "max_pool_size": MEMCACHED_MAX_POOL_SIZE,
            },
        }
    }
    CSRF_TRUSTED_ORIGINS = ["https://" + os.getenv("CLUSTER_CNAME")]

SUPPORTTOOLS_PARENT_APP = "StudentPersonal"
SUPPORTTOOLS_PARENT_APP_URL = "/"

USERSERVICE_VALIDATION_MODULE = "student_personal.dao.person.is_overridable_uwnetid"
USERSERVICE_OVERRIDE_AUTH_MODULE = "student_personal.dao.person.can_override_user"
RESTCLIENTS_ADMIN_AUTH_MODULE = "student_personal.dao.person.can_proxy_restclient"
PERSISTENT_MESSAGE_AUTH_MODULE = (
    "student_personal.dao.person.can_manage_persistent_messages"
)
ALLOW_USER_OVERRIDE_FOR_WRITE = os.getenv("ENV", "localdev") != "prod"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "add_user": {
            "()": "student_personal.logging.UserFilter",
        },
        "stdout_stream": {
            "()": "django.utils.log.CallbackFilter",
            "callback": lambda record: record.levelno < logging.WARNING,
        },
        "stderr_stream": {
            "()": "django.utils.log.CallbackFilter",
            "callback": lambda record: record.levelno > logging.INFO,
        },
    },
    "formatters": {
        "student_personal": {
            "format": "%(levelname)-4s %(user)s %(actas)s %(asctime)s %(message)s [%(name)s]",
            "datefmt": "[%d/%b/%Y:%H:%M:%S %z]",
        },
        "restclients_timing": {
            "format": "%(levelname)-4s restclients_timing %(asctime)s %(module)s %(message)s [%(name)s]",
            "datefmt": "[%d/%b/%Y:%H:%M:%S %z]",
        },
    },
    "handlers": {
        "stdout": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "filters": ["add_user", "stdout_stream"],
            "formatter": "student_personal",
        },
        "stderr": {
            "class": "logging.StreamHandler",
            "stream": sys.stderr,
            "filters": ["add_user", "stderr_stream"],
            "formatter": "student_personal",
        },
        "restclients_timing": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "filters": ["stdout_stream"],
            "formatter": "restclients_timing",
        },
        "null": {
            "class": "logging.NullHandler",
        },
    },
    "loggers": {
        "django.security.DisallowedHost": {
            "handlers": ["null"],
            "propagate": False,
        },
        "django.request": {
            "handlers": ["stderr"],
            "level": "ERROR",
            "propagate": True,
        },
        "student_personal": {
            "handlers": ["stdout", "stderr"],
            "level": "INFO",
            "propagate": False,
        },
        "restclients_core": {
            "handlers": ["restclients_timing"],
            "level": "INFO",
            "propagate": False,
        },
        "": {
            "handlers": ["stdout", "stderr"],
            "level": (
                "INFO" if os.getenv("ENV", "localdev") == "prod" else "DEBUG"
            ),
        },
    },
}
