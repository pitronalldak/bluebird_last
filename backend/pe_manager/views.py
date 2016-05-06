from django.http import Http404
from django.db.models import Q

from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter, SearchFilter

from rest_framework.permissions import AllowAny
from pe_manager.models import PeManager, ReviewPeManager, RaportReview, ThumbReview
from pe_manager.serializers import PeManagerSerializer, ReviewSerializer, PeManagerLiveSerializer


class MainPeManagerView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PeManagerSerializer
    pagination_class = PageNumberPagination
    filter_backends = (OrderingFilter, SearchFilter)
    ordering_fields = ('rating', 'date_create')
    filter_fields = (
        'rating', 'region', 'investment_strategy',
        'industry_focus', 'aum', 'id'
    )

    search_fields = ('country',)

    def get_queryset(self):
        queryset = PeManager.objects.active().filter(is_verify=True)
        for filter_field in self.filter_fields:
            value = self.request.query_params.get(filter_field, False)
            if value:
                value_list = value.split(',')
                queryset = queryset.filter(Q(**{'{0}__in'.format(filter_field): value_list}))

        return queryset.distinct()

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


class LivePeManagersView(ListAPIView):
    queryset = PeManager.objects.active().all()
    permission_classes = (AllowAny,)
    serializer_class = PeManagerLiveSerializer
    filter_backends = (SearchFilter, )
    search_fields = ('name',)


class PeManagerReviewView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination
    filter_backends = (OrderingFilter,)
    ordering_fields = ('rating', 'date_create')

    def get_queryset(self):
        queryset = ReviewPeManager.objects.active().filter(is_verify=True)
        return queryset.filter(pemanager__id=self.kwargs.get('id'))

    def post(self, request, id, format=None):
        json_data = request.data
        pemanager_id = json_data.pop('pemanager')
        json_data.pop('certify')
        json_data.pop('manager')
        pemanager = PeManager.objects.get(id=pemanager_id)
        review = ReviewPeManager.objects.create(
            pemanager=pemanager, user=request.user, **json_data)
        return Response(ReviewSerializer(review).data)


class UserReviewView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination
    filter_backends = (OrderingFilter,)
    ordering_fields = ('rating', 'date_create')

    def get_queryset(self):
        queryset = ReviewPeManager.objects.active().filter(is_verify=True)
        return queryset.filter(user__id=self.kwargs.get('id'))


class ReviewRaportView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, id, format=None):
        json_data = request.data
        review_id = json_data.pop('review')
        review = ReviewPeManager.objects.get(id=review_id)
        if not review.raport:
            review.raport = True
            review.save()
        RaportReview.objects.create(review=review, user=request.user, **json_data)
        return Response(status=204)


class ReviewThumbView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, id, format=None):
        json_data = request.data
        review = ReviewPeManager.objects.get(id=json_data)
        if not ThumbReview.objects.filter(review=review, user=request.user).exists():
            review.thumbs += 1
            review.save()
            ThumbReview.objects.create(review=review, user=request.user, thumb=True)
            return Response(status=204)
        else:
            return Response(status=406)
