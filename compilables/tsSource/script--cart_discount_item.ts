type ParsedState = {
    token: string;
    note: null | string;
    attributes: Record<string, unknown>;
    original_total_price: number;
    total_price: number;
    total_discount: number;
    total_weight: number;
    item_count: number;
    items: {
      id: number;
      properties: Record<string, unknown>;
      quantity: number;
      variant_id: number;
      key: string;
      title: string;
      price: number;
      original_price: number;
      discounted_price: number;
      line_price: number;
      original_line_price: number;
      total_discount: number;
      discounts: [];
      sku: string;
      grams: number;
      vendor: string;
      taxable: boolean;
      product_id: number;
      product_has_only_default_variant: boolean,
      gift_card: boolean;
      final_price: number;
      final_line_price: number;
      url: string;
      featured_image: {
        aspect_ratio: number;
        alt: string;
        height: number;
        url: string;
        width: number;
      };
      image: string;
      handle: string;
      requires_shipping: boolean;
      product_type: string;
      product_title: string;
      product_description: string;
      variant_title: string;
      variant_options: string[];
      options_with_values: {
        name: string;
        value: unknown;
      }[];
      line_level_discount_allocations: [];
      line_level_total_discount: number;
    }[];
    requires_shipping: boolean;
    currency: string;
    items_subtotal_price: number;
    cart_level_discount_applications: [];
    sections: {[x:string]:string};
  };
  
class CartDiscountItemController {
    noLineItemMatch: boolean;
    productTitle: string
    discountItemThreshold: number
    buttonClass: string
    quantity__inputs: NodeListOf<HTMLInputElement> 
    addedToCart: string
    constructor(producdTitle: string, discountItemThreshold: number ){
        this.noLineItemMatch = true
        this.productTitle = producdTitle
        this.discountItemThreshold = discountItemThreshold
        this.quantity__inputs = this.returnInputsFromDOM()
        this.buttonClass = "quantity__button"
        this.addedToCart = "Discount item redeemed"
        this.initDiscountItem()
    }
    initDiscountItem(){
        if(!this.checkLineItemLength(this.quantity__inputs)){
            return
        }
        this.quantity__inputs.forEach((el)=>{
            if(this.checkProductTitle(el)){
                this.noLineItemMatch = false
            }
        })
    }

    matchingProductHandler(el: HTMLInputElement) {
        if (this.checkProductQtyOne(el)) {
            this.moreThanOneQtyHandler(el)
        }
    }

    async moreThanOneQtyHandler(el: HTMLInputElement){
        el.value = '1'
        const elIndex = parseInt(el.dataset.index!)
        await this.updateCartItem(el, elIndex)
        this.updateInputsElm()
        this.disableElement(this.quantity__inputs[elIndex-1])
        this.changeElmBackground(this.quantity__inputs[elIndex-1])
        this.disableSideButtons(this.quantity__inputs[elIndex-1])
        }
    
    async updateCartItem(el: HTMLInputElement, index: number) {
            const name = document.activeElement ? document.activeElement.getAttribute('name') : null
            const cartItem = el.closest('cart-items') as any
            const elIndex = el.dataset.index
            await cartItem.updateQuantity(elIndex, 1, name)  
    }


    checkLineItemLength(quantity__inputs: NodeListOf<HTMLInputElement>){
        if(this.quantity__inputs && this.quantity__inputs.length> 0){
            return true
        }else {
            return false
        }
    }

    checkProductTitle(elem: HTMLInputElement){
        if(this.productTitle && elem.ariaLabel?.includes(this.productTitle)){
            return true
        }else{
            return false
        }
    }

    checkCartItemTitles(parsedState: ParsedState){
        let mapped = parsedState.items.map((el)=>{
            if(el.product_title === this.productTitle){
                return el.key
            }else{
                return false
            }
        }).filter((el)=>{
            return el !== false
        })
        return mapped[0]
    }

    checkProductQtyOne(elem: HTMLInputElement){
        if(parseInt(elem.value) >1){
            return true
        }else{
            return false
        }
    }

    checkCartPriceThreshold(totalPrice: number){
        if(totalPrice> this.discountItemThreshold){
            return true
        }else{
            return false
        }
    }


    enableAddButton(){
        const addButton = document.querySelector('[name="add"]') as HTMLButtonElement | null
        if (addButton) {
            addButton.disabled = false
        }
    }

    disableSideButtons(el: HTMLInputElement) {
        const parent = el.parentElement!
        const buttons = parent.querySelectorAll(`.${this.buttonClass}`) as NodeListOf<HTMLButtonElement>
        buttons.forEach((el_1) => {
            this.disableElement(el_1)
            this.changeElmBackground(el_1)
        })
    }
    disableAddButton(){
        const addButton = document.querySelector('[name="add"]') as HTMLButtonElement | null
        if (addButton) {
            this.disableElement(addButton)
            addButton.innerText = this.addedToCart
        }
    }

    disableElement(elem: HTMLInputElement | HTMLButtonElement){
        elem.disabled = true
    }

    changeElmBackground(elem: HTMLInputElement | HTMLButtonElement, color?: string | undefined){
        elem.style.background = '#f3f3f3'
        if(color){
            elem.style.background = color
        }
    }

    returnInputsFromDOM(){
        const inputs = document.querySelectorAll('.quantity__input') as NodeListOf<HTMLInputElement> 
        return inputs
    }

    updateInputsElm(){
        this.quantity__inputs = this.returnInputsFromDOM()
    }

    static cartPageAddButtonFinallyExtHandler(_this:any){
        const button = _this.submitButton as HTMLElement
        if (button){
            _this.submitButton.disabled = true
            // _this.submitButton.innerText = "added to cart"
            if(window.location.pathname.includes('/cart')){
                window.location.reload()
              }
        }
      }
    public async removeDiscountItem(parsedState: ParsedState){
        try {
            const metThreshold = this.checkCartPriceThreshold(parsedState.total_price)
            const keyMap = this.checkCartItemTitles(parsedState)
            
            if(!metThreshold && keyMap){
                const res = await moobiQueries.changeCartItem(keyMap, 0)
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const discountItemTitle = document.getElementById('discount_item_title')!.innerText 
const discountItemThreshold = parseInt(document.getElementById('discount_item_threshold')!.innerText )
const cartDiscount = new CartDiscountItemController(discountItemTitle, discountItemThreshold)

externalTriggerInterface.addToCartFinally = CartDiscountItemController.cartPageAddButtonFinallyExtHandler
externalTriggerInterface.updateCartQuantity = cartDiscount.removeDiscountItem.bind(cartDiscount)

class CartDiscountPromptController {
    cartItems: any
    promptSection: HTMLElement | null
    parsedState?: ParsedCartResponse
    promptData?: {
        save10: string | undefined
        freeShip: string | undefined
        free_shippingPrompt: string | undefined
        no_free_shippingPrompt: string | undefined
        special_discount_Prompt: string | undefined
        no_special_discount_Prompt: string | undefined
        default_shippingFee: number
        freeShipPrice: number
        save10Price: number
    }
    cartData?:{
        originalTotalPrice: number
        totalPrice: number
        totalDiscount: number
        itemCount: number
        items: any[]
        itemSubtotalPrice: number
        cart_level_discount_applications: string[]
    }
   
    constructor(){
        this.promptSection = document.getElementById('custom_discount_and_shipping_policies')
        this.cartItems = document.querySelector('cart-items')
        this.wrapUpdateQuantity()
    }
    wrapUpdateQuantity() {
        const handlerCopy = this.cartItems.updateQuantity 
        const wrapperFn = async (index:any, value: any, elm: any) => {
            try {
                const parsedStates = await handlerCopy.apply(this.cartItems, [index, value, elm])
                if(parsedStates){
                    this.discountPromptHandler(parsedStates)
                }
            } catch (error) {
                console.log(error)
            }
        };
        this.cartItems.updateQuantity = wrapperFn;
    }

    discountPromptHandler(parsedStates: ParsedCartResponse) {
        this.parsedState = parsedStates
        this.digestParsedState()
        this.getSectionInfo()
        this.freeShipHandler()
        this.specialDiscountHandler()
        this.systemDiscountHandler()
        this.totalDiscountHandler()
    }

    freeShipHandler(){
        const elm =  this.getPromptBlock('[type="freeshipping_prompt_block"]')
        if(this.checkFreeShipping()){
            if(this.checkFreeShipping() && this.promptData){
                const message = this.promptData.free_shippingPrompt
                this.renderMoney(elm, 0)
                if(message){
                    this.renderPrompt(elm, message)
                }
            }
        }
        if(!this.checkFreeShipping() && this.promptData){
            const message = this.promptData.no_free_shippingPrompt
            this.renderMoney(elm, this.promptData.default_shippingFee/100)
            if(message){
                this.renderPrompt(elm, message)
            }
        }
    }

    specialDiscountHandler(){
            const elm = this.getPromptBlock('[type="specialdiscount_prompt_block"]')
            if(this.checkSave10() && this.promptData){
                const price = this.checkSave10()
                const message = this.promptData.special_discount_Prompt
                if(price){
                    this.renderMoney(elm, price)
                }
                if(message){
                    this.renderPrompt(elm, message)
                }
            }
            if(!this.checkSave10() && this.promptData){
                const message = this.promptData.no_special_discount_Prompt

                    this.renderMoney(elm, 0)

                if(message){
                    this.renderPrompt(elm, message)
                }
            }
    }

    systemDiscountHandler(){
        
            const elm = this.getPromptBlock('[type="systemdiscount_prompt_block"]')
            if(this.checkSystemDiscount()){
                const price = this.cartData?.totalDiscount
                const message = this.checkSystemDiscount()
                if(price){
                    this.renderMoney(elm, price)
                }
                if(message){
                    const string = message.join(', ')
                    this.renderPrompt(elm, string)
                }
            }
            if(!this.checkSystemDiscount() && this.promptData){
                const price = 0
                const message = ""
                if(price){
                    this.renderMoney(elm, price)
                }
                if(message){
                    this.renderPrompt(elm, message)
                }
            }
        
    }

    totalDiscountHandler(){
        const totalDiscountP = document.getElementById('total_discount') as HTMLElement
        let shippingDisc = 0
        let specialDisc = 0
        if(this.checkFreeShipping() && this.promptData){
            shippingDisc = this.promptData.default_shippingFee/100
        }
        const disc = this.checkSave10()
        if(disc && this.promptData){
            specialDisc = disc
        }
        let systemDisc = this.cartData?.totalDiscount || 0
        const totalDisc = this.moneyFormater(shippingDisc + specialDisc + (systemDisc / 100))
        if(totalDiscountP){
            totalDiscountP.innerText = totalDisc
        }
    }
    
    digestParsedState(){
        if(this.parsedState){
            const digestedState = new CartResponseInterface(this.parsedState)
            const cartData = {
                originalTotalPrice: digestedState.originalTotalPrice,
                totalPrice: digestedState.totalPrice,
                totalDiscount: digestedState.totalDiscount,
                itemCount: digestedState.itemCount,
                items: digestedState.items,
                itemSubtotalPrice: digestedState.itemSubtotalPrice,
                cart_level_discount_applications: digestedState.cart_level_discount_applications
            }
            this.cartData = cartData
        }
    }

    getSectionInfo(){
        if(this.promptSection){
            const promptDataSet = this.promptSection.dataset
            const promptData = {
                save10: promptDataSet.save10,
                freeShip: promptDataSet.freeship,
                free_shippingPrompt: promptDataSet.free_shippingprompt,
                no_free_shippingPrompt: promptDataSet.no_free_shippingprompt,
                special_discount_Prompt: promptDataSet.special_discount_prompt,
                no_special_discount_Prompt: promptDataSet.no_special_discount_prompt,
                default_shippingFee: promptDataSet.default_shippingfee? parseInt(promptDataSet.default_shippingfee):49,
                freeShipPrice: promptDataSet.freeshipprice? parseInt(promptDataSet.freeshipprice): 149,
                save10Price: promptDataSet.save10price? parseInt(promptDataSet.save10price): 349
            }
            this.promptData = promptData
        }
    }

    checkFreeShipping(){
        
        if(this.promptData?.freeShip === 'true' && this.cartData?.totalPrice && this.promptData?.default_shippingFee && this.cartData?.totalPrice >= this.promptData?.freeShipPrice ){
            return (this.promptData.default_shippingFee / 100)
        }else{
            return false
        }
    }

    checkSave10(){
        if(this.promptData?.save10 === 'true' && this.cartData?.totalPrice && this.promptData?.save10Price && this.cartData?.totalPrice >= this.promptData?.save10Price ){
            return (this.cartData.totalPrice * 0.1 / 100)
        }else{
            return false
        }
    }

    checkSystemDiscount(){
        if(this.cartData?.totalDiscount){
            return this.cartData.cart_level_discount_applications
        }else{
            return false
        }
    }

    getPromptBlock(identifier: string){
        const promptBlock = document.querySelector(identifier) as HTMLElement
        return promptBlock
    }

    renderMoney( promptBlock: HTMLElement, price: number ){
        const moneyP = promptBlock.querySelector('[type="money"]') as HTMLElement
        moneyP.innerText = this.moneyFormater(price)
    }

    renderPrompt( promptBlock: HTMLElement, prompt: string ){
        const promptP = promptBlock.querySelector('[type="discount_prompt"]') as HTMLElement
        promptP.innerText = prompt
    }

    moneyFormater(price: number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
        return formatter.format(price)
    }

}

const discountPrompt = new CartDiscountPromptController()