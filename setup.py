import os
from setuptools import setup

README = """
See the README on `GitHub
<https://github.com/uw-it-aca/student_personal>`_.
"""

# The VERSION file is created by travis-ci, based on the tag name
version_path = "student_personal/VERSION"
print(os.path.join(os.path.dirname(__file__), version_path))
VERSION = open(os.path.join(os.path.dirname(__file__), version_path)).read()
VERSION = VERSION.replace("\n", "")

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

url = "https://github.com/uw-it-aca/student_personal"
setup(
    name="student_personal",
    version=VERSION,
    packages=["student_personal"],
    author="UW-IT Student & Educational Technology Services",
    author_email="aca-it@uw.edu",
    include_package_data=True,
    install_requires=[
        "django~=5.2",
        "django-userservice~=3.2",
        "django-persistent-message~=1.3",
        "django-supporttools~=3.6",
        "uw-django-saml2~=1.8",
        "uw-memcached-clients~=1.0",
        "uw-restclients-core~=1.4",
        "uw-restclients-pws~=2.1",
        "uw-restclients-gws~=2.3",
        "uw-restclients-sps-contacts~=1.0",
        "uw-restclients-django-utils~=2.3",
    ],
    license="Apache License, Version 2.0",
    description="UW application that supports student contact information",
    long_description=README,
    url=url,
    classifiers=[
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Framework :: Django",
    ],
)
