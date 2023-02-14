// if the line-item name matches => disable quantity input and quantity buttons, 
// plus a color change
// if quantity > 1 => change to 1

class CartDiscountController {
    productTitle: string
    buttonClass: string
    quantity__inputs: NodeListOf<HTMLInputElement> 
    constructor(producdTitle: string){
        this.productTitle = producdTitle
        this.quantity__inputs = this.returnInputsFromDOM()
        this.buttonClass = "quantity__button"
        this.initDiscountItem()
    }
    initDiscountItem(){
        if(!this.checkLineItemLength(this.quantity__inputs)){
            return
        }
        this.quantity__inputs.forEach((el)=>{
            if(this.checkProductTitle(el)){
                this.matchingProductHandler(el)
            }
        })

    }

    matchingProductHandler(el: HTMLInputElement) {
        this.changeElmBackground(el)
        this.disableSideButtons(el)
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

    disableSideButtons(el: HTMLInputElement) {
        const parent = el.parentElement!
        const buttons = parent.querySelectorAll(`.${this.buttonClass}`) as NodeListOf<HTMLButtonElement>
        buttons.forEach((el_1) => {
            this.disableElement(el_1)
            this.changeElmBackground(el_1)
        })
    }

    disableElement(elem: HTMLInputElement | HTMLButtonElement){
        elem.disabled = true
    }

    changeElmBackground(elem: HTMLInputElement | HTMLButtonElement){
        elem.style.background = '#f3f3f3'
    }

    returnInputsFromDOM(){
        const inputs = document.querySelectorAll('.quantity__input') as NodeListOf<HTMLInputElement> 
        return inputs
    }

    updateInputsElm(){
        this.quantity__inputs = this.returnInputsFromDOM()
    }
    


}

const cartDiscountController = new CartDiscountController('雨敵 玻璃清潔噴劑 GLACO Windscreen Glass De Cleaner')