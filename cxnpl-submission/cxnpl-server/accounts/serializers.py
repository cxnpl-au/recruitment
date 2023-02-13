from rest_framework import serializers
from .models import CustomUserModel, CustomCompanyModel
from django.db import models
from django.core.exceptions import ValidationError


# TO DO - Future: All serializers
# Returns data to frontend on user creation to validate succesful user creation
class CustomUserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ["userId", "username", "email", "company", "password", "role"]

    def create(self, validated_data):
        user = CustomUserModel.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["company"],
            validated_data["password"],
            # validated_data["role"],
        )
        return user


# Returns company creation response
class CustomCompanyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomCompanyModel
        fields = [
            "company_name",
            "company_readable_id",
            "account_funds",
            "owner",
            "date_created",
            "updated_at",
        ]

    # Returns all users that belong to a company to the front end
    # This method is only accessible as an owner or company admin
    def get(self, validated_data):
        all_users = CustomUserModel.objects.all().filter(
            company_readable_id=validated_data["company_readable_id"]
        )
        return all_users

    def create(self, validated_data):
        company = CustomCompanyModel.objects.create_company(
            validated_data["company_name"],
            validated_data["company_readable_id"],
            validated_data["owner"],
        )
        user = CustomUserModel.objects.get(username=validated_data["owner"])
        # This should set a list of provided user permissions
        # However for the scope of this system, an owner is considered
        # a superuser
        user.is_superuser = True
        user.company = company
        user.role = "owner"
        user.save()
        return company


# Master user, owners, and admins create a user here.
class RegisterUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"})

    class Meta:
        model = CustomUserModel
        fields = ["email", "username", "company", "password", "password2", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def save(self):
        user = CustomUserModel(
            username=self.validated_data["username"],
            email=self.validated_data["email"],
            company=self.validated_data["company"],
            role=self.validated_data["role"],
        )
        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]
        if password != password2:
            raise ValidationError({"password": "Passwords must match."})
        user.set_password(password)
        user.save()
        return user
