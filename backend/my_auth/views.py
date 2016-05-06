import json
import requests

from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from django.conf import settings
from django.http import HttpResponseRedirect

from .serializers import UserSerializer
from models import User


class UserProfileView(APIView):
    def get(self, request, format=None):
        """
        Return a current_user profile
        """
        return Response(UserSerializer(request.user).data)


class MainUserView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        user_id = int(request.GET.get('id')[0])
        user = User.objects.get(id=user_id)
        return Response(UserSerializer(user).data)


class CreateUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        """
        Registration endpoint
        """
        json_data = json.loads(request.body)
        json_data['email'] = json_data['username']
        serializer = UserSerializer(data=json_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_or_update(json_data)
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            return Response({"token": token})


class UpdateUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        """
        Registration endpoint
        """
        json_data = json.loads(request.body)
        user = User.objects.get(id=json_data['id'])
        user.company = json_data['company']
        user.title = json_data['title']
        user.info = json_data['info']
        user.address = json_data['address']
        user.first_name = json_data['first_name']
        user.last_name = json_data['last_name']
        user.save()
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return Response({"token": token})


class CreateUserLinkedIn(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        Linkedin registration endpoint, we can't do it on frontend because of CORS
        """
        if request.GET.get('redirect') == 'true':
            return HttpResponseRedirect(settings.LINKEDIN_AUTH_URL)
        else:
            response = requests.post(
                url='https://www.linkedin.com/uas/oauth2/accessToken',
                headers={'Content-Type': 'application/x-www-form-urlencoded'},
                data={
                    'grant_type': 'authorization_code',
                    'code': request.GET.get('code'),
                    'redirect_uri':
                    '{0}/api/auth/linkedin/'.format(settings.BACKEND_URL),
                    'client_id': settings.LINKEDIN_CLIENT_ID,
                    'client_secret': settings.LINKEDIN_CLIENT_SECRET
                }
            )
            if response.ok:
                json_data = response.json()
                access_token = 'Bearer ' + json_data['access_token']
                r = requests.get(
                    'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,location,public-profile-url,email-address)?format=json',
                    headers={'Authorization': access_token})
                json_data = json.loads(r.text)
                json_data['password'] = ''
                json_data['address'] = json_data['location']['name']
                json_data['email'] = json_data['emailAddress']
                json_data['first_name'] = json_data['firstName']
                json_data['last_name'] = json_data['lastName']
                del json_data['id']
                serializer = UserSerializer(data=json_data, unique_key='email')
                user = serializer.create_or_update(json_data)
                jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                return HttpResponseRedirect('{0}/?jwtToken={1}'.format(settings.FRONTEND_URL, token))

