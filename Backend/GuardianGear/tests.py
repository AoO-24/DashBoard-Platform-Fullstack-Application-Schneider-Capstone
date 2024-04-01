from django.test import TestCase
from .models import Driver, Hours, Appointment
from .views import calculate_remaining_hours


class HoursTestCase(TestCase):
    def setUp(self):
        self.driver = Driver.objects.create(name="Test Driver")
        Hours.objects.create(driver=self.driver, recorded_time=10)  # 10 hours
        self.appointment = Appointment.objects.create(driver=self.driver, estimated_time=2)  # 2 hours

    def test_remaining_hours_calculation(self):
        remaining_hours = calculate_remaining_hours(self.driver.driver_id, self.appointment.id)
        self.assertEqual(remaining_hours, 8)  # 10 hours - 2 hours
