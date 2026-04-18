from django.urls import path
from . import views

urlpatterns = [
    path('submit-job-swipe/', views.submit_job_swipe, name='submit_job_swipe'),
    path('recruiter/jobs/', views.recruiter_job_list, name='recruiter_job_list'),
    path('ranked-applicants/', views.get_ranked_applicants, name='get_ranked_applicants'),
    path('submit-candidate-swipe/', views.submit_candidate_swipe, name='submit_candidate_swipe'),
    path('matches/', views.get_matches, name='get_matches'),
]