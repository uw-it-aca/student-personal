from student_personal.views.api import RESTDispatch
from django.core.exceptions import ObjectDoesNotExist

# from django.utils.decorators import method_decorator


class EmergencyContact(RESTDispatch):
    def get(self, request):
        try:
            ecjson = [
                {
                    "name": "John Doe",
                    "phone": "1234567890",
                    "email": "e1@gmail.com",
                    "relationship": "",
                    "last_updated": "",
                },
                {
                    "name": "Jane Doe",
                    "phone": "5555555555",
                    "email": "janedoe@gmail.com",
                    "relationship": "",
                    "last_updated": "",
                },
            ]
            return self.json_response(ecjson)
        except ObjectDoesNotExist as ex:
            return self.error_response(404, "Contact not found")
