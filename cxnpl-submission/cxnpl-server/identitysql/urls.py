"""identitysql URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts.views import (
    GoogleLoginView,
    OktaLoginView,
    RegisterUserView,
    CreateCompanyView,
)
from rest_framework_simplejwt import views as jwt_views

import sys

sys.path.append(".")

from accounts.views import (
    UserInfo,
)

app_name = "accounts"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("user_info/<str:email>/", UserInfo.as_view(), name="user_info"),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/social/login/google/", GoogleLoginView.as_view(), name="google"),
    # api endpoints
    path("accounts/register", RegisterUserView.as_view(), name="register"),
    path("accounts/delete", RegisterUserView.as_view(), name="delete_user"),
    path("company/create", CreateCompanyView.as_view(), name="create_Company"),
    path("company/delete", CreateCompanyView.as_view(), name="delete_company"),
    path("company/<str:user_email>", CreateCompanyView.as_view(), name="view_company"),
    # get refreshtoken endpoint
    path(
        "api/token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path(
        "api/token-refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
]
