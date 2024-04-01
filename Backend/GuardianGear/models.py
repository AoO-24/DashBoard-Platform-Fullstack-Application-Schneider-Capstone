from django.db import models


class Driver(models.Model):
    driver_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50)


class Hours(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    recorded_time = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateField(null=True, blank=True)


class Appointment(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    appt_start = models.DateTimeField(null=True, blank=True)
    appt_start = models.DateTimeField(null=True, blank=True)
    estimated_time = models.DecimalField(max_digits=5, decimal_places=2)
