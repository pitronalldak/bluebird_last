from django.contrib.auth import get_user_model

from backend.serializers import ActiveModelSerializer


class UserSerializer(ActiveModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'first_name', 'last_name', 'address', 'company', 'title', 'info',
            'is_admin', 'is_active'
        )

    def create_or_update(self, validated_data):
        def after_func(obj):
            if (validated_data.get('password')):
                obj.set_password(validated_data['password'])
        return super(UserSerializer, self).create_or_update(validated_data, after_func)
