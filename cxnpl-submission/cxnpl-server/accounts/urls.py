from django.urls import path, include
from .views import GoogleLoginView

# URL patterns for authorisation.
urlpatterns = [
    path("google/", GoogleLoginView.as_view(), name="google"),
]
