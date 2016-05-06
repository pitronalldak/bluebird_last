from __future__ import unicode_literals

from django.db import models
from model_utils import Choices
from my_auth.models import User


class PeManagerManager(models.Manager):
    def active(self):
        return self.get_queryset().filter(is_deleted=False)


class ReviewManager(models.Manager):
    def active(self):
        return self.get_queryset().filter(is_deleted=False)


class PeManager(models.Model):
    objects = PeManagerManager()

    INVESTEMENT_STRATEGY = Choices(
        'Buyout', 'Fund of Funds', 'Growth',
        'Hedge Fund', 'Infrastructure', 'Secondaries', 'Venture'
    )
    REGION = Choices(
        'Asia pacific', 'Europe', 'Middle East & Africa', 'North America', 'South America'
    )
    INDUSTRY_FOCUS = Choices(
        'Consumer & Retail', 'Generalist', 'Healthcare', 'Tehnology & Software'
    )

    name = models.CharField(max_length=100, unique=True)
    url = models.CharField(max_length=100)
    investment_strategy = models.CharField(
        max_length=100,
        choices=INVESTEMENT_STRATEGY,
        default=None
    )
    region = models.CharField(max_length=100, choices=REGION)
    country = models.CharField(max_length=100)
    industry_focus = models.CharField(
        max_length=100,
        choices=INDUSTRY_FOCUS,
        default=None
    )
    aum = models.BooleanField()
    rating = models.IntegerField(default=0)
    address = models.TextField()
    contact_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=100)
    fax = models.CharField(max_length=100)
    comments = models.TextField(default=None)
    is_deleted = models.BooleanField(default=False)
    is_verify = models.BooleanField(default=False)
    date_create = models.DateTimeField(auto_now_add=True)


class ReviewPeManager(models.Model):
    objects = ReviewManager()

    pemanager = models.ForeignKey(PeManager, related_name='reviews')
    user = models.ForeignKey(User)
    rating = models.DecimalField(default=0, max_digits=5, decimal_places=2)
    title = models.CharField(max_length=100)
    review = models.TextField()
    personal_experience = models.BooleanField()
    posted_info_user = models.BooleanField()
    thumbs = models.IntegerField(default=0)
    raport = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    is_verify = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)


class RaportReview(models.Model):
    review = models.ForeignKey(ReviewPeManager)
    user = models.ForeignKey(User)
    raport = models.TextField()
    considered = models.BooleanField(default=False)
    date_create = models.DateTimeField(auto_now_add=True)


class ThumbReview(models.Model):
    review = models.ForeignKey(ReviewPeManager)
    user = models.ForeignKey(User)
    thumb = models.BooleanField(default=False)
