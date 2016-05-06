from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)


class UserManager(BaseUserManager):

    def active(self):
        return self.get_queryset().filter(is_active=True)


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    first_name = models.CharField(max_length=300, default=None, null=True, blank=True)
    last_name = models.CharField(max_length=300, default=None, null=True, blank=True)

    address = models.CharField(max_length=200, default=None, null=True, blank=True)
    company = models.CharField(max_length=100, default=None, null=True, blank=True)
    title = models.CharField(max_length=100, default=None, null=True, blank=True)
    info = models.TextField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
