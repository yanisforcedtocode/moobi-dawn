
interface CollectionProductCardData {
    title: string;
    img: string;
    price: string;
    compared_at_price: string | null;
    handle: string
}

class Collection_list_controller {
    collectionCardNode: NodeListOf<HTMLElement>
    collectionTitle: HTMLElement
    collectionDescription: HTMLElement
    collectionImage: HTMLImageElement
    collectionButton: HTMLLinkElement
    brandCardNode: NodeListOf<HTMLElement>
    productCardNode: NodeListOf<HTMLElement>
    widthTheshold: number
    constructor() {
        this.collectionCardNode = document.querySelectorAll('.collection_brand_card')! as NodeListOf<HTMLElement>
        this.collectionTitle = document.getElementById('collection_card_title')!
        this.collectionDescription = document.getElementById('collection_card_description')!
        this.collectionButton = document.getElementById('collection_button')! as HTMLLinkElement
        this.collectionImage = document.getElementById('collection_card_image')! as HTMLImageElement
        this.productCardNode = document.querySelectorAll('.product_card')
        this.brandCardNode = document.querySelectorAll('.collection_brand_card_content')
        this.widthTheshold = 780
        this.initCollectionControl()
    }
    // init
    async initCollectionControl() {
        if (!this.checkScreenWidth(this.widthTheshold)) {
            return
        }
        this.ListenToBrandCards(this.brandCardHandler.bind(this))
    }

    // Set EventListener
    ListenToBrandCards(brandCardHandler: Function) {
        this.brandCardNode.forEach((el) => {
            el.addEventListener('click', (event: Event) => {
                event.preventDefault()
                if (event.target && event.target instanceof HTMLElement) {
                    const brandCard = event.target.closest('.collection_brand_card')
                    if (brandCard && brandCard instanceof HTMLElement) {
                        this.brandCardHandler(event, brandCard)
                    }
                }
            })
        })
    }

    // Handler
    brandCardHandler(event: Event, brandCard: HTMLElement) {
        const collectionId = this.getCollectionId(brandCard)
        const cardDataArray = this.getProductMetaInfo(collectionId)
        const brandData = this.getBrandMetaInfo(collectionId)
        this.renderProductCard(cardDataArray)
        this.renderCollectionCard(brandData)
    }


    // checks
    checkScreenWidth(threshold: number) {
        if (window.screen.width >= threshold) {
            return true
        }
        else {
            return false
        }
    }

    // DOM manipulation
    getCollectionId(brandCard: HTMLElement) {
        const collectionId = brandCard.dataset.collectionid as string
        return collectionId
    }

    getProductMetaInfo(collectionId: string) {
        const metaElm = document.querySelector(`[collectionid="${collectionId}"]`) as HTMLElement
        const metaData = metaElm.innerHTML
        return JSON.parse(metaData) as CollectionProductCardData[]
    }

    getBrandMetaInfo(collectionId: string) {
        const metaElm = document.querySelector(`[collectionid="${collectionId}"]`) as HTMLElement
        const title = metaElm.dataset.title!
        const image = metaElm.dataset.image!
        const handle = metaElm.dataset.handle!
        const description = metaElm.dataset.description!
        return { title, image, handle, description }
    }


    getProductCardElementObject(product_card: HTMLElement) {
        const titleElm = product_card.querySelector('.product_card_title')! as HTMLElement
        const priceElm = product_card.querySelector('.product_card_price')! as HTMLElement
        const compared_at_priceElm = product_card.querySelector('.product_card_comparedAtPrice')! as HTMLElement
        const linkElm = product_card.querySelector('a')!
        const imageElm = product_card.querySelector('img')!
        const productCard = titleElm.closest('.product_card') as HTMLElement
        const elementArray = { productCard, titleElm, priceElm, compared_at_priceElm, linkElm, imageElm }
        return elementArray
    }

    loadingImage(elm: HTMLImageElement[] | HTMLImageElement){
        if(Array.isArray(elm)){
            elm.forEach((el)=>{
                el.src = ""
                el.classList.add('imageSkeleton')
            })
        }else{
            elm.src = ""
            elm.classList.add('imageSkeleton')
        }

    }

    renderProductCard(productDataArray: CollectionProductCardData[]) {
        this.productCardNode.forEach((elm, ind) => {
            const elementObj = this.getProductCardElementObject(elm)
            if(productDataArray[ind]){
                elementObj.productCard.style.display = "block"
                elementObj.titleElm.innerText = productDataArray[ind].title
                elementObj.priceElm.innerText = productDataArray[ind].price
                elementObj.compared_at_priceElm.innerText = ""
                const compared_at_price = productDataArray[ind].compared_at_price
                if (compared_at_price) {
                    elementObj.compared_at_priceElm.innerText = compared_at_price
                }
                elementObj.linkElm.href = `/products/${productDataArray[ind].handle}`
                this.loadingImage(elementObj.imageElm)
                elementObj.imageElm.src = productDataArray[ind].img
            }else{
                elementObj.titleElm.innerText = ""
                elementObj.priceElm.innerText = ""
                elementObj.compared_at_priceElm.innerText = ""
                elementObj.compared_at_priceElm.innerText = ""
                elementObj.linkElm.href = ""
                elementObj.imageElm.src = ""
                elementObj.productCard.style.display = "none"
            }
        })
    }

    renderCollectionCard(brandData: {title: string, image: string, description: string, handle: string}){
        this.loadingImage(this.collectionImage)
        this.collectionTitle.innerText = brandData.title
        this.collectionDescription.innerText = brandData.description
        this.collectionButton.href = `/collections/${brandData.handle}`
        this.collectionButton.innerText = `進入${brandData.title}總目錄`
        this.collectionTitle.innerText = brandData.title
        this.collectionImage.src = brandData.image
    }

}


const collection_list_controller = new Collection_list_controller()