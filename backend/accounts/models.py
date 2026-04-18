from django.db import models
from phonenumber_field.modelfields import PhoneNumberField as PhoneField


class VerificationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    DENIED = 'denied', 'Denied'
    SUSPENDED = 'suspended', 'Suspended'


class AccountType(models.TextChoices):
    SEEKER = 'seeker', 'Seeker'
    RECRUITER = 'recruiter', 'Recruiter'


class companySize(models.TextChoices):
    MICRO = '1-10', '1–10'
    MINI = '11-50', '11–50'
    SMALL = '51-200', '51–200'
    MID = '201-500', '201–500'
    LARGE = '501-1000', '501–1000'
    XL = '1000+', '1000+'


class companyRole(models.TextChoices):
    OWNER = 'owner', 'Owner'
    ADMIN = 'admin', 'Admin'
    RECRUITER = 'recruiter', 'Recruiter'


class EducationLevel(models.TextChoices):
    HIGH_SCHOOL = 'High School', 'HIGH SCHOOL'
    ASSOCIATE = 'Associate Degree', 'ASSOCIATE'
    BACHELORS = 'Bachelor’s Degree', 'BACHELORS'
    MASTERS = 'Master’s Degree', 'MASTERS'
    DOCTORATE = 'Doctorate', 'DOCTORATE'
    OTHER = 'Other', 'OTHER'


class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    firebase_uid = models.CharField(max_length=255, unique=True)
    account_type = models.CharField(max_length=20, choices=AccountType.choices)

    email = models.EmailField(unique=True)
    phone_number = PhoneField(null=True, blank=True)

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.account_type}:{self.firebase_uid}'


class seekerProfile(models.Model):
    account = models.OneToOneField(
        Account, on_delete=models.CASCADE, related_name='seeker_profile'
    )

    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=60)
    resume_upload = models.FileField(upload_to='Resumes/', null=True, blank=True)
    resume_info = models.JSONField(default=dict, blank=True)
    skills = models.JSONField(default=list)
    experience = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True)
    education_level = models.CharField(
        max_length=20,
        choices=EducationLevel.choices,
        default=EducationLevel.OTHER
    )

    profile_completed = models.BooleanField(default=False)
    anonymous_profile = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class companyProfile(models.Model):
    company_id = models.AutoField(primary_key=True)

    company_name = models.CharField(max_length=255, unique=True)
    main_location = models.CharField(max_length=255)
    about = models.TextField(blank=True)
    website = models.URLField(blank=True)
    company_size = models.CharField(
        max_length=20,
        choices=companySize.choices,
        blank=True,
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name


class recruiterProfile(models.Model):
    account = models.OneToOneField(
        Account, on_delete=models.CASCADE, related_name='recruiter_profile'
    )
    user_id = models.AutoField(primary_key=True)

    company = models.ForeignKey(
        companyProfile,
        on_delete=models.CASCADE,
        related_name='recruiters',
        null=True,
        blank=True
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=60)
    phone_number = PhoneField(null=True, blank=True)
    title = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    is_company_admin = models.BooleanField(default=False)

    profile_completed = models.BooleanField(default=False)

    def __str__(self):
        if self.company:
            return f'{self.first_name} {self.last_name} ({self.company.company_name})'
        return f'{self.first_name} {self.last_name}'


class companyMember(models.Model):
    profile = models.ForeignKey(
        recruiterProfile,
        on_delete=models.CASCADE,
        related_name='company_memberships'
    )

    company = models.ForeignKey(
        companyProfile,
        on_delete=models.CASCADE,
        related_name='members'
    )

    role = models.CharField(
        max_length=20,
        choices=companyRole.choices,
        default=companyRole.RECRUITER
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('profile', 'company')

    def __str__(self):
        return f'{self.profile.first_name} {self.profile.last_name} - {self.company.company_name} ({self.role})'