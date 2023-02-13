from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.okta.views import OktaOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf import settings
from .models import CustomUserModel
from accounts.serializers import (
    RegisterUserSerializer,
    CustomCompanyModelSerializer,
)
from django.http import JsonResponse
from accounts.models import CustomCompanyModel
from django.contrib.auth.decorators import permission_required

from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.http import QueryDict
import json


# def login_view(request):
#     if request.method == "POST":
#         form = AuthenticationForm(data=request.POST)
#         if form.is_valid():
#             user = form.get_user()
#             login(request, user)
#             return redirect("index")
#     else:
#         form = AuthenticationForm()
#     return render(request, "login.html", {"form": form})


# View for google sign in -> General purpose sign in,
class GoogleLoginView(SocialLoginView):
    authentication_classes = []
    adapter_class = GoogleOAuth2Adapter
    callback_url = (
        # "http://127.0.0.1:3000/api/auth/callback/google"  # To be changed in prod
        "https://cxnpl-server-production.up.railway.app/api/social/login/google/"
    )
    client_class = OAuth2Client


# View for Okta login -< More likely to be used for professional services than
# Facebook authentication. This can be implemented as a future add-on
class OktaLoginView(SocialLoginView):
    # authentication_classes = []
    adapter_class = OktaOAuth2Adapter
    # callback_url = "http://localhost:3000"  # To be changed in prod
    client_class = OAuth2Client


# View returns the logged in users information, including attributes and user permissions.
class UserInfo(APIView):
    def get(self, request, email):

        try:
            user = CustomUserModel.objects.get(email=email)
            user_permissions = user.get_all_permissions()  ## set of permissions
        except CustomUserModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = {
            "username": str(user.username),
            "email": str(user.email),
            "role": str(user.role),
            "is_company_admin": str(user.is_company_admin)
            if not user.is_anonymous
            else False,
            "company": str(user.company) if not user.is_anonymous else False,
            "user_permissions": list(user_permissions),
        }
        return JsonResponse(data)


# Creates and deletes a user -
class RegisterUserView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        data = json.loads(request.body)
        username = data["user"]
        try:
            user = CustomUserModel.objects.filter(username=username)
            user.delete()
        except CustomUserModel.DoesNotExist:
            return Response("User does not exist", status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


# GET and POST methods for companies.
# Handles logic to get company information based on a users company and allows
# master users to create a company
class CreateCompanyView(APIView):
    def get(self, request, user_email):

        user = CustomUserModel.objects.get(email=user_email)
        company = None
        company_name = user.company
        if company_name:
            company = CustomCompanyModel.objects.get(company_name=company_name)
            all_users = CustomUserModel.objects.filter(
                company=company.company_readable_id,
            )
            out = []
            for user in all_users:
                out.append(user.username)
        data = {
            "company_readable_id": company.company_readable_id
            if company
            else "No Company",
            "company_name": company.company_name if company else "No Company",
            "account_funds": company.account_funds if company else "No Company",
            "company_owner": company.owner if company else "No Company",
            "all_users": out if company else "No Company",
        }
        return Response(data, status=status.HTTP_201_CREATED)

    def post(self, request):
        serializer = CustomCompanyModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Only the owner of a company has permissions to delete a company
    # View based permissions are authorized via Python decorators which define a specific permission
    # needed to call the intended API
    @permission_required(
        "accounts.can_delete_company", raise_exception=False, login_url="/api/auth/"
    )
    def delete(self, request):
        company = CustomCompanyModel.objects.filter(
            company_name=request.POST.get("company_id", "None")
        )
        company.delete()
        return Response(status=status.HTTP_200_OK)

    # TO DO - Future task
    # Withdraw funds from a company bank account
    # Custom view based permission is provided on creation of user
    @permission_required("accounts.withdraw_funds")
    def put(self, request):
        company = CustomCompanyModel.objects.filter(
            company_name=request.POST.get("company_id", "None")
        )
        company.account_funds -= request.POST.get("withdrawal_amount", "None")
