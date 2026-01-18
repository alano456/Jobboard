import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ad_board.settings')
django.setup()
from django.contrib.auth.models import User

try:
    u = User.objects.get(username='employer_demo')
    print(f"User: {u.username}")
    print(f"Has profile: {hasattr(u, 'profile')}")
    if hasattr(u, 'profile'):
        print(f"Is Employer: {u.profile.is_employer}")
        print(f"Company: {u.profile.company_name}")
except User.DoesNotExist:
    print("User not found")
