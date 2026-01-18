from django.contrib import admin
from django.urls import path, include
from django.conf.urls import handler404, handler500
from portal import views as portal_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portal.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = portal_views.custom_404
handler500 = portal_views.custom_500