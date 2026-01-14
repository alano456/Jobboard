import requests

# 0. Register a new user
register_url = 'http://127.0.0.1:8000/api/register/'
new_email = f'test_user_{requests.utils.quote("new")}_999@example.com' 
# Using a somewhat unique email, or random
import random
rand_int = random.randint(1000, 9999)
new_email = f'api_test_{rand_int}@example.com'
password = 'password123'

reg_data = {
    'first_name': 'API',
    'last_name': 'Tester',
    'email': new_email,
    'password': password,
    'confirm_password': password,
    'is_employer': False
}
print(f"Registering {new_email}...")
res = requests.post(register_url, json=reg_data)
# 201 Created or 400 if exists
if res.status_code not in [201, 200]:
    print(f"Registration failed: {res.status_code} {res.text}")
    # Proceed to login anyway if it exists

# 1. Login
login_url = 'http://127.0.0.1:8000/api/login/'
creds = {
    'username': new_email,
    'password': password
}

print(f"Logging in with {creds['username']}...")
res = requests.post(login_url, json=creds)
if res.status_code != 200:
    print(f"Login failed: {res.status_code} {res.text}")
    exit(1)

data = res.json()
token = data['token']
user_id = data['user_id']
print(f"Login success. Token: {token}, User ID: {user_id}")

# 2. Get Profile ID
# Retrieve profile list or assume we can find it
# Since we don't have /api/profiles/me (custom endpoint might be useful), we list profiles.
# Wait, Settings.jsx fetches /users/me/ then /profiles/ and finds match.
headers = {'Authorization': f'Token {token}'}

# 3. Test PATCH /users/me/
users_me_url = 'http://127.0.0.1:8000/api/users/me/'
print(f"Patching User at {users_me_url}...")
user_patch = {'first_name': 'TestFirst', 'last_name': 'TestLast'}
res = requests.patch(users_me_url, json=user_patch, headers=headers)
print(f"User Patch Status: {res.status_code}")
print(res.text)

# 4. Find Profile
profiles_url = 'http://127.0.0.1:8000/api/profiles/'
res = requests.get(profiles_url, headers=headers)
profiles = res.json()
my_profile = next((p for p in profiles if p['user']['id'] == user_id), None)

if not my_profile:
    print("Profile not found for user.")
    exit(1)

profile_id = my_profile['id']
print(f"Found Profile ID: {profile_id}")

# 5. Test PATCH /profiles/<id>/ with new fields
profile_url = f'http://127.0.0.1:8000/api/profiles/{profile_id}/'
print(f"Patching Profile at {profile_url}...")
profile_patch = {
    'education': 'PhD in AI',
    'marital_status': 'Married'
}
res = requests.patch(profile_url, json=profile_patch, headers=headers)
print(f"Profile Patch Status: {res.status_code}")
print(res.text)

if res.status_code == 200:
    print("Backend verification SUCCESS")
else:
    print("Backend verification FAILED")
