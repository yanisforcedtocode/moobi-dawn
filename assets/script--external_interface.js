"use strict";
class ExternalTriggerInterfaceClass {
    constructor() {
        this._addToCartResponse = (res) => { console.log('default cart res'); };
        this._addToCartFinally = () => { console.log('default finally'); };
        this._updateCartQuantity = (parsedState) => { };
    }
    get addToCartResponse() {
        return this._addToCartResponse;
    }
    get addToCartFinally() {
        return this._addToCartFinally;
    }
    get updateCartQuantity() {
        return this._updateCartQuantity;
    }
    set addToCartResponse(fn) {
        this._addToCartResponse = fn;
    }
    set addToCartFinally(fn) {
        this._addToCartFinally = fn;
    }
    set updateCartQuantity(fn) {
        this._updateCartQuantity = fn;
    }
}
const externalTriggerInterface = new ExternalTriggerInterfaceClass();
externalTriggerInterface.addToCartResponse = (res) => { console.log(res); };
// externalTriggerInterface.updateCartQuantity = (res:any)=>{console.log(res)}
