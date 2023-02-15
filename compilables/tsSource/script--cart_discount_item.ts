// if the line-item name matches => disable quantity input and quantity buttons, 
// plus a color change
// if quantity > 1 => change to 1

class CartDiscountItemController {
    noLineItemMatch: boolean;
    productTitle: string
    buttonClass: string
    quantity__inputs: NodeListOf<HTMLInputElement> 
    addedToCart: string
    constructor(producdTitle: string){
        this.noLineItemMatch = true
        this.productTitle = producdTitle
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
                this.matchingProductHandler(el)
                this.noLineItemMatch = false
            }
        })
        if(this.noLineItemMatch){
            this.enableAddButton()
        }

    }

    matchingProductHandler(el: HTMLInputElement) {
        console.log('matching')
        this.changeElmBackground(el)
        this.disableSideButtons(el)
        this.disableAddButton()
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
        if(elem.ariaLabel?.includes(this.productTitle)){
            return true
        }else{
            return false
        }
    }

    checkProductQtyOne(elem: HTMLInputElement){
        if(parseInt(elem.value) >1){
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
    


}

const cartDiscountController = new CartDiscountItemController('雨敵 玻璃清潔噴劑 GLACO Windscreen Glass De Cleaner')

class CartDiscountPromptController {
    // wrap external functions to cartItem.updateQuantity
    // original cartItem.updateQuantity parsedstate
    // use new CartResponseInterface(parsedstate) to get relevant information
    // get all the sections to render
    // get all the strings from data-set
    // calculation
    // render
    // return
    constructor(){
        this.wrapUpdateQuantity()
    }
    wrapUpdateQuantity() {
        let cartItems = document.querySelector('cart-items') as any
        const handlerCopy = cartItems.updateQuantity
        const wrapperFn = async ([arg]: any) => {
            const parsedStates = await handlerCopy([arg])
            // externalTriggerInterface.updateQuantity(parsedStates)
            console.log('do sth')
        };
        cartItems.updateQuantity = wrapperFn;
    }

    discountPromptHandler(parsedState: ParsedCartResponse) {
        const digestedState = new CartResponseInterface(parsedState)

    }

}

const discountPrompt = new CartDiscountPromptController()