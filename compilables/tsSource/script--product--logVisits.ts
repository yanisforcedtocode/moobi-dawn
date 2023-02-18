class LogProductVisit{
    logLimit: number
    prevLocalObj?: {[key: string]: number}
    intervalMs: number
    initState:{
        initTime: number,
        key: string,
        isPdtPage: boolean,
        productData: {id:string, handle: string, tagsArray: string[]}
    }
    
    constructor(n: number, ms: number){
        this.logLimit = n - 1
        this.intervalMs = ms
        this.initState = {
            initTime: this.getCurrentTime(),
            key: 'moobiPdtLog',
            isPdtPage: this.checkIsPdtPage(window.location.href),
            productData: this.getProductMeta()
        }
        this.initProductLogging()
    }

    // init
    initProductLogging(){
        if(this.initState.isPdtPage){
            this.readLocalObj(this.initState.key)
            // if(this.prevLocalObj){
            //     this.prevLocalObj = this.trimPrevLocalObj(this.prevLocalObj, this.logLimit)
            // }
            this.initInterval(this.intervalLoggingHandler)
        }else{
            console.log("Product logging should not be enabled on a non-product page")
            return 
        }
    } 

    // handlers
    getProductMeta(){
        const metaElm = document.querySelector('[name = "snippet_product_metaInfo"]') as HTMLElement
        const id = this.getPdtId(metaElm)
        const handle = this.getPdtHandle(metaElm)
        const tagsArray = this.getPdtTags(metaElm)
        return  {
            id,handle,tagsArray
        }
    }

    createNewLocalObj(){
        const nameKey = this.createNameKey()
        const prevLapse = this.getPrevLapse(nameKey)
        const newLineItem = this.createLogLineItem(prevLapse, nameKey)
        const newLocalObj = this.combinePrevCurrentLocalObj(newLineItem)
        return newLocalObj
    }

    intervalLoggingHandler() {
        let currentLocalObj = this.createNewLocalObj()
        currentLocalObj = this.trimPrevLocalObj(currentLocalObj, this.logLimit)
        const curretnLocalStr = JSON.stringify(currentLocalObj)
        localStorage.setItem(this.initState.key, curretnLocalStr)
    }


    // product page check
    checkIsPdtPage(url: string){
        return url.includes('/products/')
    }

    // get product meta
    getPdtHandle(metaElm: HTMLElement){
        const handle = metaElm.dataset.product_handle!
        return handle
    }
    getPdtId(metaElm: HTMLElement){
        const id = metaElm.dataset.product_id!
        return id
    }
    getPdtTags(metaElm: HTMLElement){
        const tagsString = metaElm.dataset.product_tags!
        const tagsArray = tagsString.split(',')
        return tagsArray
    }
    // get current time
    getCurrentTime(){
            const currentTime = Date.now()
            return currentTime
    }
    // get time difference
    getLapse(){
        // const lapse = this.getCurrentTime() - this.initState.initTime
        const lapse = this.intervalMs
        return lapse
    }
    getPrevLapse(nameKey: string) {
        if (this.prevLocalObj && this.prevLocalObj[nameKey]) {
            return this.prevLocalObj[nameKey]
        } else {
            return 0
        }
    }

    // create logLIineItem
    createNameKey(){
            const productData = this.initState.productData
            const nameKey = productData.id + '_' + productData.handle + '_' + productData.tagsArray.join(',')
            return nameKey
    }
    createLogLineItem(prevLapse: number, nameKey: string){
            const newLineItem = {
                [nameKey]: prevLapse + this.getLapse()
            }
            return newLineItem
    }
    combinePrevCurrentLocalObj(newLineItem: {[x:string]:number}){
        if(this.prevLocalObj){
            const currentLocalobj = Object.assign(this.prevLocalObj, newLineItem)
            return currentLocalobj
        }else{
            return newLineItem
        }
    }

    // read/ write local storage
    readLocalObj(key: string){
        const string = localStorage.getItem(key)
        if(string){
            const object = JSON.parse(string)
            this.prevLocalObj = object
    } else return false
    }

    trimPrevLocalObj(object:{[x: string]: number}, n: number){
        let entries = Object.entries(object)
        entries.sort(function(a, b){
            return b[1] - a[1]
        })
        const newObject:{[x: string]: number} = {}
        entries.forEach((el, ind)=>{
            if(ind<n){
                newObject[el[0]] = el[1]
            }
        })
        return newObject
    }

    // setinterval
    initInterval(fn: Function){
        const self = this
        const updateTime1s = setInterval(fn.bind(self)
        ,this.intervalMs)
    }
    
}
const logProductVisit = new LogProductVisit(10, 1000)
