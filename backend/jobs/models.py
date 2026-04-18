from django.db import models
from accounts.models import companyProfile, recruiterProfile

class requiredEducation(models.TextChoices):
    HIGH_SCHOOL = 'High School', 'HIGH SCHOOL'
    ASSOCIATE = 'Associate Degree', 'ASSOCIATE'
    BACHELORS = 'Bachelor’s Degree', 'BACHELORS'
    MASTERS = 'Master’s Degree', 'MASTERS'
    DOCTORATE = 'Doctorate', 'DOCTORATE'
    OTHER = 'Other', 'OTHER'

class JobListing(models.Model):
    job_id = models.AutoField(primary_key=True)

    company = models.ForeignKey(
        companyProfile,
        on_delete=models.CASCADE,
        related_name='jobs'
    )

    posted_by = models.ForeignKey(
        recruiterProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posted_jobs'
    )

    title = models.CharField(max_length=255)
    industry = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255)

    required_education = models.CharField(
        max_length=20,
        choices=requiredEducation.choices,
        default=requiredEducation.OTHER
    )

    min_pay = models.IntegerField()
    max_pay = models.IntegerField(null=True, blank=True)

    description = models.TextField()

    requirements = models.JSONField(default=list)
    qualifications = models.JSONField(default=list, blank=True)

    remote = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company.company_name}"