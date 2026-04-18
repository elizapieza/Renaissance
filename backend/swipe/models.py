from django.db import models
from jobs.models import JobListing
from accounts.models import seekerProfile, recruiterProfile

class SwipeAction(models.TextChoices):
    YES = 'yes', 'Yes'
    NO = 'no', 'No'
    SAVE = 'save', 'Save'


class MatchStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    ARCHIVED = 'archived', 'Archived'


class JobSwipe(models.Model):
    swipe_id = models.AutoField(primary_key=True)
    seeker = models.ForeignKey(
        seekerProfile,
        on_delete=models.CASCADE,
        related_name='job_swipes'
    )
    job = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        related_name='seeker_swipes'
    )
    action = models.CharField(max_length=10, choices=SwipeAction.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seeker', 'job')

    def __str__(self):
        return f"{self.seeker.user_id} -> {self.job.job_id} ({self.action})"


class CandidateSwipe(models.Model):
    swipe_id = models.AutoField(primary_key=True)
    recruiter = models.ForeignKey(
        recruiterProfile,
        on_delete=models.CASCADE,
        related_name='candidate_swipes'
    )
    seeker = models.ForeignKey(
        seekerProfile,
        on_delete=models.CASCADE,
        related_name='recruiter_swipes'
    )
    job = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        related_name='candidate_swipes'
    )
    action = models.CharField(max_length=10, choices=SwipeAction.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('recruiter', 'seeker', 'job')

    def __str__(self):
        return f"{self.recruiter.user_id} -> {self.seeker.user_id} for job {self.job.job_id} ({self.action})"


class JobMatch(models.Model):
    match_id = models.AutoField(primary_key=True)
    seeker = models.ForeignKey(
        seekerProfile,
        on_delete=models.CASCADE,
        related_name='matches'
    )
    recruiter = models.ForeignKey(
        recruiterProfile,
        on_delete=models.CASCADE,
        related_name='matches'
    )
    job = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        related_name='matches'
    )
    status = models.CharField(
        max_length=20,
        choices=MatchStatus.choices,
        default=MatchStatus.ACTIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seeker', 'recruiter', 'job')

    def __str__(self):
        return f"Match: {self.seeker.user_id} <-> {self.recruiter.user_id} on {self.job.job_id}"