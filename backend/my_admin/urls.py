from django.conf.urls import url

from .views import AdminUserView, CreatePeManagerFromFile, AdminPeManagerView, AdminReviewView


urlpatterns = [
    url(r'^users/(?P<id>[0-9]+)?', AdminUserView.as_view()),
    url(r'^pe-managers/add-file/', CreatePeManagerFromFile.as_view()),
    url(r'^pe-managers/(?P<id>[0-9]+)?', AdminPeManagerView.as_view()),
    url(r'^reviews/(?P<id>[0-9]+)?', AdminReviewView.as_view())
]
