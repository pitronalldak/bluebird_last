from rest_framework.serializers import ModelSerializer
from rest_framework.fields import empty


class ActiveModelSerializer(ModelSerializer):
    exclude_save_fields = ('id', )

    def __init__(self, instance=None, data=empty, unique_key='id', **kwargs):
        super(ActiveModelSerializer, self).__init__(instance, data, **kwargs)
        ModelClass = self.Meta.model
        if data is not empty and data.get(unique_key):
            try:
                self.instance = ModelClass\
                    .objects.active().get(**{unique_key: data.get(unique_key)})
            except ModelClass.DoesNotExist:
                self.instance = None

    def create_or_update(self, validated_data, after_func=None):
        obj = self.Meta.model()
        if self.instance:
            obj = self.instance
        for field in self.Meta.fields:
            if field not in self.exclude_save_fields:
                value = validated_data.get(field, getattr(obj, field, None))
                setattr(obj, field, value)

        if after_func:
            after_func(obj)
        obj.save()
        return obj
