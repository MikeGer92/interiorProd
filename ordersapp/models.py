from django.conf import settings
from django.db import models


from mainapp.models import Product


class Order(models.Model):

    objects = None
    FORMING = 'FM'
    SENT_TO_PROCED = 'STP'
    PROCEDED = "PSD"
    PAID = 'PD'
    READY = 'RD'
    CANCEL = 'CNC'
    DELIVERED = 'DVD'

    STATUSES = (
        (FORMING, 'Формируется'),
        (SENT_TO_PROCED, 'Отпралено в обработку'),
        (PROCEDED, 'Обработано'),
        (PAID, 'Оплачено'),
        (READY, 'Готов к выдаче'),
        (CANCEL, 'Отменен'),
        (DELIVERED, 'Выдан'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, verbose_name='создан')
    update = models.DateTimeField(auto_now=True, verbose_name='обновлен')
    is_active = models.BooleanField(default=True)
    status = models.CharField(choices=STATUSES, default=FORMING, verbose_name='статус заказа', max_length=3)

    def get_summary(self):
        items = self.orderitems.select_related()
        return {
            'total_cost': sum(list(map(lambda x: x.quantity * x.product.price, items))),
            'total_quantity': sum(list(map(lambda x: x.quantity, items)))
        }

    def get_total_quantity(self):
        _items = self.orderitems.select_related()
        _totalquantity = sum(list(map(lambda x: x.quantity, _items)))
        return _totalquantity

    def get_total_cost(self):
        _items = self.orderitems.select_related()
        _totalcost = sum(list(map(lambda x: x.get_product_cost(), _items)))
        return _totalcost


    def delete(self):
        for item in self.orderitems.select_related():
            item.product.quantity = item.quantity
            item.product.save()

        self.is_active = False
        self.save()


class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='orderitems')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='продукт')
    quantity = models.SmallIntegerField(default=0, verbose_name='количество товара')

    def get_product_cost(self):
        return self.product.price * self.quantity

    @staticmethod
    def get_item(pk):
        return Order.objects.get(pk=pk)
