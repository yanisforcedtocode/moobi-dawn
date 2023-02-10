interface RepCheckLocalStorageObj {
    lastActivatedDateMs: number,
    pageUrl: string,
    activationRep: number,
    loadRepClearanceDays: number,
    payLoad: any
}

interface activationRepCheckOptions {
    activationRepClearanceDays: number
}

class activationRepCheck {
    private currentDate: Date
    private msPerDay: number
    protected itemKey: string
    private newPayLoadValue: any
    private storedValue: string | null
    private storedObj: RepCheckLocalStorageObj | null
    protected newStorageObj: RepCheckLocalStorageObj | false
    private options?: activationRepCheckOptions
    private targetPathName: string | string[]
    private storedPayLoadIntact: boolean
    private repClearance: boolean
    protected matchingUrl: boolean
    private checkoutUrl: boolean
    
    constructor(pathName: string | string[], itemKey: string, payLoad?: any, options?: activationRepCheckOptions){
        this.itemKey = itemKey
        this.targetPathName = pathName
        this.currentDate = new Date(Date.now())
        this.msPerDay = 860400000
        this.newPayLoadValue = JSON.stringify(payLoad)
        this.storedValue = null
        this.storedObj = null
        this.storedPayLoadIntact = false
        this.newStorageObj = false
        this.repClearance = false
        this.matchingUrl = false
        this.checkoutUrl = false

        if(options){
            this.options = options
        }

        // init
        this.initStorageCheck()
        this.initNewStorageObj()
        this.initClearExpiredStorageObj()
    }
    // init
    private initStorageCheck() {
        this.getStorageValue()
        this.readStoredObject()
        this.checkPayLoadIntact() 
        this.checkRepClearance()
    }

    private initNewStorageObj() {
        this.checkMatchingUrl()
        if (this.storedPayLoadIntact && !this.repClearance) {
            this.createNewStorageObject(this.returnActivationRep() + 1)
        } else {
            this.createNewStorageObject(1)
        }
    }

    private initClearExpiredStorageObj(){
        if(this.repClearance){
            this.createNewStorageObject(0)
            this.saveStorageObject(this.itemKey, this.newStorageObj)
        }
    }

    // read stroage object
    private getStorageValue () {
        this.storedValue = localStorage.getItem(this.itemKey);
        return this.storedValue
    }

    private readStoredObject () {
        if(this.storedValue){
            const storedObj =  JSON.parse(this.storedValue)
            this.storedObj = storedObj
            return storedObj
        } else {
            return null
        }
    }

    // checks
    private checkPayLoadIntact() {
        if (this.storedObj?.lastActivatedDateMs && this.storedObj?.loadRepClearanceDays && this.storedObj?.activationRep && this.storedObj?.pageUrl) {
            this.storedPayLoadIntact = true
            return true
        } else {
            this.storedPayLoadIntact = false
            return false
        }
    }

    private checkRepClearance (){
        if (this.options && this.options.activationRepClearanceDays && this.storedObj) {
            // this.checkRepClearance(this.options.activationRepClearanceDays, this.returnLastVisitMs(this.storedObj))
            const storedTime = this.returnLastVisitMs(this.storedObj)
            const elapsedTime = this.currentDate.valueOf() - storedTime
            const clearanceDaysInterval = this.options.activationRepClearanceDays
            if(elapsedTime > clearanceDaysInterval*this.msPerDay){
                this.repClearance = true
                return true
            }
        }
    }

    private checkMatchingUrl (){
        if(typeof this.targetPathName === "string"){
            return this.checkMatchingUrlString()

        }
        if(Array.isArray(this.targetPathName)){
            return this.checkMatchingUrlArr()
        }else{
            return false
        }
    }

    private checkMatchingUrlString (){
        const pathName = window.location.pathname
        if(pathName === this.targetPathName){
            this.matchingUrl = true
            return true
        } else {
            return false
        }
    }

    private checkMatchingUrlArr (){
        const pathName = window.location.pathname
        let matchAllStrings:Boolean[] = []
        for(let i = 0; i<this.targetPathName.length; i++){
            if(pathName.includes(this.targetPathName[i])){
                matchAllStrings.push(true)
            }else{
                matchAllStrings.push(false)
            }
        }
        if(matchAllStrings.includes(false) || matchAllStrings.length === 0){
            return false
        } else {
            this.matchingUrl = true
            return true
        }
    }

    private checkIfRunRepClearance(){
        if(this.options && this.options.activationRepClearanceDays && this.storedObj){
            return true
        } else {
            return false
        }
    }

    
  
    // write storage object
    private createNewStorageObject(prevActivationRep: number){
        const newObject: RepCheckLocalStorageObj = {
            lastActivatedDateMs: this.currentDate.valueOf(),
            pageUrl: window.location.href,
            activationRep: prevActivationRep,
            payLoad: this.newPayLoadValue,
            loadRepClearanceDays: 1
        }

        if(this.options && this.options.activationRepClearanceDays){
            newObject.loadRepClearanceDays = this.options.activationRepClearanceDays
        }

        this.newStorageObj = newObject
        return newObject
    }

    protected saveStorageObject (key: string, storageObj: RepCheckLocalStorageObj | false) {
        if(key && storageObj){
            const serializedstorageObj = JSON.stringify(storageObj)
            localStorage.setItem(key, serializedstorageObj);
        }
    }
    // return stored object value
    private returnActivationRep () {
        if(this.storedObj && this.storedObj.activationRep >= 1){
            return this.storedObj.activationRep
        }else{
            return 0
        }
    }

    private returnLastVisitMs (payLoad: RepCheckLocalStorageObj){
        return payLoad.lastActivatedDateMs
    }

    private returnPageUrl (payLoad: RepCheckLocalStorageObj){
        return payLoad.pageUrl
    }

    // getters
    public get validStoredObj (){
        this.initStorageCheck()
            if(this.storedPayLoadIntact){
                return this.storedObj
            }
            else {
                return `invalid storedObj`
            }
    }

    public get ifEverActivated() {
        if (this.storedObj) {
            const activationRep = this.storedObj.activationRep
            if (activationRep >= 1) { return true }
            else { return false }
        } else { return false }
    }

  
}

class elmClicksRepCheck extends activationRepCheck {
    private triggerElm: HTMLElement | null
    private extraTriggerElmHandlers: Function[] | undefined

    constructor (triggerElmSelector: string, pathName: string | string[], itemKey: string, extraTriggerElmHandlers: Function[] | undefined, option: activationRepCheckOptions ) {
        super(pathName, itemKey, undefined, option)
        this.extraTriggerElmHandlers = extraTriggerElmHandlers
        this.triggerElm = document.querySelector(triggerElmSelector)
        this.initListenToTriggerElm('click')
    }

    // inits
    private initListenToTriggerElm (action: string) {
        const handlersArr: Function[] = []
        handlersArr.push(this.triggerElmHandler)
        if(this.extraTriggerElmHandlers){
            this.extraTriggerElmHandlers.forEach((fn)=>{
                handlersArr.push(fn)
            })
        }
        if(this.triggerElm && this.matchingUrl){
            this.listenElement(this.triggerElm, [...handlersArr], action, [this.triggerElm])
        }
    }

    // checks
    // handlers
    private triggerElmHandler(e: Event, triggerElm: HTMLElement){
        this.saveStorageObject(this.itemKey, this.newStorageObj)
    }

    // helper handlers
    private listenElement(elm: HTMLElement, handlers: Function[], action: string, arg?: any[]) {

        elm.addEventListener(action, (e: Event) => {
            handlers.forEach((fn) => {
                if(arg){
                    fn.apply(this, [e, ...arg])
                }else{
                    fn.apply(this, [e])
                }
            })
        }, { passive: true }
        );
    }
}
class pageLoadsRepCheck extends activationRepCheck {
    constructor (pathName: string | string[], itemKey: string, option: activationRepCheckOptions ) {
        super(pathName, itemKey, undefined, option)
        this.initSaveStorageObjOnMatchingPage()
    }

    // init
    initSaveStorageObjOnMatchingPage (){
        if(this.matchingUrl){
            this.saveStorageObject(this.itemKey, this.newStorageObj)
        }
    }
}

// const buttonRepCheck = new elmClicksRepCheck('abc', '/', 'test', undefined, {activationRepClearanceDays: 1})
// const homePageLoadCheck = new pageLoadsRepCheck('/', 'homePageLoadingRecord', {activationRepClearanceDays: 1})
