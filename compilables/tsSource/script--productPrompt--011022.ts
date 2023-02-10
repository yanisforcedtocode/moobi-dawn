/* === product prompt widget === */
// How does it work:
// global variable:
declare var gTag_add_to_cartHandler: (response: []) => void
declare var theme: any
declare var slate: any
// theme handlers
const themeHanlders = {
    // Get popupWrapper and closeButton
    cartPopupWrapper: document.querySelector("[data-cart-popup-wrapper]"),
    cartPopupCloseButton: document.querySelector(".cart-popup__close"),
    cartPopupHeader: document.querySelector(".cart-popup__header") as HTMLElement,
    cartPopupTotalQty: document.querySelector("[data-cart-popup-cart-quantity]"),
    cartPopupDismissBtn: document.querySelector("[data-cart-popup-dismiss]"),
    cartPopupItemNoStock: `<div class="cart-popup-item">
        <div class="cart-popup-item__description">
          <div>
            <h3 class="cart-popup-item__title" data-cart-popup-title="">存貨不足，未能加入購物車。</h3>
            <ul class="product-details" aria-label="產品資訊" data-cart-popup-product-details="" hidden=""></ul>
          </div>
        </div>
      </div>`,
    cartPopupItemError: `<div class="cart-popup-item">
      <div class="cart-popup-item__description">
        <div>
          <h3 class="cart-popup-item__title" data-cart-popup-title="">暫時未能加入購物車。</h3>
          <ul class="product-details" aria-label="產品資訊" data-cart-popup-product-details="" hidden=""></ul>
        </div>
      </div>
    </div>`,
  
    _showCartPopup: function () {
      const self = themeHanlders;
      // Shopify theme.js transition property
    theme.Helpers.prepareTransition(self.cartPopupWrapper);
      if(self.cartPopupWrapper){
        self.cartPopupWrapper.classList.remove("cart-popup-wrapper--hidden");
      }
  
      // Focus info from Shopify theme.js
            //   slate.a11y.trapFocus({
            //     container: self.cartPopupWrapper,
            //     elementToFocus: self.cartPopupWrapper,
            //     namespace: "cartPopupFocus",
            //   });
  
      // Eventlistener to close the popup
      document.addEventListener("click", self._showPopupHandler);
    },
  
    _showPopupHandler: function (evt:any) {
      // console.log(evt)
      const self = themeHanlders;
      const pathCheck = (path:any) => {
        // if clicked on the warpper || close button
        let hitClose = false;
        let hitWrapper = false;
        path.forEach((el:any) => {
          if (el === self.cartPopupCloseButton) {
            hitClose = true;
          }
          if (el === self.cartPopupDismissBtn) {
            hitClose = true;
          }
          if (el === self.cartPopupWrapper) {
            hitWrapper = true;
          }
        });
        return hitClose || !hitWrapper;
      };
      if (pathCheck(evt.path || (evt.composedPath && evt.composedPath()))) {
        self._hideCartPopup();
      }
    },

    _clearPopUpItems: function () {
        // restore original item
        const imgWrapper = document.querySelector('[data-cart-popup-image-wrapper]') as HTMLElement
        imgWrapper.setAttribute('data-image-loading-animation', '')
        const itemImg = document.querySelector('[data-cart-popup-image]')
        itemImg?.remove()
    },
    
  
    _hideCartPopup: function () {
      const self = this;
      // var setFocus = event.detail === 0 ? true : false;
      theme.Helpers.prepareTransition(this.cartPopupWrapper);
      if(self.cartPopupWrapper){
          self.cartPopupWrapper.classList.add("cart-popup-wrapper--hidden");
      }
      document.removeEventListener("click", self._showPopupHandler);
      themeHanlders._clearPopUpItems()
    },
  
    _updateCartPopupContent: function(res:any){
        // type guard 
        if (themeHanlders.cartPopupHeader !== null){
            // if res is undefined
            if(typeof res === 'undefined'){
              themeHanlders.cartPopupHeader.insertAdjacentHTML('afterend', themeHanlders.cartPopupItemError)
              return
            }
            // if 422 returned by AJAX API, update cart box with error message
            if(res?.status === 422){
              themeHanlders.cartPopupHeader.insertAdjacentHTML('afterend', themeHanlders.cartPopupItemNoStock)
              return
            }
            // console.log(res)
            // if status is not 422, update cart box with item info
            const imgWrapper = document.querySelector('.cart-popup-item__image-wrapper') as HTMLElement
            if(imgWrapper){
                // render img in the original image wrapper
                imgWrapper.removeAttribute ('data-image-loading-animation')
                imgWrapper.classList.remove('hide')
                const index = res.items[0].featured_image.url.indexOf(".jpg")
                const imgSrc = `${res.items[0].featured_image.url.slice(0, index)}_200x200${res.items[0].featured_image.url.slice(index)}`
                let imgHTML = `<img src="{{imgSrc}}" alt="{{ImgAlt}}" class="cart-popup-item__image" data-cart-popup-image="">`
                imgHTML = imgHTML.replace(/{{imgSrc}}/g, imgSrc).replace(/{{imgAlt}}/g, res.items[0].featured_image.alt)
                imgWrapper.insertAdjacentHTML('beforeend', imgHTML)

                // render new description wrapper
                const title = res.items[0].title
                const qty = res.items[0].quantity
                const titleElm = document.querySelector('[data-cart-popup-title]') as HTMLElement
                if(titleElm){
                    titleElm.innerText = title
                }
                const qtyElm = document.querySelector('[data-cart-popup-quantity]') as HTMLElement
                if(qtyElm){
                    qtyElm.innerText = qty
                }
                
            }
        }
    },
  };

// load the data-set rendered on the html, and insert onto the desired places, clear up by clicking close button
type ProductItemData = {
    productId: string;
    productTitle: string;
    productUrl: string;
    productImg: string;
    productPrice: number;
    productCAPrice?: number;
    productVarId?: number;
}

enum CartActionsTypes {
    Add, Update, Remove, View
  }

// main class
class ProductPrompt{
    cartPopupClass: string;
    buyButtonClass: string;
    socialSharingClass: string;
    desDiv: HTMLDivElement | null; 
    productDivArr?: [HTMLElement?];
    desData?:{
        promptDesc: string,
    };
    productDataArr? :ProductItemData[];
    popUpinsert?: HTMLElement;
    gridInsert?: HTMLElement;
    cartResponse?:{items?:any};
    cartViewResponse?: {items?:any};
    buyButtonInstance: number
    
    constructor(promptDataId: string, promptPdtListSelector: string, cartPopupClass: string, socialCharingClass: string, buyButtonClass: string){
        this.cartPopupClass = cartPopupClass
        this.buyButtonClass = buyButtonClass
        this.socialSharingClass = socialCharingClass
        this.desDiv = document.getElementById(promptDataId) as HTMLDivElement
        this.buyButtonInstance = 0
        const pdtlist = document.querySelectorAll(promptPdtListSelector) as NodeListOf<HTMLElement>

        // extract data from productList
        if(pdtlist !== null){
            // assign empty array
            this.productDivArr = []
            pdtlist.forEach((el)=>{this.productDivArr?.push(el)})
            const dataArr = Array.from(pdtlist).map((el)=>{
                return this.extractProductData(el)
            })
            // save data
            this.productDataArr = dataArr
        }

        // extract data from description div
        if(this.desDiv !== null){
             this.extractDescData()
            }
        
        // render DOM elements
        if(this.productDataArr && this.desData){
                // this.createPopUpElm()
                this.createGridElm()
                this.render(this.cartPopupClass, this.socialSharingClass)
                // this.hideDivById("gridPromptDiv", "closeGridPrompt")
        }
        return
    }
    // Compositions
    // cart composition
    private async getCartActionRes(productDataArr:ProductItemData[]){
        try{
            const idArr = productDataArr.map((el) => {
                return el.productVarId || 0
            }).filter((el) => {
                return el !== 0
            })

            // new cart action instance
            const cartAction = new CartActions([...idArr], 1, CartActionsTypes.Add)
            // const cartAction = new CartActions([37435643822263, 0], 1, CartActionsTypes.Add)
            const res = await cartAction.cartResponse
            this.cartResponse = res
            if(this.cartResponse){
                this.cartResHandler(this.cartResponse, this.addToCartOkHandler.bind(this), this.addToCartFailHandler.bind(this), this.loadingCartHandler.bind(this))
            }
        }catch(e){console.log(e)}
    }

    private async getCartViewRes(){
        try{
            // new cart action instance
            const cartAction = new CartActions([], 0, CartActionsTypes.View)
            const res = await cartAction.cartViewResponse
            this.cartViewResponse = res
            if(this.cartResponse){
                this.cartViewResHandler(res)
            }
        }catch(e){console.log(e)}
    }

    // handle cart response
    private cartResHandler(response: {
        status?: number;
        items?: { id?: number }[]
    }, successHandler:() => void , failHandler:() => void, loadHandler:()=>void) {
        // change to loading state
        loadHandler()
        // if fail
        if (response?.status) {
            setTimeout(failHandler, 500)
        }
        // if not fail
        else {
            setTimeout(successHandler, 1000)
            // successHandler()
        }
    }

    private cartViewResHandler(res: any){
        // console.log(res.item_count)
        const totalQtyElm = document.querySelector('[data-cart-popup-cart-quantity]') as HTMLElement
        if(totalQtyElm){
            totalQtyElm.innerText = res.item_count
        }
    }

    // external trigger
    public themeTrigger(){
        this.showDivById('gridPromptDiv')
    }

    // extract desc data
    private extractDescData(){
        if (this.desDiv !== null){
            this.desData = {                
                promptDesc: this.desDiv.dataset.promptdesc as string,
            }
        }
    }

    // extract prodcut data
    private extractProductData(data: HTMLElement): ProductItemData {
            const dataObj:ProductItemData = {
                productId: data.dataset.productid || "variable not found",
                productTitle: data.dataset.producttitle || "variable not found",
                productUrl: data.dataset.producturl || "variable not found",
                productImg: data.dataset.productimg || "variable not found",
                productPrice: parseFloat(data.dataset.productprice || '0'),
                productVarId: parseFloat(data.dataset.productvarid || '0')                
            }
            if (data.dataset.productcaprice !== undefined) {
                dataObj.productCAPrice = parseFloat(data.dataset.productcaprice || '0')
            }
            return dataObj 
    }

    // create elements
    private createPopUpElm(){
        if(this.desData !== undefined){
            // main item
            const elm = document.createElement('div')
            elm.classList.add('productPrompt--popup')

            // Title and description
            const mainTitle = document.createElement('h2')
            mainTitle.innerText = "加配推介"
            const promptDescription =  document.createElement('div')
            promptDescription.classList.add("productPrompt--popup--description")
            promptDescription.innerHTML = this.desData.promptDesc;
            elm.insertAdjacentElement('afterbegin', promptDescription)
            elm.insertAdjacentElement('afterbegin', mainTitle)

            // Buy button
            const buyButton = this.createBuyButton(this.getCartActionRes)
            elm.insertAdjacentElement('beforeend', buyButton)

            // Product Items
            const productElms = this.productDataArr?.map((el)=>{
                // div Wrapper
                const itemWrapper = document.createElement('div')
                itemWrapper.classList.add("productPrompt--popup--productItem")
                
                // title Wrapper
                const titleWrapper = document.createElement('div')
                titleWrapper.classList.add("productPrompt--popup--productItem--contentWrapper")
                const pdtTitle = document.createElement('h3')
                pdtTitle.innerText = el.productTitle || ""
                titleWrapper.insertAdjacentElement('afterbegin', pdtTitle)
                itemWrapper.insertAdjacentElement('afterbegin', titleWrapper)
                
                // img Wrapper
                const imgwrapper = document.createElement('div')
                imgwrapper.classList.add("productPrompt--popup--productItem--imageWrapper")
                const img = document.createElement('img')
                img.src = el.productImg || ""
                imgwrapper.insertAdjacentElement('afterbegin', img)
                itemWrapper.insertAdjacentElement('afterbegin', imgwrapper)

                // price Wrapper
                const pricewrapper = document.createElement('div')
                pricewrapper.classList.add("productPrompt--popup--productItem--priceWrapper")
                const price = document.createElement('p')
                price.innerText = `$${el.productPrice/100}` || ""
                pricewrapper.insertAdjacentElement('afterbegin', price)
                itemWrapper.insertAdjacentElement('beforeend', pricewrapper)

                // Link
                const itemWrapperLink = document.createElement('a')
                itemWrapperLink.href = el.productUrl || ""
                itemWrapperLink.insertAdjacentElement('afterbegin', itemWrapper)

                // return elm
                return itemWrapperLink
            })

            productElms?.forEach((el)=>{
                elm.insertAdjacentElement('beforeend', el)
            })
            this.popUpinsert = elm
        }
    }

    private createGridElm(){
        if(this.desData !== undefined){
            // main item
            const elm = document.createElement('div')
            elm.classList.add('productPrompt--grid')
            // elm.classList.add("productPrompt--grid__hidden")

            // Title and description
            const mainTitle = document.createElement('h2')
            mainTitle.innerText = "店長推薦"
            mainTitle.insertAdjacentHTML('afterbegin', `<i class="fab fa-hotjar"></i>`)
            const promptDescription =  document.createElement('div')
            promptDescription.classList.add("productPrompt--grid--description")

            promptDescription.innerHTML = this.desData.promptDesc;
            elm.insertAdjacentElement('afterbegin', promptDescription)
            elm.insertAdjacentElement('afterbegin', mainTitle)

            
            // Product Items
            const productElms = this.productDataArr?.map((el)=>{
                // div Wrapper
                const itemWrapper = document.createElement('div')
                itemWrapper.classList.add("productPrompt--grid--productItem")
                
                // title Wrapper
                const titleWrapper = document.createElement('div')
                titleWrapper.classList.add("productPrompt--grid--productItem--contentWrapper")
                const pdtTitle = document.createElement('h3')
                pdtTitle.innerText = el.productTitle || ""
                titleWrapper.insertAdjacentElement('afterbegin', pdtTitle)
                itemWrapper.insertAdjacentElement('afterbegin', titleWrapper)
                
                // img Wrapper
                const imgwrapper = document.createElement('div')
                imgwrapper.classList.add('productPrompt--grid--productItem--imageWrapper')
                const img = document.createElement('img')
                img.src = el.productImg || ""
                imgwrapper.insertAdjacentElement('afterbegin', img)
                itemWrapper.insertAdjacentElement('afterbegin', imgwrapper)
                
                // price Wrapper
                const pricewrapper = document.createElement('div')
                pricewrapper.classList.add("productPrompt--popup--productItem--priceWrapper")
                const price = document.createElement('p')
                price.innerText = `$${el.productPrice/100}` || ""
                pricewrapper.insertAdjacentElement('afterbegin', price)
                itemWrapper.insertAdjacentElement('beforeend', pricewrapper)
                
                // Link
                const itemWrapperLink = document.createElement('a')
                itemWrapperLink.classList.add("productPrompt--grid--link")
                itemWrapperLink.href = el.productUrl || ""
                itemWrapperLink.insertAdjacentElement('afterbegin', itemWrapper)
                
                // return elm
                return itemWrapperLink
            })
            
            productElms?.forEach((el)=>{
                elm.insertAdjacentElement('beforeend', el)
            })
            
            // Buy button
            const buyButton = this.createBuyButton(this.getCartActionRes)
            elm.insertAdjacentElement('beforeend', buyButton)

            // close button
            const buttonDiv = document.createElement('i')
            buttonDiv.id = 'closeGridPrompt'
            buttonDiv.classList.add("fas")
            buttonDiv.classList.add("fa-caret-square-up")
            elm.insertAdjacentElement('afterbegin', buttonDiv)
            // hide the element by default
            elm.id = "gridPromptDiv"
            
            this.gridInsert = elm
        }

    }

    private createBuyButton(buyButtonHandler: Function){
        this.buyButtonInstance = this.buyButtonInstance+1
        const buyButton = document.createElement('div')
        buyButton.innerText = "一併加購"
        buyButton.classList.add(this.buyButtonClass)
        buyButton.id = `${this.buyButtonClass}--${this.buyButtonInstance}`
        const evtHandler = (async()=>{
            buyButtonHandler.apply(this, [this.productDataArr])
            buyButton.removeEventListener('click', evtHandler)
            // remove listener of all buyButtons
            const allButtons: HTMLDivElement[] = Array.from(document.querySelectorAll(`.${this.buyButtonClass}`))
            if (allButtons.length>0){
                for(let el of allButtons){
                    el.removeEventListener('click', evtHandler)
                }
            }
        }).bind(this)
        buyButton.addEventListener('click', evtHandler)
        return buyButton
    }

    // DOM manipulations
    private showDivById(divId: string){
        const divToBeShown: HTMLElement | null = document.getElementById(divId)
        if(divToBeShown){
            divToBeShown.classList.remove(divToBeShown.classList[1])
        }
    }

    private hideDivById (divId: string, buttonId: string): void{
        const divToBeHidden: HTMLElement | null = document.getElementById(divId)
        const hideButton: HTMLElement | null = document.getElementById(buttonId)
        if(divToBeHidden !== null && hideButton!==null){
            hideButton.addEventListener("click",()=>{
                divToBeHidden.classList.add("productPrompt--grid__hidden")
            })
        }
    }

    private render(cartPopupClass: string, socialSharingClass: string):void{
        const cartPopup = document.querySelector(`.${cartPopupClass}`)! as HTMLElement
        const socialSharing = document.querySelector(`.${socialSharingClass}`)! as HTMLElement
        if(this.popUpinsert){
            cartPopup.insertAdjacentElement('beforeend', this.popUpinsert)
        }
        if(this.gridInsert){
            socialSharing.insertAdjacentElement('beforebegin', this.gridInsert)
        }
    }

    private findButtonStatus(){
        const buyButtons: NodeListOf<HTMLElement> | null = document.querySelectorAll(`.${this.buyButtonClass}`)
        let classList: string[]
        let statusClass: string = ''
        if(buyButtons){
            classList =  Array.from(buyButtons[0].classList)
            classList.forEach((el)=>{
                if (el.includes("status")){
                    statusClass = el
                }
            })
            if(classList){
                return {
                    buttons: buyButtons,
                    status: statusClass
                }
            }
            else return
        } else return
    }

    private loadingCartHandler(){
        const loadingClass =  "status--Add2CartLoading"
        const loadingRing = document.createElement('div')
        loadingRing.classList.add('spinner')

        if (this.findButtonStatus()){
            const {buttons, status} = {...this.findButtonStatus()} 
            if(buttons && status){
                buttons.forEach((el)=>{
                    const loadingClass =  "status--Add2CartLoading"
                    const loadingRing = document.createElement('div')
                    loadingRing.classList.add('spinner')
                    el.classList.remove(status)
                    el.classList.add(loadingClass)
                    el.innerText = ""
                    el.insertAdjacentElement('afterbegin', loadingRing)
                })
            }
            if(buttons && !status){
                buttons.forEach((el)=>{
                    const loadingClass =  "status--Add2CartLoading"
                    const loadingRing = document.createElement('div')
                    loadingRing.classList.add('spinner')
                    el.classList.add(loadingClass)
                    el.innerText = ""
                    el.insertAdjacentElement('afterbegin', loadingRing)
                })
            }
        }
        return 
    }
    private async addToCartOkHandler(){
        const okClass =  "status--Add2CartOk"
        if (this.findButtonStatus()){
            const {buttons, status} = {...this.findButtonStatus()} 
            if(buttons && status){
                buttons.forEach((el)=>{
                    el.classList.remove(status)
                    el.classList.add(okClass)
                    el.innerText = "已加入購物車"
                })
            }
            // ???
            if(buttons && !status){
                buttons.forEach((el)=>{
                    el.classList.add(okClass)
                    el.innerText = "已加入購物車"
                })
            }
        }
        if(gTag_add_to_cartHandler && this.cartResponse){
            if(this.cartResponse?.items){
                gTag_add_to_cartHandler(this.cartResponse.items)
            }
        }
        themeHanlders._updateCartPopupContent(this.cartResponse)
        await this.getCartViewRes()
        themeHanlders._showCartPopup()
        return        
    }

    private addToCartFailHandler() {
        const failClass = "status--Add2Cartfail"
        if (this.findButtonStatus()){
            const {buttons, status} = {...this.findButtonStatus()} 
            if(buttons && status){
                buttons.forEach((el)=>{
                    el.classList.remove(status)
                    el.classList.add(failClass)
                    el.innerText = "未能加入購物車"
                })
            }
            // ???
            if(buttons && !status){
                buttons.forEach((el)=>{
                    el.classList.add(failClass)
                    el.innerText = "未能加入購物車"
                })
            }
        }
        return
    }
}

// trigger cart actions and get returned response by a getter
class CartActions{
    productId: number[];
    response?: {};
    quantity: number;
    type: CartActionsTypes

    constructor(productIdList: number[], quantity: number, type: CartActionsTypes){
        this.productId = productIdList
        this.quantity = quantity
        this.type = type
        // this.add2Cart(this.productId, 1)
    }

    private async add2Cart(productIdList: number[], quantity: number) {
        // scope type formData
        type FormData =  {
            items: {
                id: number;
                quantity: number;
            }[]
        }
        // create formData for add to Cart
        const formData: FormData = {
            items: productIdList.map((el)=>{
                const formDataItem = {
                    id: el,
                    quantity: quantity
                }
                return formDataItem
            })
        }
        try {
          const response = await fetch("/cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await response.json();
          this.response = data
        //   console.log(data)
          return data;
        } catch (e) {
          console.log(e);
        }
      }

    private async checkCart() {
        try {
          const response = await fetch("/cart.js", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          this.response = data
        //   console.log(data)
          return data;
        } catch (e) {
          console.log(e);
        }
      }  

    get cartResponse(){
        return (async()=>{
            try{
                await this.add2Cart(this.productId, 1)
                return this.response
            }catch(e){
                return 0
            }
        })()
    }

    get cartViewResponse(){
        return (async()=>{
            try{
                await this.checkCart()
                return this.response
            }catch(e){
                return 0
            }
        })()
    }
}



const productPrompt_1 = new ProductPrompt("promptDesData", ".promptProduct--listItem", "cart-popup", "social-sharing", "promptBuyButton")