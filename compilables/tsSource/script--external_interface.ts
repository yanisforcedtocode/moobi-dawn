class ExternalTriggerInterfaceClass {
    private _addToCartResponse: (res: any) => void;
    private _addToCartFinally: (_this:any) => void;

    constructor() {
        this._addToCartResponse = (res: any) => { console.log('default cart res'); }
        this._addToCartFinally = () => { console.log('default finally'); }
    }

    get addToCartResponse() {
        return this._addToCartResponse;
    }
    get addToCartFinally() { 
        return this._addToCartFinally;
    }

    set addToCartResponse(fn: (res: any) => void) {
        this._addToCartResponse = fn;
    }
    set addToCartFinally(fn: (_this:any) => void) {
        this._addToCartFinally = fn
    }
}
const externalTriggerInterface = new ExternalTriggerInterfaceClass()

const cartPageAddButtonFinallyExtHandler = (_this:any)=>{
    const button = _this.submitButton as HTMLElement
    if (button){
        _this.submitButton.disabled = true
        _this.submitButton.innerText = "added to cart"
    }
  }

externalTriggerInterface.addToCartResponse = (res:any)=>{console.log(res)}

externalTriggerInterface.addToCartFinally = cartPageAddButtonFinallyExtHandler