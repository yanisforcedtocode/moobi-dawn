
class WorkOnFirstPurchaseCloseRepCheck {
    elmClickCheckInstance: elmClicksRepCheck
    firstPurchaseBanner: HTMLElement | null
    ifEverActivated: boolean
    constructor () {
        const firstPurchaseCloseRepCheck = new elmClicksRepCheck('#firstPurchasePromptBanner__section__closeBtn', ['/'], 
            'firstPurchaseCloseRep', [this.closefirstPurchaseSection], { activationRepClearanceDays: 1 })
        this.elmClickCheckInstance = firstPurchaseCloseRepCheck
        this.firstPurchaseBanner = document.querySelector('.firstPurchasePromptBanner__section') as HTMLElement
        this.ifEverActivated = true
        this.initWorkOnFirstPurchaseCloseRepCheck()
    }


    initWorkOnFirstPurchaseCloseRepCheck(){
        // get ifEverActivated
        this.ifEverActivated = this.checkIfEverActivated()
        // if true => turn banner off
        if(this.ifEverActivated){
            this.displayNonefirstPurchaseSection()
        }
        // if false => turn banner on
        if(!this.ifEverActivated){
            this.showfirstPurchaseSection()
        }
    }

    // checks
    private checkIfEverActivated = ()=>{
        const activationState = this.elmClickCheckInstance.ifEverActivated
        this.ifEverActivated = activationState
        return activationState
    }

    // check banner style
    private showfirstPurchaseSection = ()=>{
        const banner = this.firstPurchaseBanner
        if(banner){
            setTimeout(()=>{
                banner.style.display = 'block'
                banner.classList.add('firstPurchaseBannerAppears')

            }, 1200)
        }
    }
    
    private closefirstPurchaseSection = ()=>{
        const banner = this.firstPurchaseBanner
        if(banner){
            banner.classList.remove('firstPurchaseBannerAppears')
        }
    }

    private displayNonefirstPurchaseSection = ()=>{
        if(this.firstPurchaseBanner){
            // this.firstPurchaseBanner.style.opacity = '0%'
            this.firstPurchaseBanner.style.display = 'none'
        }
    }

}

const workOnFirstPurchaseCloseRepCheck = new WorkOnFirstPurchaseCloseRepCheck()