from student_personal.views.api import RESTDispatch
from django.core.exceptions import ObjectDoesNotExist
#from django.utils.decorators import method_decorator


class EmergencyContact(RESTDispatch):
    def get(self, request):
        try:
            placeholderjson = {'json': 'placeholder'}
            return self.json_response(placeholderjson)
        except ObjectDoesNotExist as ex:
            return self.error_response(404,
                                       "Contact not found")
