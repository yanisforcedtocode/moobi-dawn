"use strict";
class CartResponseInterface {
    constructor(object) {
        this.originalTotalPrice = object.original_total_price;
        this.totalPrice = object.total_price;
        this.totalDiscount = object.total_discount;
        this.itemCount = object.item_count;
        this.items = object.items;
        this.itemSubtotalPrice = object.items_subtotal_price;
    }
    getOriginalTotalPrice() {
        return this.originalTotalPrice;
    }
    getTotalPrice() {
        return this.totalPrice;
    }
    getTotalDiscount() {
        return this.totalDiscount;
    }
    getItemCount() {
        return this.itemCount;
    }
    getItems() {
        return this.items;
    }
    getItemSubtotalPrice() {
        return this.itemSubtotalPrice;
    }
}
