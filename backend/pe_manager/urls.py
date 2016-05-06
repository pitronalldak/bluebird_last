from django.conf.urls import url

from .views import (MainPeManagerView, PeManagerReviewView,
                    LivePeManagersView, UserReviewView, ReviewRaportView, ReviewThumbView)


urlpatterns = [
    url(r'^pe-managers/(?P<id>[0-9]+)?', MainPeManagerView.as_view()),
    url(r'^pe-managers-live/?', LivePeManagersView.as_view()),
    url(r'^review/(?P<id>[0-9]+)?', PeManagerReviewView.as_view()),
    url(r'^raport/(?P<id>[0-9]+)?', ReviewRaportView.as_view()),
    url(r'^thumb/(?P<id>[0-9]+)?', ReviewThumbView.as_view()),
    url(r'^user-review/(?P<id>[0-9]+)?', UserReviewView.as_view())
]
