from django.db import models
from jobs.models import JobListing
from accounts.models import seekerProfile, recruiterProfile

class MatchStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    ARCHIVED = 'archived', 'Archived'

class JobMatch(models.Model):
    match_id = models.AutoField(primary_key=True)
    seeker = models.ForeignKey(seekerProfile, on_delete=models.CASCADE, related_name='matches')
    recruiter = models.ForeignKey(recruiterProfile, on_delete=models.CASCADE, related_name='matches')
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='matches')
    status = models.CharField(max_length=20, choices=MatchStatus.choices, default=MatchStatus.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seeker', 'recruiter', 'job')