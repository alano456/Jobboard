from django.contrib import admin
from .models import Category, Job, Application, EmployerRecommendation, Profile

admin.site.register(Category)
admin.site.register(Job)
admin.site.register(Application)
admin.site.register(EmployerRecommendation)
admin.site.register(Profile)