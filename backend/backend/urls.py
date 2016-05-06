from django.conf.urls import url, include


urlpatterns = [
    url(r'^api/admin/', include('my_admin.urls', namespace='admin_urls')),
    url(r'^api/auth/', include('my_auth.urls', namespace='auth_urls')),
    url(r'^api/pe_manager/', include('pe_manager.urls', namespace='pe_manager_urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
