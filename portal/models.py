from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta, datetime
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_employer = models.BooleanField(default=False)
    company_name = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Profil {self.user.username}"

class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='job_images/', null=True, blank=True)
    saved_by = models.ManyToManyField(User, related_name='saved_jobs', blank=True)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    job_type = models.CharField(max_length=50, choices=[('full-time', 'Full-time'), ('part-time', 'Part-time'), ('remote', 'Remote'), ('contract', 'Kontrakt')], default='full-time')
    experience_required = models.CharField(max_length=50, choices=[('junior', 'Junior'), ('mid', 'Mid'), ('senior', 'Senior')], default='junior')
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