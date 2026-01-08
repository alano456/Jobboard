from rest_framework import serializers
from .models import Job, EmployerRecommendation, Application, Profile, Category, Message
from django.contrib.auth.models import User


# ==== USER ====

class UserSerializer(serializers.ModelSerializer):
    is_employer = serializers.BooleanField(source='profile.is_employer', read_only=True)
    company_name = serializers.CharField(source='profile.company_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_employer', 'company_name']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# ==== PROFILE ====

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'is_employer', 'company_name',
            'location', 'phone_number', 'website',
            'bio', 'github_link', 'linkedin_link', 
            'profile_picture', 'bg_color' # Assuming bg_color might be used later or if it exists in model but I will stick to model fields
        ] 
        # Checking model: location, phone_number, website, bio, github_link, linkedin_link, profile_picture are in model.
        # bg_color is NOT in model, remove it.

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'is_employer', 'company_name',
            'location', 'phone_number', 'website',
            'bio', 'github_link', 'linkedin_link', 
            'profile_picture', 'education', 'marital_status'
        ]


# === Category ===
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# === Job ===
class JobSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'created_at', 'expires_at',
            'category', 'user', 'image', 'salary_min', 'salary_max',
            'location', 'job_type', 'experience_required', 'is_saved'
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(id=request.user.id).exists()
        return False



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