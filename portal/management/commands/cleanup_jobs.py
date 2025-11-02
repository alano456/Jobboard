from django.core.management.base import BaseCommand
from portal.models import Job
from django.utils import timezone

class Command(BaseCommand):
    help = 'Usuwa oferty pracy, które wygasły'
    def handle(self, *args, **kwargs):
        expired_jobs = Job.objects.filter(expires_at__lt=timezone.now())
        count = expired_jobs.count()
        expired_jobs.delete()
        self.stdout.write(self.style.SUCCESS(f'Usunięto {count} wygasłych ofert pracy.'))