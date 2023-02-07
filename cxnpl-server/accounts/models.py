from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, UserManager
from django.contrib.auth.models import Group, Permission, PermissionsMixin, GroupManager
from django.contrib.contenttypes.models import ContentType
from uuid import uuid4
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

# Company Manager to handle company creation
class CustomCompanyModelManager(models.Manager):
    def create_company(self, company_name, company_readable_id, owner=None):
        # if company_name not in AVAILABLE_COMPANIES:
        #     raise ValueError("Supported companies: CXNPL, TSLA, RIOT")
        if not company_name:
            raise ValueError("Enter a company name")

        company = self.model(
            company_readable_id=company_readable_id,
            company_name=company_name,
            owner=owner,
        )
        company.save(using=self._db)
        return company


# Database model for the companies.
class CustomCompanyModel(models.Model):

    company_id = models.UUIDField(default=uuid4, editable=False)
    company_readable_id = models.CharField(
        primary_key=True, max_length=20, blank=20, null=False
    )

    # A core company has these attributes,
    company_name = models.CharField(
        max_length=20,
        blank=False,
        null=False,
    )
    account_funds = models.CharField(max_length=20, default=1000)
    owner = models.CharField(max_length=50, default="anon", blank=False, null=False)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    objects = CustomCompanyModelManager()

    def __str__(self):
        return self.company_name

    class Meta:
        verbose_name = "Company"
        permissions = [
            ("change_company_name", "Can change the company name"),
            ("withdraw_funds", "Can withdraw funds from the company"),
            ("can_delete_company", "Can delete company"),
        ]


# For the purposes of this assignment, we use Django's built in user manager.
# This is customized to fit the customized user model below
class CustomUserModelManager(BaseUserManager):

    # objects = UserManager()

    def create_user(self, username, email, role="base_user", password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)

        # TO DO - Future:
        # if role == "base_user":
        #     user.user_permissions.set(
        #         [
        #             "can_view_company",
        #             "can_view_email_address",
        #             "can_view_custom_user",
        #         ]
        #     )

        if role == "company_admin":
            user.user_permissions.set(
                [
                    "can_view_company",
                    "can_view_email_address",
                    "can_change_email_address",
                    "can_view_custom_user",
                    "can_change_custom_user",
                ]
            )

        if role == "owner":
            user.is_superuser = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.admin = True
        user.save(using=self._db)
        return user


# User class which will encompass all users
class CustomUserModel(AbstractBaseUser, PermissionsMixin):

    ### Users will be grouped into the following three roles which have varying
    ### levels of permissions
    # 1. Owner =  Owner of the business - will have full set of permissions
    # relating to their business account and can create admins and other users
    # 2. Admin = Admin of the business - will have permissions such as: CRUD users
    # 3. User = Base user which will have core permissions such as view permissions

    ROLE_CHOICES = (
        ("owner", "owner"),
        ("company_admin", "company_admin"),
        ("user", "user"),
    )

    # Fields that our users will have,
    userId = models.CharField(
        max_length=50, default=uuid4, primary_key=True, editable=True
    )

    username = models.CharField(max_length=20, unique=True, null=False, default=False)
    email = models.EmailField(max_length=100, unique=True, null=False, blank=False)

    # Company cannot be null or blank as the system serves SME's for business users only
    company = models.ForeignKey(CustomCompanyModel, null=True, on_delete=models.CASCADE)
    role = models.CharField(max_length=13, choices=ROLE_CHOICES, blank=True, null=True)

    # For this project, each user will only have 1 role. This can be extended via
    # ManyToMany relationships between users and roles
    # role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_company_admin = models.BooleanField(default=False)  # a superuser

    # All users should be staff, however system managers and IT support are not staff
    # hence the option
    is_staff = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    # For future implementation - Placeholder for money
    funds = models.PositiveIntegerField(default=1000)

    # Password field is built into the AbstractBaseUser super class.
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]  #  Password is required by default.

    objects = CustomUserModelManager()

    class Meta:
        verbose_name = "Custom User"
