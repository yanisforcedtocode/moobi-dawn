class WrapperAccordion{
    warpperElmList: NodeListOf<HTMLElement> | null
    maxWidthOpened: number
    maxWidthClosed: number
    constructor(selector:string, openedWidth: number, closedWidth: number){
        this.warpperElmList =  document.querySelectorAll(selector) as NodeListOf<HTMLElement>
        this.maxWidthOpened = openedWidth
        this.maxWidthClosed = closedWidth 
        this.iniWrapperAccordion()
    }

    iniWrapperAccordion(){
        if(this.warpperElmList && this.warpperElmList.length > 0){
            this.warpperElmList.forEach((el)=>{
                this.listenToElement(el, this.wrapperAccordionController.bind(this))
            })

        }
    }
    wrapperAccordionController(evt: Event, elm: HTMLElement){
        const isOpened = elm.dataset.isOpened
        if(isOpened === 'true'){
            this.closeAccordion(elm, this.maxWidthClosed)
        }
        else{
            this.openAccordion(elm, this.maxWidthOpened)            
        }
    }

    listenToElement(elm: HTMLElement, handler: Function){
        elm.addEventListener('click', (evt: Event)=>{
            handler(evt, elm)
        })
    }
    
    openAccordion(elm: HTMLElement, maxHeight: number){
        elm.style.maxHeight = maxHeight.toString()+'px'
        this.markOpened(elm)
    }

    closeAccordion(elm: HTMLElement, maxHeight: number){
        elm.style.maxHeight = maxHeight.toString()+'px'
        this.markClosed(elm)
    }

    markOpened(elm: HTMLElement){
        elm.dataset.isOpened = "true"
    }

    markClosed(elm: HTMLElement){
        delete elm.dataset.isOpened 
    }


}

const descriptionWrapper = new WrapperAccordion('.product_description_wrapper', 1500, 55)