from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Job, EmployerRecommendation, Application

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True, label="Email")
    is_employer = forms.BooleanField(required=False, label="Jestem pracodawcą")
    company_name = forms.CharField(max_length=200, required=False, label="Nazwa firmy (jeśli pracodawca)")

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'is_employer', 'company_name']

class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['title', 'description', 'category', 'image', 'salary_min', 'salary_max', 'location', 'job_type', 'experience_required','contract_type', 'start_date', 'responsibilities']
        labels = {
            'title': 'Tytuł oferty',
            'description': 'Opis stanowiska',
            'category': 'Kategoria (branża)',
            'image': 'Logo firmy lub zdjęcie',
            'salary_min': 'Minimalna pensja (PLN)',
            'salary_max': 'Maksymalna pensja (PLN)',
            'location': 'Lokalizacja',
            'job_type': 'Typ pracy',
            'experience_required': 'Poziom doświadczenia',
        }
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 5}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'salary_min': forms.NumberInput(attrs={'class': 'form-control'}),
            'salary_max': forms.NumberInput(attrs={'class': 'form-control'}),
            'location': forms.TextInput(attrs={'class': 'form-control'}),
            'job_type': forms.Select(attrs={'class': 'form-select'}),
            'experience_required': forms.Select(attrs={'class': 'form-select'}),
        }

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)

class ApplicationForm(forms.ModelForm):
    class Meta:
        model = Application
        fields = ['cover_letter', 'cv']
        labels = {
            'cover_letter': 'List motywacyjny',
            'cv': 'CV (PDF/DOC)',
        }
        widgets = {
            'cover_letter': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'cv': forms.FileInput(attrs={'class': 'form-control', 'accept': '.pdf,.doc,.docx'}),
        }

class RecommendationForm(forms.ModelForm):
    class Meta:
        model = EmployerRecommendation
        fields = ['is_positive', 'comment']
        labels = {
            'is_positive': 'Polecam pracodawcę?',
            'comment': 'Komentarz',
        }
        widgets = {
            'is_positive': forms.CheckboxInput(attrs={'checked': True}),
            'comment': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }