window.onload = function () {
    let _quantity, _price, orderitem_num, delta_quantity, orderitem_quntity, delta_cost;
    let  quantity_arr = [],
         price_arr = [],
         total_forms = parseInt($('input[name=orderitems-TOTAL_FORMS]').val()),
         order_total_quantity = parseInt($('.order_total_quantity').text()) || 0,
         order_total_price = parseFloat($('.order_total_cost').text()) || 0;
    for (let i=0; i < total_forms; i++){
        _quantity = parseInt($('input[name=orderitems-' + i + '-quantity]').val());
        _price = parseFloat($('.orderitems-' + i + '-price').text().replace(',' , '.'));

        quantity_arr[i] = _quantity;
        if(_price){
            price_arr[i] = _price;
        } else {
           price_arr[i] = 0;
        }
    }

    $('.order_form').on('click', 'input[type=number]', function(){
        let target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-quantity'));
        if(price_arr[orderitem_num]){
            orderitem_quntity = parseInt(target.value);
            delta_quantity = orderitem_quntity - quantity_arr[orderitem_num];
            quantity_arr[orderitem_num] = orderitem_quntity;
            orderSummaryRecalc();
        }else {
            orderitem_quntity = 0;
        }
    });

        $('.order_form').on('click', 'input[type=checkbox]', function(){
        let target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-DELETE'));
        if(target.checked){
            delta_quantity = -quantity_arr[orderitem_num];

        }else {
            delta_quantity = quantity_arr[orderitem_num];
        }
        console.log(price_arr[orderitem_num])
        orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
    });

$('.order_form select').change(function (event) {
        let target = event.target;
        let orderitem_num = parseInt(target.name.replace('orderitems-', '').replace(
            '-product', ''));
        let orderitem_product_pk = target.options[target.selectedIndex].value;
            if(orderitem_product_pk > 0){
                orderitem_product_pk = orderitem_product_pk
            }else {
                orderitem_product_pk = '';
            }


        if (orderitem_product_pk) {
            $.ajax({
                url: "/order/product/" + orderitem_product_pk + "/price/",
                success: function (data) {
                    if (data.price) {
                        price_arr[orderitem_num] = parseFloat(data.price);
                        if (isNaN(quantity_arr[orderitem_num])) {
                            quantity_arr[orderitem_num] = 0;
                            price_arr[orderitem_num] = 0;
                        }

                        let price_html = '<span class="orderitems-"' + 'orderitem_num'+ '-price">'+ data.price.toString().replace('.', ',') + '</span> руб';
                        let cur_tr = $('.order_form table').find('tr:eq(' + (orderitem_num + 1) + ')');
                        cur_tr.find('td:eq(2)').html(price_html);
                        orderSummaryRecalc();
                    }
                }
           });
        }else{
            let cur_tr = $('.order_form table').find('tr:eq(' + (orderitem_num + 1) + ')');
            let price_html = '';
            quantity_arr[orderitem_num] = 0;
            price_arr[orderitem_num] = 0;
            cur_tr.find('td:eq(2)').html(price_html);
            orderSummaryRecalc();
       }
   });


    function orderSummaryUpdate(orderitem_price, delta_quantity){
        delta_cost = orderitem_price * delta_quantity;
        order_total_price = Number((order_total_price + delta_cost).toFixed(2));
        order_total_quantity = order_total_quantity + delta_quantity;


        $('.order_total_quantity').text(order_total_quantity.toString());
        $('.order_total_cost').text(order_total_price.toString());
    }
    function orderSummaryRecalc() {
        order_total_quantity = 0;
        order_total_cost = 0;

        for (let i = 0; i < total_forms; i++) {
            order_total_quantity += quantity_arr[i];
            order_total_cost += price_arr[i] * quantity_arr[i];
        }
        $('.order_total_quantity').html(order_total_quantity.toString());
        $('.order_total_cost').html(order_total_cost.toFixed(2).toString());
    }

    $('.formset_row').formset({
       addText: 'добавить продукт',
       deleteText: 'удалить',
       prefix: 'orderitems',
       removed: deleteOrderItem
    });
    function deleteOrderItem(row) {
       let target_name = row[0].querySelector('input[type="number"]').name;
       orderitem_num = parseInt(target_name.replace('orderitems-', '').replace('-quantity', ''));
       delta_quantity = -quantity_arr[orderitem_num];
       orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
    }


};