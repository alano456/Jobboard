from rest_framework import serializers
from .models import Job, EmployerRecommendation, Application, Profile, Category, Message
from django.contrib.auth.models import User


# ==== USER ====

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']


# ==== PROFILE ====

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    class Meta:
        model = Profile
        fields = ['id','user', 'is_employer', 'company_name']


# === Category ===
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# === Job ===
class JobSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'created_at', 'expires_at',
            'category', 'user', 'image', 'salary_min', 'salary_max',
            'location', 'job_type', 'experience_required'
        ]



# === Application ===
class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'candidate', 'cover_letter', 'cv', 'created_at', 'status']



# === Employer Recommendation ===
class EmployerRecommendationSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    employer = UserSerializer(read_only=True)

    class Meta:
        model = EmployerRecommendation
        fields = ['id', 'from_user', 'employer', 'is_positive', 'comment', 'created_at', 'is_reported']



# === Message ===
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'job', 'text', 'image', 'is_read', 'created_at']