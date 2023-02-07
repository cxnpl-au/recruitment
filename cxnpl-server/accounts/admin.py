from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms
from .models import CustomUserModel, CustomUserModelManager, CustomCompanyModel


class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "company", "is_company_admin"]


admin.site.register(CustomUserModel, UserAdmin)


class CompanyAdmin(admin.ModelAdmin):
    list_display = [
        "company_id",
        "company_name",
        "account_funds",
        "owner",
        "date_created",
        "updated_at",
    ]


admin.site.register(CustomCompanyModel, CompanyAdmin)
