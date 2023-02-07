from rest_framework_simplejwt.tokens import RefreshToken

"""
For authentication purposes. JWT token to 
"""

# TO DO - Future
# This utility function will periodically provide refresh tokens to the
# authenticated user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
