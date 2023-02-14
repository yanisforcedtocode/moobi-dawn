"use strict";
// if the line-item name matches => disable quantity input and quantity buttons, 
// plus a color change
// if quantity > 1 => change to 1
class CartDiscountController {
    constructor(producdTitle) {
        this.productTitle = producdTitle;
        this.quantity__inputs = document.querySelectorAll('.quantity__input');
        this.buttonClass = "quantity__button";
        this.initDiscountItem();
    }
    initDiscountItem() {
        if (!this.checkLineItemLength(this.quantity__inputs)) {
            return;
        }
        this.quantity__inputs.forEach((el) => {
            if (this.checkProductTitle(el)) {
                this.matchingProductHandler(el);
            }
        });
    }
    matchingProductHandler(el) {
        this.changeElmBackground(el);
        const parent = el.parentElement;
        const buttons = parent.querySelectorAll(`.${this.buttonClass}`);
        buttons.forEach((el_1) => {
            this.disableElement(el_1);
            this.changeElmBackground(el_1);
        });
        if (this.checkProductQtyOne(el)) {
            this.moreThanOneQtyHandler(el);
            // document.location.reload()
        }
        // this.disableElement(el)
    }
    moreThanOneQtyHandler(el) {
        el.disabled = false;
        el.value = '1';
        const cartItem = el.closest('cart-items');
        if (cartItem) {
            console.log(cartItem);
            console.log(cartItem.onChange);
        }
        // el.dispatchEvent(new Event('debounce', { 'bubbles': true }))
    }
    checkLineItemLength(quantity__inputs) {
        if (this.quantity__inputs && this.quantity__inputs.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    checkProductTitle(elem) {
        var _a;
        if ((_a = elem.ariaLabel) === null || _a === void 0 ? void 0 : _a.includes(this.productTitle)) {
            return true;
        }
        else {
            return false;
        }
    }
    checkProductQtyOne(elem) {
        if (parseInt(elem.value) > 1) {
            return true;
        }
        else {
            return false;
        }
    }
    disableElement(elem) {
        elem.disabled = true;
    }
    changeElmBackground(elem) {
        elem.style.background = '#f3f3f3';
    }
}
const cartDiscountController = new CartDiscountController('雨敵 玻璃清潔噴劑 GLACO Windscreen Glass De Cleaner');
