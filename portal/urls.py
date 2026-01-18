from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views
from rest_framework import routers
from .views import CategoryViewSet, JobViewSet, ApplicationViewSet, UserViewSet, RegisterView, CustomAuthToken, NotificationViewSet, ProfileViewSet


router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'users', UserViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'profiles', ProfileViewSet, basename='profile')


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='api_register'),
    path('api/login/', CustomAuthToken.as_view(), name='api_login'),
]


#urlpatterns = [
#    path('', views.job_list, name='job_list'),
#    path('job/<int:job_id>/', views.job_detail, name='job_detail'),
#    path('job/create/', views.job_create, name='job_create'),
#    path('job/<int:job_id>/edit/', views.job_edit, name='job_edit'),
#    path('job/<int:job_id>/delete/', views.job_delete, name='job_delete'),
#    path('job/<int:job_id>/apply/', views.apply_to_job, name='apply_to_job'),
#    path('job/<int:job_id>/save/', views.toggle_saved, name='toggle_saved'),
#    path('saved-jobs/', views.saved_jobs_list, name='saved_jobs_list'),
#    path('contact/', views.contact, name='contact'),
#    path('register/', views.register, name='register'),
#    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
#    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
#    path('dashboard/', views.user_dashboard, name='user_dashboard'),
#    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
#    path('pracodawca/<int:user_id>/', views.employer_profile, name='employer_profile'),
#    path('pracodawca/<int:user_id>/dodaj-opinie/', views.add_recommendation, name='add_recommendation'),
#    path('admin-opinie/', views.admin_recommendations_panel, name='admin_recommendations'),
#    path('admin-opinie/usun/<int:rec_id>/', views.delete_recommendation, name='delete_recommendation'),
#    path('opinie/zglos/<int:rec_id>/', views.report_recommendation, name='report_recommendation'),
#    path('admin-opinie/export/', views.export_recommendations_csv, name='export_recommendations'),
#    path('inbox/<int:job_id>/<int:user_id>/', views.chat_view, name='chat'),
#    path('inbox/', views.inbox_view, name='inbox'),
#]

#from django.conf import settings
#from django.conf.urls.static import static
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)