import csv
from django.db.models import Q

from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.auth import get_user_model
from django.http import Http404

from pe_manager.models import PeManager, ReviewPeManager
from pe_manager.serializers import PeManagerSerializer, ReviewSerializer
from .permissions import IsAdminUser
from my_auth.serializers import UserSerializer


class AdminUserView(ListAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (IsAdminUser,)
    serializer_class = UserSerializer
    pagination_class = PageNumberPagination
    filter_backends = (OrderingFilter, SearchFilter)
    ordering_fields = ('id', 'email', 'last_name', 'first_name', 'is_admin')
    search_fields = ('id', 'email', 'last_name', 'first_name')

    def post(self, request, id, format=None):
        json_data = request.data
        serializer = UserSerializer(data=json_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create_or_update(json_data)
            return Response(UserSerializer(user).data)

    def delete(self, request, id, format=None):
        try:
            user = get_user_model().objects.active().get(pk=id)
        except get_user_model().DoesNotExist:
            raise Http404("User doesn't exist")
        user.is_active = False
        user.save()
        return Response(status=204)


class AdminPeManagerView(ListAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = PeManagerSerializer
    pagination_class = PageNumberPagination
    filter_backends = (OrderingFilter, SearchFilter)
    ordering_fields = (
        'id', 'name', 'url', 'investment_strategy',
        'region', 'country', 'industry_focus',
        'aum', 'rating', 'address',
        'contact_name', 'email', 'phone',
        'fax', 'comments', 'is_verify', 'date_create'
    )
    search_fields = ordering_fields

    def get_queryset(self):
        queryset = PeManager.objects.active()
        queryset
        is_verify = self.request.query_params.get('is_verify', None)
        if is_verify is not None:
            is_verify = is_verify == u'true'
            queryset = queryset.filter(is_verify=is_verify)

        return queryset

    def post(self, request, id, format=None):
        json_data = request.data
        serializer = PeManagerSerializer(data=json_data)
        if serializer.is_valid(raise_exception=True):
            pemanager = serializer.create_or_update(json_data)
            return Response(PeManagerSerializer(pemanager).data)

    def delete(self, request, id, format=None):
        try:
            pemanager = PeManager.objects.get(pk=id)
        except PeManager.DoesNotExist:
            raise Http404("PEmanager doens't exist")
        pemanager.is_deleted = True
        pemanager.save()
        return Response(status=204)


class CreatePeManagerFromFile(APIView):
    permission_classes = (IsAdminUser,)
    parser_classes = (FormParser, MultiPartParser)

    def get_rating(self, ratingSymbol):
        ratings = {
            u'\u272e\u272e\u272e\u272e\u272e': 5,
            u'\u272e\u272e\u272e\u272e\u2606': 4,
            u'\u272e\u272e\u272e\u2606\u2606': 3,
            u'\u272e\u272e\u2606\u2606\u2606': 2,
            u'\u272e\u2606\u2606\u2606\u2606': 1
        }
        try:
            rating = ratings[ratingSymbol]
        except KeyError:
            rating = 0
        return rating

    def post(self, request):
        file_obj = request.data['file']
        dataReader = csv.reader(file_obj, delimiter=',')
        lines = [row for row in dataReader][1:]
        success = True
        errors = []
        for row in lines:
            pe_manager = PeManager()
            if PeManager.objects.filter(name=row[0]).exists():
                pe_manager = PeManager.objects.get(name=row[0])
            try:
                pe_manager.name = row[0]
                pe_manager.url = row[1]
                pe_manager.investment_strategy = row[2]
                pe_manager.region = row[3]
                pe_manager.country = row[5]
                pe_manager.industry_focus = row[7]
                pe_manager.aum = row[8]
                pe_manager.rating = self.get_rating(row[11].decode('utf8'))
                pe_manager.address = row[17]
                pe_manager.contact_name = row[19]
                pe_manager.email = row[21]
                pe_manager.phone = row[23]
                pe_manager.fax = row[25]
                pe_manager.comments = row[27]
                pe_manager.is_verify = True
                pe_manager.save()
            except IndexError:
                errors.append(row)
                success = False
        return Response({'success': success, 'errors': errors})


class AdminReviewView(ListAPIView):
    queryset = ReviewPeManager.objects.active()
    permission_classes = (IsAdminUser,)
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination
    filter_backends = (OrderingFilter, SearchFilter)
    ordering_fields = (
        'id', 'pemanager', 'user', 'rating', 'title', 'review',
        'personal_experience', 'posted_info_user', 'thumbs',
        'raport', 'is_verify', 'date_create'
    )
    search_fields = (
        'rating', 'title', 'review',
        'personal_experience', 'posted_info_user', 'thumbs',
        'raport', 'is_verify', 'date_create'
    )

    def get_queryset(self):
        queryset = ReviewPeManager.objects.active()
        is_verify = self.request.query_params.get('is_verify', None)
        if is_verify is not None:
            is_verify = is_verify == u'true'
            queryset = queryset.filter(is_verify=is_verify)

        return queryset

    def post(self, request, id, format=None):
        json_data = request.data
        serializer = ReviewSerializer(data=json_data)
        if serializer.is_valid(raise_exception=True):
            review = serializer.create_or_update(json_data)
            return Response(ReviewSerializer(review).data)

    def delete(self, request, id, format=None):
        try:
            review = ReviewPeManager.objects.get(pk=id)
        except ReviewPeManager.DoesNotExist:
            raise Http404("Review doesn't exist")
        review.is_deleted = True
        review.save()
        return Response(status=204)
