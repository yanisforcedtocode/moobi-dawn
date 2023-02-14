// if the line-item name matches => disable quantity input and quantity buttons, 
// plus a color change
// if quantity > 1 => change to 1

class CartDiscountController {
    productTitle: string
    buttonClass: string
    quantity__inputs: NodeListOf<HTMLInputElement> 
    constructor(producdTitle: string){
        this.productTitle = producdTitle
        this.quantity__inputs = document.querySelectorAll('.quantity__input')
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

    matchingProductHandler(el: HTMLInputElement){
        this.changeElmBackground(el)
        const parent = el.parentElement!
                const buttons = parent.querySelectorAll(`.${this.buttonClass}`) as NodeListOf<HTMLButtonElement>
                buttons.forEach((el_1)=>{
                    this.disableElement(el_1)
                    this.changeElmBackground(el_1)
                })
                if(this.checkProductQtyOne(el)){
                    this.moreThanOneQtyHandler(el)
                    // document.location.reload()
                }
                // this.disableElement(el)
    }

    moreThanOneQtyHandler(el: HTMLInputElement){
        el.disabled = false
        el.value = '1'
        const cartItem = el.closest('cart-items') as any
        if(cartItem){
            console.log(cartItem)
            console.log(cartItem.onChange)
        }
        // el.dispatchEvent(new Event('debounce', { 'bubbles': true }))
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

    disableElement(elem: HTMLInputElement | HTMLButtonElement){
        elem.disabled = true
    }

    changeElmBackground(elem: HTMLInputElement | HTMLButtonElement){
        elem.style.background = '#f3f3f3'
    }


}

const cartDiscountController = new CartDiscountController('雨敵 玻璃清潔噴劑 GLACO Windscreen Glass De Cleaner')