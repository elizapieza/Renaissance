import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.firebase_auth import verify_firebase_token
from accounts.models import (
    Account,
    AccountType,
    seekerProfile,
    recruiterProfile,
    companyMember,
    companyRole,
)
from jobs.models import JobListing
from .models import JobSwipe, CandidateSwipe, JobMatch, SwipeAction
from .runJava import runJava


def create_match_if_mutual_yes(seeker, recruiter, job):
    seeker_yes = JobSwipe.objects.filter(
        seeker=seeker,
        job=job,
        action=SwipeAction.YES
    ).exists()

    recruiter_yes = CandidateSwipe.objects.filter(
        recruiter=recruiter,
        seeker=seeker,
        job=job,
        action=SwipeAction.YES
    ).exists()

    if seeker_yes and recruiter_yes:
        JobMatch.objects.get_or_create(
            seeker=seeker,
            recruiter=recruiter,
            job=job
        )


@csrf_exempt
def submit_job_swipe(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)

        id_token = body.get('idToken')
        job_id = body.get('jobId')
        action = body.get('action')

        if not id_token:
            return JsonResponse({'error': 'Missing token'}, status=400)

        if not job_id:
            return JsonResponse({'error': 'Missing jobId'}, status=400)

        if action not in [SwipeAction.YES, SwipeAction.NO, SwipeAction.SAVE]:
            return JsonResponse({'error': 'Invalid action'}, status=400)

        decoded = verify_firebase_token(id_token)
        if not decoded:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        firebase_uid = decoded.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'Missing Firebase UID'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)

        if account.account_type != AccountType.SEEKER:
            return JsonResponse({'error': 'Only seekers can submit job swipes'}, status=403)

        seeker = account.seeker_profile
        job = JobListing.objects.select_related('company').get(job_id=job_id)

        swipe, _ = JobSwipe.objects.update_or_create(
            seeker=seeker,
            job=job,
            defaults={'action': action}
        )

        if action == SwipeAction.YES:
            recruiter_yes_swipes = CandidateSwipe.objects.filter(
                seeker=seeker,
                job=job,
                action=SwipeAction.YES
            ).select_related('recruiter')

            for recruiter_swipe in recruiter_yes_swipes:
                create_match_if_mutual_yes(seeker, recruiter_swipe.recruiter, job)

        return JsonResponse({
            'message': 'Job swipe saved successfully',
            'swipe_id': swipe.swipe_id,
            'action': swipe.action,
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except JobListing.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def recruiter_job_list(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')
        scope = body.get('scope', 'all')  # all | mine | others

        if not id_token:
            return JsonResponse({'error': 'Missing token'}, status=400)

        if scope not in ['all', 'mine', 'others']:
            return JsonResponse({'error': 'Invalid scope'}, status=400)

        decoded = verify_firebase_token(id_token)
        if not decoded:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        firebase_uid = decoded.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'Missing Firebase UID'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)

        if account.account_type != AccountType.RECRUITER:
            return JsonResponse({'error': 'Only recruiters can access recruiter job list'}, status=403)

        recruiter = account.recruiter_profile

        if not recruiter.company:
            return JsonResponse({'error': 'Recruiter has no company'}, status=400)

        membership = companyMember.objects.filter(
            profile=recruiter,
            company=recruiter.company
        ).first()

        if not membership or membership.role not in [
            companyRole.OWNER,
            companyRole.ADMIN,
            companyRole.RECRUITER
        ]:
            return JsonResponse(
                {'error': 'You do not have permission to view jobs for this company.'},
                status=403
            )

        jobs = JobListing.objects.select_related('posted_by', 'company').filter(
            company=recruiter.company
        )

        if scope == 'mine':
            jobs = jobs.filter(posted_by=recruiter)
        elif scope == 'others':
            jobs = jobs.exclude(posted_by=recruiter)

        jobs = jobs.order_by('-created_at')

        job_data = []
        for job in jobs:
            match_count = JobMatch.objects.filter(job=job).count()

            posted_by_me = False
            posted_by_name = 'Unknown'

            if job.posted_by:
                posted_by_me = job.posted_by.user_id == recruiter.user_id
                posted_by_name = f"{job.posted_by.first_name} {job.posted_by.last_name}".strip()

            job_data.append({
                'job_id': job.job_id,
                'title': job.title,
                'industry': job.industry,
                'location': job.location,
                'min_pay': job.min_pay,
                'max_pay': job.max_pay,
                'remote': job.remote,
                'required_education': job.required_education,
                'match_count': match_count,
                'posted_by_me': posted_by_me,
                'posted_by_name': posted_by_name,
            })

        return JsonResponse({'jobs': job_data}, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_ranked_applicants(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)

        id_token = body.get('idToken')
        job_id = body.get('jobId')

        if not id_token:
            return JsonResponse({'error': 'Missing token'}, status=400)

        if not job_id:
            return JsonResponse({'error': 'Missing jobId'}, status=400)

        decoded = verify_firebase_token(id_token)
        if not decoded:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        firebase_uid = decoded.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'Missing Firebase UID'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)

        if account.account_type != AccountType.RECRUITER:
            return JsonResponse({'error': 'Only recruiters can rank applicants'}, status=403)

        recruiter = account.recruiter_profile
        job = JobListing.objects.select_related('company').get(job_id=job_id)

        if recruiter.company != job.company:
            return JsonResponse({'error': 'You can only rank applicants for your own jobs'}, status=403)

        membership = companyMember.objects.filter(
            profile=recruiter,
            company=recruiter.company
        ).first()

        if not membership or membership.role not in [companyRole.OWNER, companyRole.ADMIN, companyRole.RECRUITER]:
            return JsonResponse({'error': 'You do not have permission to review applicants for this company'}, status=403)

        already_swiped_ids = CandidateSwipe.objects.filter(
            recruiter=recruiter,
            job=job
        ).values_list('seeker_id', flat=True)

        seekers = seekerProfile.objects.exclude(user_id__in=already_swiped_ids)

        payload = {
            "jobRequirements": {
                "jobId": job.job_id,
                "title": job.title or "",
                "industry": job.industry or "",
                "location": job.location or "",
                "requiredEducation": job.required_education or "",
                "qualifications": ", ".join(job.qualifications or []),
                "requirements": ", ".join(job.requirements or []),
                "description": job.description or "",
                "remote": job.remote,
                "minPay": float(job.min_pay or 0),
            },
            "applicants": []
        }

        for seeker in seekers:
            payload["applicants"].append({
                "userId": seeker.user_id,
                "firstName": seeker.first_name or "",
                "lastName": seeker.last_name or "",
                "educationLevel": seeker.education_level or "",
                "skills": ", ".join(seeker.skills or []),
                "experience": ", ".join(seeker.experience or []),
                "bio": seeker.bio or "",
                "anonymousProfile": seeker.anonymous_profile or {},
            })

        ranked_applicants = runJava(payload, "rankAndSort.ApplicantRunner")

        return JsonResponse({"applicants": ranked_applicants}, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except JobListing.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def submit_candidate_swipe(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)

        id_token = body.get('idToken')
        seeker_id = body.get('seekerId')
        job_id = body.get('jobId')
        action = body.get('action')

        if not id_token:
            return JsonResponse({'error': 'Missing token'}, status=400)

        if not seeker_id:
            return JsonResponse({'error': 'Missing seekerId'}, status=400)

        if not job_id:
            return JsonResponse({'error': 'Missing jobId'}, status=400)

        if action not in [SwipeAction.YES, SwipeAction.NO, SwipeAction.SAVE]:
            return JsonResponse({'error': 'Invalid action'}, status=400)

        decoded = verify_firebase_token(id_token)
        if not decoded:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        firebase_uid = decoded.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'Missing Firebase UID'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)

        if account.account_type != AccountType.RECRUITER:
            return JsonResponse({'error': 'Only recruiters can submit candidate swipes'}, status=403)

        recruiter = account.recruiter_profile
        seeker = seekerProfile.objects.get(user_id=seeker_id)
        job = JobListing.objects.get(job_id=job_id)

        if recruiter.company != job.company:
            return JsonResponse({'error': 'You can only swipe applicants for your own jobs'}, status=403)

        swipe, _ = CandidateSwipe.objects.update_or_create(
            recruiter=recruiter,
            seeker=seeker,
            job=job,
            defaults={'action': action}
        )

        if action == SwipeAction.YES:
            create_match_if_mutual_yes(seeker, recruiter, job)

        return JsonResponse({
            'message': 'Candidate swipe saved successfully',
            'swipe_id': swipe.swipe_id,
            'action': swipe.action,
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except seekerProfile.DoesNotExist:
        return JsonResponse({'error': 'Seeker not found'}, status=404)
    except JobListing.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_matches(request):
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

        if account.account_type == AccountType.SEEKER:
            seeker = account.seeker_profile
            matches = JobMatch.objects.select_related('job', 'recruiter', 'recruiter__company').filter(
                seeker=seeker
            ).order_by('-created_at')

            data = []
            for match in matches:
                data.append({
                    'match_id': match.match_id,
                    'job_id': match.job.job_id,
                    'job_title': match.job.title,
                    'company_name': match.job.company.company_name,
                    'location': match.job.location,
                    'created_at': match.created_at,
                })

            return JsonResponse({'matches': data}, status=200)

        elif account.account_type == AccountType.RECRUITER:
            recruiter = account.recruiter_profile
            matches = JobMatch.objects.select_related('job', 'seeker').filter(
                recruiter=recruiter
            ).order_by('-created_at')

            data = []
            for match in matches:
                data.append({
                    'match_id': match.match_id,
                    'job_id': match.job.job_id,
                    'job_title': match.job.title,
                    'seeker_id': match.seeker.user_id,
                    'candidate_name': f"{match.seeker.first_name} {match.seeker.last_name}",
                    'created_at': match.created_at,
                })

            return JsonResponse({'matches': data}, status=200)

        return JsonResponse({'error': 'Invalid account type'}, status=400)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)