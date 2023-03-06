
class RearrangeCartElements{
    cartItems: HTMLElement | null
    cartFooter: HTMLElement | null
    cartItemsFooterGrid: HTMLElement | null
    constructor(){
        this.cartItems = document.querySelector('cartitems')
        this.cartFooter = document.getElementById('main-cart-footer')
        this.cartItemsFooterGrid = document.querySelector('.cart_cartitem_checkout_wrapper')
        this.rearrangeCartElements()
    }
    rearrangeCartElements(){
        this.rearrangeFooter()
    }
    rearrangeFooter(){
        if(this.cartFooter && this.cartItemsFooterGrid){
            this.cartItemsFooterGrid.appendChild(this.cartFooter)
        }
    }
}

// const rearrangeCartElms = new RearrangeCartElements()