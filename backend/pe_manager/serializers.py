from models import PeManager, ReviewPeManager

from backend.serializers import ActiveModelSerializer
from my_auth.serializers import UserSerializer
from rest_framework import serializers


class ReviewTitleSerializer(ActiveModelSerializer):
    class Meta:
        model = ReviewPeManager
        fields = (
            'id', 'title', 'date_created'
        )


class PeManagerSerializer(ActiveModelSerializer):
    date_created = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    reviews = serializers.SerializerMethodField('get_items', read_only=True)
    count_reviews = serializers.SerializerMethodField('get_reviews_count', read_only=True)

    class Meta:
        model = PeManager
        fields = (
            'id', 'name', 'url', 'investment_strategy',
            'region', 'country', 'industry_focus',
            'aum', 'rating', 'address',
            'contact_name', 'email', 'phone',
            'fax', 'comments', 'is_verify', 'date_created', 'reviews', 'count_reviews'
        )

    def get_items(self, manager):
        items = ReviewPeManager.objects.active().filter(pemanager=manager)[:3]
        serializer = ReviewTitleSerializer(instance=items, many=True, read_only=True)
        return serializer.data

    def get_reviews_count(self, manager):
        return ReviewPeManager.objects.active().filter(pemanager=manager).count()


class PeManagerLiveSerializer(ActiveModelSerializer):
    value = serializers.IntegerField(source='id')
    label = serializers.CharField(source='name')

    class Meta:
        model = PeManager


class ReviewSerializer(ActiveModelSerializer):
    date_created = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    user = UserSerializer(read_only=True)
    pemanager = PeManagerSerializer(read_only=True)

    class Meta:
        model = ReviewPeManager
        fields = (
            'id', 'rating', 'title', 'review', 'user', 'pemanager',
            'personal_experience', 'posted_info_user', 'thumbs', 'raport',
            'is_verify', 'date_created'
        )
