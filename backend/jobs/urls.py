from django.urls import path
from . import views

urlpatterns = [
    path('createJob/', views.create_job, name='create_job'),
    path('rankedJobs/', views.get_ranked_jobs, name='get_ranked_jobs'),
]