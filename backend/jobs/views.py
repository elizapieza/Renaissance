import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from swipe.runJava import runJava
from accounts.models import Account, companyMember, companyRole
from .models import JobListing
from accounts.firebase_auth import verify_firebase_token

@csrf_exempt
def create_job(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)

        id_token = body.get('idToken')
        title = body.get('title')
        industry = body.get('industry')
        location = body.get('location')
        required_education = body.get('requiredEducation')
        min_pay = body.get('minPay')
        max_pay = body.get('maxPay')
        description = body.get('description')
        qualifications = body.get('qualifications', [])
        requirements = body.get('requirements', [])
        remote = body.get('remote', False)

        if not id_token:
            return JsonResponse({'error': 'Missing token'}, status=400)

        if not title or not industry or not location or min_pay is None or not description:
            return JsonResponse({'error': 'Title, industry, location, minimum pay, and description are required.'}, status=400)

        decoded = verify_firebase_token(id_token)
        if not decoded:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        firebase_uid = decoded.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'Missing Firebase UID'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)
        recruiter = account.recruiter_profile

        if not recruiter.company:
            return JsonResponse({'error': 'Recruiter has no company'}, status=400)

        membership = companyMember.objects.filter(
            profile=recruiter,
            company=recruiter.company
        ).first()

        if not membership or membership.role not in [companyRole.OWNER, companyRole.ADMIN, companyRole.RECRUITER]:
            return JsonResponse({'error': 'You do not have permission to post jobs for this company.'}, status=403)

        job = JobListing.objects.create(
            company=recruiter.company,
            posted_by=recruiter,
            title=title,
            location=location,
            industry=industry,
            required_education=required_education,
            min_pay=min_pay,
            max_pay=max_pay,
            description=description,
            requirements=requirements,
            qualifications=qualifications,
            remote=remote,
        )

        return JsonResponse({
            'message': 'Job created successfully',
            'job_id': job.job_id
        }, status=201)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def get_ranked_jobs(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')

        if not id_token:
            return JsonResponse({'error': 'Missing token'}, status=400)

        decoded = verify_firebase_token(id_token)
        if not decoded:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        firebase_uid = decoded.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'Missing Firebase UID'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)
        seeker = account.seeker_profile

        from swipe.models import JobSwipe

        already_swiped_ids = JobSwipe.objects.filter(
            seeker=seeker
        ).values_list('job_id', flat=True)

        jobs = JobListing.objects.select_related('company').exclude(
            job_id__in=already_swiped_ids
        )

        payload = {
            "seeker": {
                "desiredJobTitle": getattr(seeker, "title", "") or "",
                "desiredIndustry": getattr(seeker, "industry", "") or "",
                "desiredLocation": getattr(seeker, "location", "") or "",
                "educationLevel": getattr(seeker, "education_level", "") or "",
                "qualifications": ", ".join(getattr(seeker, "qualifications", []) or []),
                "skills": ", ".join(getattr(seeker, "skills", []) or []),
                "remotePreference": getattr(seeker, "remote_preference", False),
                "minPayExpectation": float(getattr(seeker, "min_pay_expectation", 0) or 0)
            },
            "jobs": []
        }

        for job in jobs:
            payload["jobs"].append({
                "job_id": job.job_id,
                "title": job.title,
                "company": job.company.company_name if job.company else "",
                "industry": job.industry or "",
                "location": job.location or "",
                "educationLevel": job.required_education or "",
                "qualifications": ", ".join(job.qualifications or []),
                "requirements": ", ".join(job.requirements or []),
                "description": job.description or "",
                "remote": job.remote,
                "minPay": float(job.min_pay or 0)
            })

        ranked_jobs = runJava(payload, "rankAndSort.Runner")

        cleaned_jobs = []
        for job in ranked_jobs:
            cleaned_jobs.append({
                "job_id": job.get("job_id"),
                "title": job.get("title"),
                "company": job.get("company"),
                "industry": job.get("industry"),
                "location": job.get("location"),
                "educationLevel": job.get("educationLevel"),
                "qualifications": job.get("qualifications"),
                "requirements": job.get("requirements"),
                "description": job.get("description"),
                "remote": job.get("remote"),
                "minPay": job.get("minPay"),
                "rankingScore": job.get("rankingScore")
            })

        return JsonResponse({"jobs": cleaned_jobs}, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)