class ExternalTriggerInterfaceClass {
    private _addToCartResponse: (res: any) => void;
    private _addToCartFinally: (_this:any) => void;
    private _updateCartQuantity: (parsedState:ParsedState)=>void

    constructor() {
        this._addToCartResponse = (res: any) => { console.log('default cart res'); }
        this._addToCartFinally = () => { console.log('default finally'); }
        this._updateCartQuantity = (parsedState:ParsedState)=>{}
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

    set addToCartResponse(fn: (res: any) => void) {
        this._addToCartResponse = fn;
    }
    set addToCartFinally(fn: (_this:any) => void) {
        this._addToCartFinally = fn
    }
    set updateCartQuantity(fn: (parsedState:ParsedState)=>void) { 
        this._updateCartQuantity = fn
    }
}
const externalTriggerInterface = new ExternalTriggerInterfaceClass()

externalTriggerInterface.addToCartResponse = (res:any)=>{console.log(res)}
// externalTriggerInterface.updateCartQuantity = (res:any)=>{console.log(res)}

