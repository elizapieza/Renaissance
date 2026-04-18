from django.contrib import admin
from .models import Account, seekerProfile, recruiterProfile, companyProfile

admin.site.register(Account)
admin.site.register(seekerProfile)
admin.site.register(recruiterProfile)
admin.site.register(companyProfile)