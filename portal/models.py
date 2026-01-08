from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta, datetime
from django.utils import timezone
# --- Wybory (Choices) dla pól ---

GENDER_CHOICES = [
    ('M', 'Mężczyzna'),
    ('K', 'Kobieta'),
    ('N', 'Nie chcę podawać'),
]

JOB_TYPE_CHOICES = [
    ('stacjonarna', 'Stacjonarna'),
    ('hybrydowa', 'Hybrydowa'),
    ('zdalna', 'Zdalna'),
]
CONTRACT_TYPE_CHOICES = [
    ('uop', 'Umowa o pracę'),
    ('b2b', 'Kontrakt B2B'),
    ('zlecenie', 'Umowa zlecenie'),
    ('dzielo', 'Umowa o dzieło'),
    ('staz', 'Staż / Praktyka'),
]
EXPERIENCE_CHOICES = [
    ('none', 'Nie wymagane'),
    ('1-2', '1-2 lata'),
    ('3-5', '3-5 lat'),
    ('5+', '5+ lat'),
]
# --- Modele ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_employer = models.BooleanField(default=False)
    
    # --- Wspólne ---
    location = models.CharField(max_length=100, blank=True, verbose_name="Lokalizacja")
    phone_number = models.CharField(max_length=20, blank=True, verbose_name="Numer telefonu")
    website = models.URLField(blank=True, verbose_name="Strona internetowa")
    
    # --- Sekcja Użytkownika (Kandydata) ---
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True, verbose_name="Zdjęcie profilowe")
    cv = models.FileField(upload_to='resumes/', blank=True, null=True, verbose_name="CV")
    education = models.TextField(blank=True, verbose_name="Wykształcenie")
    experience_years = models.IntegerField(blank=True, null=True, verbose_name="Lata doświadczenia")
    github_link = models.URLField(blank=True, verbose_name="GitHub")
    linkedin_link = models.URLField(blank=True, verbose_name="LinkedIn")
    nationality = models.CharField(max_length=50, blank=True, verbose_name="Narodowość")
    birth_date = models.DateField(null=True, blank=True, verbose_name="Data urodzenia")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, verbose_name="Płeć")
    bio = models.TextField(blank=True, verbose_name="O sobie")
    marital_status = models.CharField(max_length=50, blank=True, verbose_name="Stan cywilny")

    # --- Sekcja Firmy (Pracodawcy) ---
    # Imię/Nazwisko/Email są w modelu User, ale tutaj dane typowo firmowe
    company_name = models.CharField(max_length=200, blank=True, verbose_name="Nazwa firmy")
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True, verbose_name="Logo firmy")
    company_banner = models.ImageField(upload_to='company_banners/', blank=True, null=True, verbose_name="Baner firmy")
    short_description = models.CharField(max_length=255, blank=True, verbose_name="Krótki opis firmy")
    company_type = models.CharField(max_length=100, blank=True, verbose_name="Typ firmy (np. Software House)")
    team_size = models.CharField(max_length=50, blank=True, verbose_name="Wielkość zespołu")
    founding_date = models.DateField(null=True, blank=True, verbose_name="Data założenia")
    detailed_description = models.TextField(blank=True, verbose_name="Szczegółowy opis działalności")
    work_culture = models.TextField(blank=True, verbose_name="Opis pracy w firmie")

    def __str__(self):
        type_str = "Pracodawca" if self.is_employer else "Kandydat"
        return f"{self.user.username} ({type_str})"
class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Job(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    # --- Dane podstawowe ---
    title = models.CharField(max_length=200, verbose_name="Stanowisko")
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='stacjonarna', verbose_name="Tryb pracy")
    experience_required = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='none', verbose_name="Wymagane doświadczenie")
    contract_type = models.CharField(max_length=50, choices=CONTRACT_TYPE_CHOICES, default='uop', verbose_name="Rodzaj umowy")
    location = models.CharField(max_length=200, blank=True, verbose_name="Lokalizacja")
    
    # --- Wynagrodzenie ---
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Wynagrodzenie Min")
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Wynagrodzenie Max")
    
    # --- Terminy ---
    start_date = models.DateField(null=True, blank=True, verbose_name="Start pracy")
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name="Ważne do")
    
    # --- Opisy ---
    description = models.TextField(verbose_name="Opis stanowiska")
    responsibilities = models.TextField(blank=True, verbose_name="Obowiązki")
    
    # --- Inne ---
    image = models.ImageField(upload_to='job_images/', null=True, blank=True)
    saved_by = models.ManyToManyField(User, related_name='saved_jobs', blank=True)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)

    def is_expired(self):
        return self.expires_at and timezone.now() > self.expires_at

    def get_salary_range(self):
        if self.salary_min and self.salary_max:
            return f"{self.salary_min} - {self.salary_max} PLN"
        elif self.salary_min:
            return f"Od {self.salary_min} PLN"
        return "Do negocjacji"

    def __str__(self):
        return self.title

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    cover_letter = models.TextField(blank=True)
    cv = models.FileField(upload_to='applications/cvs/', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=[('applied', 'Złożona'), ('reviewed', 'Przejrzana'), ('rejected', 'Odrzucona'), ('accepted', 'Zaakceptowana')], default='applied')
    def __str__(self):
        return f"Aplikacja {self.candidate.username} na {self.job.title}"

class EmployerRecommendation(models.Model):
    from_user = models.ForeignKey(User, related_name='given_recommendations', on_delete=models.CASCADE)
    employer = models.ForeignKey(User, related_name='received_recommendations', on_delete=models.CASCADE)
    is_positive = models.BooleanField(default=True)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    is_reported = models.BooleanField(default=False)
    class Meta:
        unique_together = ('from_user', 'employer')

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    text = models.TextField()
    image = models.ImageField(upload_to='chat_images/', blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return f"{self.sender} ➡ {self.receiver} ({self.job.title}): {self.text[:30]}"
    class Meta:
        ordering = ['created_at']


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()