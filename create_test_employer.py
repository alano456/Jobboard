import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ad_board.settings')
django.setup()

from django.contrib.auth.models import User
from portal.models import Profile

def create_employer():
    username = 'employer_demo'
    password = 'password123'
    email = 'employer@demo.com'

    if User.objects.filter(username=username).exists():
        print(f"User {username} already exists. resetting password.")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
    else:
        user = User.objects.create_user(username=username, email=email, password=password)
        print(f"User {username} created.")

    # Ensure profile exists and is employer
    profile, created = Profile.objects.get_or_create(user=user)
    profile.is_employer = True
    profile.company_name = "Demo Corp"
    profile.short_description = "We build the future."
    profile.save()
    print(f"Profile updated for {username}: is_employer={profile.is_employer}, company={profile.company_name}")

if __name__ == '__main__':
    create_employer()
