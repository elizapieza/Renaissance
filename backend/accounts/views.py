import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .anonymization import build_anonymous_seeker_profile
from .models import Account, AccountType, seekerProfile, recruiterProfile, companyProfile, companyMember, companyRole
from .firebase_auth import verify_firebase_token

@csrf_exempt
def get_current_account(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed.'}, status=405)

    try:
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return JsonResponse({'error': 'Authorization header is missing.'}, status=401)

        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Invalid authorization header format.'}, status=401)

        id_token = auth_header.split('Bearer ')[1].strip()

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=401)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        try:
            account = Account.objects.get(firebase_uid=firebase_uid)
        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account does not exist.'}, status=404)

        profile_completed = False

        if account.account_type == AccountType.SEEKER:
            try:
                profile_completed = account.seeker_profile.profile_completed
            except seekerProfile.DoesNotExist:
                profile_completed = False

        elif account.account_type == AccountType.RECRUITER:
            try:
                profile_completed = account.recruiter_profile.profile_completed
            except recruiterProfile.DoesNotExist:
                profile_completed = False

        return JsonResponse({
            'account_id': account.account_id,
            'firebase_uid': account.firebase_uid,
            'email': account.email,
            'account_type': account.account_type,
            'profile_completed': profile_completed,
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def signup_seeker(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        if not firebase_uid or not email:
            return JsonResponse({'error': 'User ID or email is missing.'}, status=400)

        account, created = Account.objects.get_or_create(
            firebase_uid=firebase_uid,
            defaults={
                'account_type': AccountType.SEEKER,
                'email': email,
            },
        )

        if not created and account.account_type != AccountType.SEEKER:
            return JsonResponse(
                {'error': 'Account already exists with a different account type.'},
                status=400
            )

        seeker_profile, _ = seekerProfile.objects.get_or_create(
            account=account,
            defaults={
                'first_name': '',
                'last_name': '',
                'profile_completed': False,
            },
        )

        return JsonResponse(
            {
                'message': 'Seeker account created successfully.',
                'role': 'seeker',
                'profile_completed': seeker_profile.profile_completed,
            },
            status=201 if created else 200,
        )

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def signup_recruiter(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        if not firebase_uid or not email:
            return JsonResponse({'error': 'User ID or email is missing.'}, status=400)

        account, created = Account.objects.get_or_create(
            firebase_uid=firebase_uid,
            defaults={
                'account_type': AccountType.RECRUITER,
                'email': email,
            },
        )

        if not created and account.account_type != AccountType.RECRUITER:
            return JsonResponse(
                {'error': 'Account already exists with a different account type.'},
                status=400
            )

        recruiter_profile, _ = recruiterProfile.objects.get_or_create(
            account=account,
            defaults={
                'first_name': '',
                'last_name': '',
                'title': '',
                'company': None,
                'is_company_admin': False,
                'profile_completed': False,
            },
        )

        return JsonResponse(
            {
                'message': 'Recruiter account created successfully.',
                'role': 'recruiter',
                'profile_completed': recruiter_profile.profile_completed,
            },
            status=201 if created else 200,
        )

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@csrf_exempt
def onboarding_seeker(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')
        first_name = body.get('firstName')
        last_name = body.get('lastName')
        phone_number = body.get('phoneNumber')
        bio = body.get('bio')
        skills = body.get('skills', [])
        experience = body.get('experience', [])
        education = body.get('education')

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        if not first_name or not last_name:
            return JsonResponse(
                {'error': 'First name and last name are required.'},
                status=400
            )

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')

        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        try:
            account = Account.objects.get(firebase_uid=firebase_uid)
            seeker_profile = account.seeker_profile

            if phone_number:
                phone_exists = Account.objects.filter(
                    phone_number=phone_number
                ).exclude(
                    account_id=account.account_id
                ).exists()

                if phone_exists:
                    return JsonResponse({'error': 'Phone number is already in use.'}, status=400)

                account.phone_number = phone_number
                account.save()

            seeker_profile.first_name = first_name
            seeker_profile.last_name = last_name
            seeker_profile.bio = bio or ''
            seeker_profile.skills = skills
            seeker_profile.experience = experience
            seeker_profile.education_level = education or seeker_profile.education_level
            seeker_profile.profile_completed = True
            seeker_profile.anonymous_profile = build_anonymous_seeker_profile(seeker_profile)
            seeker_profile.save()

            return JsonResponse({
                'message': 'Seeker profile updated successfully.',
                'profile_completed': seeker_profile.profile_completed,
                'anonymous_profile': seeker_profile.anonymous_profile
            }, status=200)

        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account does not exist.'}, status=404)
        except seekerProfile.DoesNotExist:
            return JsonResponse({'error': 'Seeker profile does not exist.'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')
        first_name = body.get('firstName')
        last_name = body.get('lastName')
        phone_number = body.get('phoneNumber')
        bio = body.get('bio')
        skills = body.get('skills', [])
        experience = body.get('experience', [])

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        if not first_name or not last_name:
            return JsonResponse(
                {'error': 'First name and last name are required.'},
                status=400
            )

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')

        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        try:
            account = Account.objects.get(firebase_uid=firebase_uid)
            seeker_profile = account.seeker_profile

            if phone_number:
                phone_exists = Account.objects.filter(phone_number=phone_number).exclude(account_id=account.id).exists()
                if phone_exists:
                    return JsonResponse({'error': 'Phone number is already in use.'}, status=400)
                account.phone_number = phone_number
                account.save()

            seeker_profile.first_name = first_name
            seeker_profile.last_name = last_name
            seeker_profile.bio = bio or ''
            seeker_profile.skills = skills
            seeker_profile.experience = experience
            seeker_profile.profile_completed = True
            seeker_profile.anonymous_profile = build_anonymous_seeker_profile(seeker_profile)
            seeker_profile.save()

            return JsonResponse({'message': 'Seeker profile updated successfully.',
                                    'profile_completed': seeker_profile.profile_completed,
                                    'anonymous_profile': seeker_profile.anonymous_profile}, status=200)

        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account does not exist.'}, status=404)
        except seekerProfile.DoesNotExist:
            return JsonResponse({'error': 'Seeker profile does not exist.'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def onboarding_recruiter(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)

        id_token = body.get('idToken')
        first_name = body.get('firstName')
        last_name = body.get('lastName')
        company_name = body.get('companyName')
        location = body.get('location')
        company_website = body.get('companyWebsite')
        title = body.get('title')
        bio = body.get('bio')
        phone_number = body.get('phoneNumber')

        if company_name:
            company_name = company_name.strip().lower()

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        if not first_name or not last_name:
            return JsonResponse({'error': 'First name and last name are required.'}, status=400)

        if not company_name:
            return JsonResponse({'error': 'Company name is required.'}, status=400)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')

        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        try:
            account = Account.objects.get(firebase_uid=firebase_uid)

            if phone_number:
                phone_exists = Account.objects.filter(phone_number=phone_number).exclude(
                    account_id=account.account_id
                ).exists()

                if phone_exists:
                    return JsonResponse({'error': 'Phone number already in use.'}, status=400)

                account.phone_number = phone_number
                account.save()

            company_obj, company_created = companyProfile.objects.get_or_create(
                company_name=company_name,
                defaults={
                    'main_location': location or '',
                    'website': company_website or '',
                }
            )

            recruiter_profile, _ = recruiterProfile.objects.get_or_create(
                account=account,
                defaults={
                    'first_name': '',
                    'last_name': '',
                    'title': '',
                    'company': None,
                    'is_company_admin': False,
                    'profile_completed': False,
                },
            )

            recruiter_profile.first_name = first_name
            recruiter_profile.last_name = last_name
            recruiter_profile.title = title or ''
            recruiter_profile.company = company_obj
            recruiter_profile.profile_completed = True

            # Only keep this line if recruiterProfile model has a bio field
            if hasattr(recruiter_profile, 'bio'):
                recruiter_profile.bio = bio or ''

            recruiter_profile.save()

            return JsonResponse({
                'message': 'Recruiter profile updated successfully.',
                'profile_completed': recruiter_profile.profile_completed,
                'company_created': company_created,
                'company_id': company_obj.company_id,
                'company': {
                    'company_name': company_obj.company_name,
                    'main_location': company_obj.main_location,
                    'website': company_obj.website,
                }
            }, status=200)

        except Account.DoesNotExist:
            return JsonResponse({'error': 'Account does not exist.'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def upload_resume(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    id_token = request.POST.get('idToken')
    resume_file = request.FILES.get('resume')

    if not id_token:
        return JsonResponse({'error': 'idToken is missing.'}, status=400)

    if not resume_file:
        return JsonResponse({'error': 'Resume file is missing.'}, status=400)

    if not resume_file.name.lower().endswith(('.docx')):
        return JsonResponse({'error': 'Invalid file type. Only DOCX is allowed.'}, status=400)

    decoded_token = verify_firebase_token(id_token)
    if not decoded_token:
        return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

    firebase_uid = decoded_token.get('uid')
    if not firebase_uid:
        return JsonResponse({'error': 'User ID is missing.'}, status=400)

    try:
        account = Account.objects.get(firebase_uid=firebase_uid)
        seeker_profile = account.seeker_profile
        seeker_profile.resume_upload = resume_file
        seeker_profile.save()

        return JsonResponse({
            'message': 'Resume uploaded successfully.',
            'resume_name': seeker_profile.resume_upload.name,
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account does not exist.'}, status=404)
    except seekerProfile.DoesNotExist:
        return JsonResponse({'error': 'Seeker profile does not exist.'}, status=404)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def get_company_profile(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)

        if account.account_type != AccountType.RECRUITER:
            return JsonResponse({'error': 'Only recruiters can access company profile.'}, status=403)

        recruiter = account.recruiter_profile

        if not recruiter.company:
            return JsonResponse({'error': 'Recruiter has no company.'}, status=400)

        membership = companyMember.objects.filter(
            profile=recruiter,
            company=recruiter.company
        ).first()

        if not membership or membership.role not in [companyRole.OWNER, companyRole.ADMIN]:
            return JsonResponse({'error': 'You do not have permission to view this company profile.'}, status=403)

        company = recruiter.company

        return JsonResponse({
            'company': {
                'company_id': company.company_id,
                'company_name': company.company_name,
                'main_location': company.main_location,
                'about': company.about,
                'website': company.website,
                'company_size': company.company_size,
                'verification_status': company.verification_status,
            }
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account does not exist.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def update_company_profile(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)
        id_token = body.get('idToken')

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)

        if account.account_type != AccountType.RECRUITER:
            return JsonResponse({'error': 'Only recruiters can update company profile.'}, status=403)

        recruiter = account.recruiter_profile

        if not recruiter.company:
            return JsonResponse({'error': 'Recruiter has no company.'}, status=400)

        membership = companyMember.objects.filter(
            profile=recruiter,
            company=recruiter.company
        ).first()

        if not membership or membership.role not in [companyRole.OWNER, companyRole.ADMIN]:
            return JsonResponse({'error': 'You do not have permission to edit this company profile.'}, status=403)

        company = recruiter.company

        company.main_location = body.get('mainLocation', company.main_location)
        company.about = body.get('about', company.about)
        company.website = body.get('website', company.website)
        company.company_size = body.get('companySize', company.company_size)
        company.save()

        return JsonResponse({
            'message': 'Company profile updated successfully.',
            'company_id': company.company_id,
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account does not exist.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def confirm_company_ownership(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

    try:
        body = json.loads(request.body)

        id_token = body.get('idToken')
        company_id = body.get('companyId')
        requested_role = body.get('requestedRole')  # owner | admin | recruiter

        if not id_token:
            return JsonResponse({'error': 'idToken is missing.'}, status=400)

        if not company_id:
            return JsonResponse({'error': 'companyId is missing.'}, status=400)

        if requested_role not in [companyRole.OWNER, companyRole.ADMIN, companyRole.RECRUITER]:
            return JsonResponse({'error': 'requestedRole is invalid or missing.'}, status=400)

        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid Firebase token.'}, status=401)

        firebase_uid = decoded_token.get('uid')
        if not firebase_uid:
            return JsonResponse({'error': 'User ID is missing.'}, status=400)

        account = Account.objects.get(firebase_uid=firebase_uid)
        recruiter_profile = recruiterProfile.objects.get(account=account)
        company_obj = companyProfile.objects.get(company_id=company_id)

        membership, _ = companyMember.objects.get_or_create(
            profile=recruiter_profile,
            company=company_obj,
            defaults={
                'role': companyRole.RECRUITER,
            }
        )

        membership.role = requested_role
        membership.save()

        recruiter_profile.company = company_obj
        recruiter_profile.is_company_admin = requested_role in [companyRole.OWNER, companyRole.ADMIN]
        recruiter_profile.save()

        return JsonResponse({
            'message': 'Company membership updated successfully.',
            'company_id': company_obj.company_id,
            'role': membership.role,
            'is_company_admin': recruiter_profile.is_company_admin,
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account does not exist.'}, status=404)
    except recruiterProfile.DoesNotExist:
        return JsonResponse({'error': 'Recruiter profile does not exist.'}, status=404)
    except companyProfile.DoesNotExist:
        return JsonResponse({'error': 'Company does not exist.'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    