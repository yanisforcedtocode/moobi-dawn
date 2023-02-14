"use strict";
class ExternalTriggerInterfaceClass {
    constructor() {
        this._addToCartResponse = (res) => { console.log('default cart res'); };
        this._addToCartFinally = () => { console.log('default finally'); };
    }
    get addToCartResponse() {
        return this._addToCartResponse;
    }
    get addToCartFinally() {
        return this._addToCartFinally;
    }
    set addToCartResponse(fn) {
        this._addToCartResponse = fn;
    }
    set addToCartFinally(fn) {
        this._addToCartFinally = fn;
    }
}
const externalTriggerInterface = new ExternalTriggerInterfaceClass();
const cartPageAddButtonFinallyExtHandler = (_this) => {
    const button = _this.submitButton;
    if (button) {
        _this.submitButton.disabled = true;
        _this.submitButton.innerText = "added to cart";
    }
};
externalTriggerInterface.addToCartResponse = (res) => { console.log(res); };
externalTriggerInterface.addToCartFinally = cartPageAddButtonFinallyExtHandler;
