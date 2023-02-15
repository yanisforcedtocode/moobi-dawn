class ExternalTriggerInterfaceClass {
    private _addToCartResponse: (res: any) => void;
    private _addToCartFinally: (_this:any) => void;
    private _updateQuantity: (parsedState: {})=> void

    constructor() {
        this._addToCartResponse = (res: any) => { console.log('default cart res'); }
        this._addToCartFinally = () => { console.log('default finally'); }
        this._updateQuantity = (parsedState)=>{}
    }

    get addToCartResponse() {
        return this._addToCartResponse;
    }
    get addToCartFinally() { 
        return this._addToCartFinally;
    }
    get updateQuantity() { 
        return this._updateQuantity;
    }

    set addToCartResponse(fn: (res: any) => void) {
        this._addToCartResponse = fn;
    }
    set addToCartFinally(fn: (_this:any) => void) {
        this._addToCartFinally = fn
    }
    set updateQuantity(fn: (parsedState:{})=>void) { 
        this.updateQuantity = fn
    }
}
const externalTriggerInterface = new ExternalTriggerInterfaceClass()

externalTriggerInterface.addToCartResponse = (res:any)=>{console.log(res)}
