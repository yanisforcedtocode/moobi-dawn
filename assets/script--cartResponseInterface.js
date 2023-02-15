"use strict";
class CartResponseInterface {
    constructor(object) {
        this._originalTotalPrice = object.original_total_price;
        this._totalPrice = object.total_price;
        this._totalDiscount = object.total_discount;
        this._itemCount = object.item_count;
        this._items = object.items;
        this._itemSubtotalPrice = object.items_subtotal_price;
        this._cart_level_discount_applications = object.cart_level_discount_applications;
    }
    get originalTotalPrice() {
        return this._originalTotalPrice;
    }
    get totalPrice() {
        return this._totalPrice;
    }
    get totalDiscount() {
        return this._totalDiscount;
    }
    get itemCount() {
        return this._itemCount;
    }
    get items() {
        return this._items;
    }
    get itemSubtotalPrice() {
        return this._itemSubtotalPrice;
    }
    get cart_level_discount_applications() {
        return this._cart_level_discount_applications;
    }
}
