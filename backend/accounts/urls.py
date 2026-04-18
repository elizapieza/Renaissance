from django.urls import path
from . import views

urlpatterns = [
    path('signup/seeker/', views.signup_seeker, name='signup_seeker'),
    path('signup/recruiter/', views.signup_recruiter, name='signup_recruiter'),
    path('onboarding/seeker/', views.onboarding_seeker, name='onboarding_seeker'),
    path('onboarding/recruiter/', views.onboarding_recruiter, name='onboarding_recruiter'),
    path('upload/resume/', views.upload_resume, name='upload_resume'),
    path('company/confirm-ownership/', views.confirm_company_ownership, name='confirm_company_ownership'),
    path('me/', views.get_current_account, name='get_current_account'),
    path('company/profile/', views.get_company_profile, name='get_company_profile'),
    path('company/profile/update/', views.update_company_profile, name='update_company_profile'),
    path('company/confirm-ownership/', views.confirm_company_ownership, name='confirm_company_ownership'),
]