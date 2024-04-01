from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views import View
from .models import Driver, Hours, Appointment
from django.db.models import Sum


# View that serves the index.html from React build folder
class FrontendAppView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)


def calculate_remaining_hours(driver_id, appointment_id):
    recorded_time = Hours.objects.filter(driver_id=driver_id).aggregate(Sum('recorded_time'))['recorded_time__sum']
    estimated_time = Appointment.objects.get(id=appointment_id).estimated_time
    remaining_hours = recorded_time - estimated_time if recorded_time else None
    return remaining_hours


# In your RemainingHoursView, you can now call this function directly:
class RemainingHoursView(View):
    def get(self, request, driver_id, appointment_id):
        remaining_hours = calculate_remaining_hours(driver_id, appointment_id)
        return JsonResponse({'remaining_hours': remaining_hours})
