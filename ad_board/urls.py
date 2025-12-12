from django.contrib import admin
from django.urls import path, include
from django.conf.urls import handler404, handler500
from portal import views as portal_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portal.urls')),
]

handler404 = portal_views.custom_404
handler500 = portal_views.custom_500