from django.shortcuts import render, get_object_or_404, redirect
from .models import Job, Category, EmployerRecommendation, Message, Application, Profile
from .forms import JobForm, ContactForm, ApplicationForm, RecommendationForm, RegisterForm
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User, Group
from django.core.exceptions import PermissionDenied
from django.contrib import messages
from django.core.paginator import Paginator
from django.core.mail import send_mail
from django.db.models import Count, Q
from django.utils import timezone
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models.functions import TruncDate
from datetime import timedelta, date
import csv

def job_list(request):
    category_id = request.GET.get('category')
    query = request.GET.get('q')
    jobs = Job.objects.filter(expires_at__gt=timezone.now()).order_by('-created_at')
    categories = Category.objects.all()
    sort = request.GET.get('sort')
    if category_id:
        jobs = jobs.filter(category_id=category_id)
    if query:
        jobs = jobs.filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        )
    if sort == 'salary_asc':
        jobs = jobs.order_by('salary_min')
    elif sort == 'salary_desc':
        jobs = jobs.order_by('-salary_max')
    else:
        jobs = jobs.order_by('-created_at')
    paginator = Paginator(jobs, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'job_list.html', {
        'categories': categories,
        'page_obj': page_obj,
        'query': query,
        'sort': sort
    })

def job_detail(request, job_id):
    job = get_object_or_404(Job, pk=job_id)
    can_apply = request.user.is_authenticated and request.user != job.user and not Application.objects.filter(job=job, candidate=request.user).exists()
    applications = Application.objects.filter(job=job) if request.user == job.user else []
    return render(request, 'job_detail.html', {'job': job, 'can_apply': can_apply, 'applications': applications})

@login_required
def job_create(request):
    if not request.user.profile.is_employer:
        messages.error(request, "Tylko pracodawcy mogą dodawać oferty.")
        return redirect('job_list')
    if request.method == 'POST':
        form = JobForm(request.POST, request.FILES)
        if form.is_valid():
            job = form.save(commit=False)
            job.user = request.user
            job.save()
            messages.success(request, "Oferta pracy została dodana!")
            send_mail(
                subject="Dodano nową ofertę pracy",
                message=f"Twoja oferta \"{job.title}\" została opublikowana.",
                from_email=None,
                recipient_list=[request.user.email],
                fail_silently=True,
            )
            return redirect('job_detail', job_id=job.id)
    else:
        form = JobForm()
    return render(request, 'job_form.html', {'form': form})

@login_required
def job_edit(request, job_id):
    job = get_object_or_404(Job, pk=job_id)
    if job.user != request.user or not request.user.profile.is_employer:
        raise PermissionDenied
    if request.method == 'POST':
        form = JobForm(request.POST, request.FILES, instance=job)
        if form.is_valid():
            form.save()
            messages.success(request, "Oferta pracy została zaktualizowana!")
            return redirect('job_detail', job_id=job.id)
    else:
        form = JobForm(instance=job)
    return render(request, 'job_form.html', {'form': form})

@login_required
def job_delete(request, job_id):
    job = get_object_or_404(Job, pk=job_id)
    if job.user != request.user or not request.user.profile.is_employer:
        raise PermissionDenied
    if request.method == 'POST':
        job.delete()
        messages.success(request, "Oferta pracy została usunięta.")
        return redirect('job_list')
    return render(request, 'job_confirm_delete.html', {'job': job})

@login_required
def apply_to_job(request, job_id):
    job = get_object_or_404(Job, pk=job_id)
    if request.user == job.user:
        messages.error(request, "Nie możesz aplikować na własną ofertę.")
        return redirect('job_detail', job_id=job.id)
    if Application.objects.filter(job=job, candidate=request.user).exists():
        messages.info(request, "Już aplikowałeś na tę ofertę.")
        return redirect('job_detail', job_id=job.id)
    if request.method == 'POST':
        form = ApplicationForm(request.POST, request.FILES)
        if form.is_valid():
            application = form.save(commit=False)
            application.job = job
            application.candidate = request.user
            application.save()
            messages.success(request, "Aplikacja wysłana! Pracodawca zostanie powiadomiony.")
            send_mail(
                subject=f"Nowa aplikacja na ofertę: {job.title}",
                message=f"Kandydat {request.user.username} aplikował na Twoją ofertę.",
                from_email=None,
                recipient_list=[job.user.email],
                fail_silently=True,
            )
            return redirect('job_detail', job_id=job.id)
    else:
        form = ApplicationForm()
    return render(request, 'apply_form.html', {'form': form, 'job': job})

@login_required
def toggle_saved(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    if request.user in job.saved_by.all():
        job.saved_by.remove(request.user)
        messages.info(request, "Usunięto z zapisanych.")
    else:
        job.saved_by.add(request.user)
        messages.success(request, "Dodano do zapisanych ofert!")
    return redirect('job_detail', job_id=job_id)

@login_required
def saved_jobs_list(request):
    jobs = request.user.saved_jobs.all()
    return render(request, 'saved_jobs_list.html', {'jobs': jobs})

@login_required
def user_dashboard(request):
    profile = request.user.profile
    if profile.is_employer:
        user_jobs = Job.objects.filter(user=request.user).order_by('-created_at')
        applications = Application.objects.filter(job__user=request.user)
        recent_recommendations = EmployerRecommendation.objects.filter(employer=request.user).order_by('-created_at')[:3]
        context = {
            'user_jobs': user_jobs,
            'applications': applications,
            'is_employer': True,
            'recent_recommendations': recent_recommendations,
        }
    else:
        saved = request.user.saved_jobs.all()
        applications = Application.objects.filter(candidate=request.user)
        recent_recommendations = EmployerRecommendation.objects.filter(employer=request.user).order_by('-created_at')[:3]
        context = {
            'saved': saved,
            'applications': applications,
            'is_employer': False,
            'recent_recommendations': recent_recommendations,
        }
    recent_messages = Message.objects.filter(receiver=request.user).order_by('-created_at')[:5]
    context.update({'recent_messages': recent_messages})
    return render(request, 'dashboard.html', context)

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.email = form.cleaned_data['email']
            user.username = user.username.lower()
            user.save()

            profile = user.profile
            profile.is_employer = form.cleaned_data.get('is_employer', False)
            if profile.is_employer:
                profile.company_name = form.cleaned_data.get('company_name', '')
            profile.save()

            login(request, user)
            messages.success(request, "Rejestracja udana! Zalogowano.")
            return redirect('job_list')
        else:
            pass
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            messages.success(request, "Dziękujemy za kontakt! Odpowiemy wkrótce.")
            return redirect('contact')
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form})

def custom_404(request, exception):
    return render(request, 'errors/404.html', status=404)

def custom_500(request):
    return render(request, 'errors/500.html', status=500)

def employer_profile(request, user_id):
    employer = get_object_or_404(User, id=user_id)
    if not employer.profile.is_employer:
        raise PermissionDenied("To nie jest profil pracodawcy.")
    jobs = Job.objects.filter(user=employer)
    recommendations = EmployerRecommendation.objects.filter(employer=employer)
    can_recommend = request.user.is_authenticated and request.user != employer and not recommendations.filter(from_user=request.user).exists()
    stats = {
        'total_jobs': jobs.count(),
        'active_jobs': jobs.filter(expires_at__gt=timezone.now()).count(),
        'positive_recommendations': recommendations.filter(is_positive=True).count(),
        'negative_recommendations': recommendations.filter(is_positive=False).count(),
    }
    return render(request, 'employer_profile.html', {
        'profile_user': employer,
        'jobs': jobs,
        'recommendations': recommendations,
        'can_recommend': can_recommend,
        'stats': stats,
    })

@login_required
def add_recommendation(request, employer_id):
    employer = get_object_or_404(User, id=employer_id)
    if employer == request.user or not employer.profile.is_employer:
        messages.error(request, "Nie możesz ocenić tego użytkownika.")
        return redirect('employer_profile', user_id=employer_id)
    if request.method == 'POST':
        form = RecommendationForm(request.POST)
        if form.is_valid():
            try:
                EmployerRecommendation.objects.create(from_user=request.user, employer=employer, **form.cleaned_data)
                messages.success(request, "Opinia dodana!")
            except:
                messages.error(request, "Już dodałeś opinię o tym pracodawcy.")
            return redirect('employer_profile', user_id=employer.id)
    else:
        form = RecommendationForm()
    return render(request, 'recommendation_form.html', {
        'form': form,
        'profile_user': employer,
        'is_update': False
    })


@staff_member_required
def admin_recommendations_panel(request):
    recs = EmployerRecommendation.objects.select_related('from_user', 'employer').order_by('-created_at')
    query = request.GET.get('query')
    opinion_type = request.GET.get('type')
    if query:
        recs = recs.filter(comment__icontains=query)
    if opinion_type == 'positive':
        recs = recs.filter(is_positive=True)
    elif opinion_type == 'negative':
        recs = recs.filter(is_positive=False)
    last_week = date.today() - timedelta(days=6)
    daily_stats = (
        EmployerRecommendation.objects.filter(created_at__date__gte=last_week)
        .annotate(day=TruncDate('created_at'))
        .values('day')
        .annotate(count=Count('id'))
        .order_by('day')
    )
    return render(request, 'admin_recommendations.html', {
        'recommendations': recs,
        'daily_stats': daily_stats,
    })

@staff_member_required
def delete_recommendation(request, rec_id):
    rec = get_object_or_404(EmployerRecommendation, id=rec_id)
    rec.delete()
    messages.success(request, "Opinia została usunięta.")
    return redirect('admin_recommendations')

@login_required
def report_recommendation(request, rec_id):
    rec = get_object_or_404(EmployerRecommendation, id=rec_id)
    rec.is_reported = True
    rec.save()
    messages.warning(request, "Zgłoszono opinię do moderatora.")
    return redirect('employer_profile', user_id=rec.employer.id)

@staff_member_required
def export_recommendations_csv(request):
    recs = EmployerRecommendation.objects.select_related('from_user', 'employer').all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="opinie.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Od', 'Dla', 'Typ', 'Komentarz', 'Data', 'Zgłoszona'])
    for r in recs:
        writer.writerow([
            r.id,
            r.from_user.username,
            r.employer.username,
            'Polecenie' if r.is_positive else 'Niepolecenie',
            r.comment,
            r.created_at.strftime("%Y-%m-%d %H:%M"),
            'TAK' if r.is_reported else ''
        ])
    return response

@login_required
def chat_view(request, job_id, user_id):
    job = get_object_or_404(Job, id=job_id)
    contact_user = get_object_or_404(User, id=user_id)
    chat_messages = Message.objects.filter(
        job=job,
        sender__in=[request.user, contact_user],
        receiver__in=[request.user, contact_user]
    ).order_by('created_at')
    chat_messages.filter(receiver=request.user, is_read=False).update(is_read=True)
    if request.method == 'POST':
        text = request.POST.get('text')
        image = request.FILES.get('image')
        if text or image:
            Message.objects.create(
                sender=request.user,
                receiver=contact_user,
                job=job,
                text=text or "",
                image=image
            )
            return redirect('chat', job_id=job.id, user_id=contact_user.id)
    return render(request, 'chat.html', {
        'job': job,
        'contact_user': contact_user,
        'chat_messages': chat_messages
    })

@login_required
def inbox_view(request):
    conversations = []
    messages_qs = Message.objects.filter(sender=request.user) | Message.objects.filter(receiver=request.user)
    messages = messages_qs.select_related('job', 'sender', 'receiver').order_by('-created_at')
    convo_map = {}
    for msg in messages:
        contact = msg.receiver if msg.sender == request.user else msg.sender
        key = (msg.job.id, contact.id)
        if key not in convo_map:
            convo_map[key] = {
                'job': msg.job,
                'contact': contact,
                'last_message': msg,
                'has_unread': msg.receiver == request.user and not msg.is_read,
            }
    conversations = list(convo_map.values())
    return render(request, 'inbox.html', {'conversations': conversations})

@staff_member_required
def admin_dashboard(request):
    total_jobs = Job.objects.count()
    active_jobs = Job.objects.filter(expires_at__gt=timezone.now()).count()
    expired_jobs = Job.objects.filter(expires_at__lt=timezone.now()).count()
    applications_count = Application.objects.count()
    users_count = User.objects.count()
    categories_count = Category.objects.count()
    return render(request, 'admin_dashboard.html', {
        'total_jobs': total_jobs,
        'active_jobs': active_jobs,
        'expired_jobs': expired_jobs,
        'applications_count': applications_count,
        'users_count': users_count,
        'categories_count': categories_count,
    })