// class ProductImageControls{
//     constructor(thumbnailHolderClass, thumbnailimgClass, mainImgClass, leftClass, rightClass, blockClass, pagClass, activePagClass, inputClass, variantDataClass){
//         this.inputClass = inputClass
//         this.pagClass = pagClass
//         this.activePagClass = activePagClass
//         this.thumbnailimgClass = thumbnailimgClass
//         this.thumbnailHolderClass = thumbnailHolderClass
//         this.mainImgClass = mainImgClass
//         this.leftClass = leftClass
//         this.rightClass = rightClass
//         this.blockClass = blockClass
//         this.variantDataClass = variantDataClass
//         this.mainImg = document.querySelector(`.${this.mainImgClass}`)
//         this.thumbnailHolder = document.querySelectorAll(`.${this.thumbnailHolderClass}`)
//         this.thumbnails = document.querySelectorAll(`.${this.thumbnailimgClass}`)
//         this.pags = document.querySelectorAll(`.${this.pagClass}`)
//         this.lButton = document.querySelector(`.${this.leftClass}`)
//         this.rButton = document.querySelector(`.${this.rightClass}`)
//         this.variantInputs = document.querySelectorAll(`.${this.inputClass}`)
//         this.variantData = document.querySelectorAll(`.${this.variantDataClass}`)
//         this.closeOverlay = ""
//         this.zoomOverlay = ""
//         this.mainImgContainer = document.querySelector(".product-image-block__main-container")
//         this.initState = {
//             imageNumber : 0,
//             srcset : [],
//             currentImage : null,
//             variantsrcset: {},
//             isOverlayOpen: false
//             //mainImgSrc: null,
//         }
//         this.currentState = this.initState
//     }
//     setInitState(){
//         // total images, current image index
//         this.initState.imageNumber = this.thumbnails.length
//         this.thumbnails.forEach((el)=>{
//             this.initState.srcset.push(el.srcset)})
//         this.initState.currentImage = this.checkCurrentImg(this.mainImg.srcset)
//         if(this.variantData.length>0){
//             this.variantData.forEach((el)=>{
//                 // 'Liquid Error' is a shopify error returned on HTML when there is no variant images, but variant ID exists
//                 if(el.dataset.variid&&el.dataset.srcset&&!el.dataset.srcset.includes('Liquid error')){
//                     this.initState.variantsrcset[el.dataset.variid] = el.dataset.srcset
//                 }
//             })
//         }
//         // this.setCurrentState(this.initState.currentImage)
//         this.currentState.currentImage = this.initState.currentImage
//         this.evoke()
//     }
//     // event listeners
//     initLRControls(){
//         const self = this
//         this.rButton.addEventListener('click', (e)=>{
//             e.preventDefault()
//             self.setCurrentState(self.currentState.currentImage + 1)
//         }, false)
//         this.lButton.addEventListener('click', (e)=>{
//             e.preventDefault()
//             self.setCurrentState(self.currentState.currentImage - 1)
//         }, false)
//         }
//     initPickImg(){
//         const self = this
//         this.thumbnails.forEach((el, ind)=>{
//             el.addEventListener('click', (e)=>{
//                 self.setCurrentState(ind)
//             }, false)
//         }) 
//     }
//     initVariantInput(){
//         const self = this
//         if(this.variantInputs && this.variantInputs.length > 0){
//             // console.log(this.variantInputs)
//             this.variantInputs.forEach((el, ind)=>{
//                 el.addEventListener('change', (e)=>{
//                     setTimeout(function(){self.setCurrentImgVariant(window.location.href)}, 400)     
//                 })
//             })
//         }
//     }
//     initThumbnailSlider(){
//         const self = this
//         let touchdownclientX = 0
//         this.thumbnailHolder.forEach((el)=>{
//             el.addEventListener("touchstart", (e) => {
//                 touchdownclientX = e.touches[0].clientX;
//               });
//         }, false)
//         this.thumbnailHolder.forEach((el)=>{
//             el.addEventListener("touchend", (e) => {    
//                 let touchendclientX = e.changedTouches[0].clientX;
//                 //move imgs according to displacementX
//                 if (
//                   touchendclientX < touchdownclientX
//                 ){
//                     self.setCurrentState(self.currentState.currentImage + 1)
//                 } else if (touchendclientX > touchdownclientX) {
//                     self.setCurrentState(self.currentState.currentImage - 1)
//                 } else {
//                   return;
//                 }
//               }, false);
//         })  
//     }
//     initZoomImage(target1, target2, self){
//         // self.setOverIsOpen(true, self)
//         // self.renderOverlay(target2, self)
//         const handler = ()=>{
//             self.setOverIsOpen(true, self)
//             self.renderOverlay(target2, self)
//         }
//         target1.addEventListener("click", (e)=>{
//             handler()
//         })
//     }
//     initZoomClose(target1, target2, self){
//         const body = document.querySelector("body")
//         const currentState = self.currentState
//         const handler = (target = target2, state = currentState)=>{
//             if(state.isOverlayOpen){
//                 self.setOverIsOpen(false, self)
//             }
//             self.offOverlay(target)
//         }
//         target1.addEventListener("click", (e)=>{
//             handler()
//         })
//         self.zoomOverlay.addEventListener("click", (e)=>{
//             let path = Array.from(e.path)
//             path = path.filter((el)=>{
//                 return el.className === "productImgOverlay__section__imagecard__container"
//             })
//             if(path.length===0){
//                 handler()
//             }
//         })
//     }
//     // external triggers
//     async externalTriggers(currentImg){
//         try{
//             // console.log('external trigger' + currentImg)
//             if(gTagHandler_external){
//                 gTagHandler_external("productPage_engagement", [
//                   { key: "title", value: currentImg },
//                   { key: "type", value: "productPage_imageSelect" },
//                 ],
//                 {dev: false});
//             }
//         }catch(err){
//             console.log(err)
//         }
//     }

//     // setState
//     setCurrentState(ind){
//         // fall back index = 0
//         const index = ind||0
//         if(ind>this.initState.imageNumber - 1 || ind<0){
//             return
//         } else{
//             this.currentState.currentImage = index
//             this.evoke()
//             this.externalTriggers(index)
//         }
//     }
//     setCurrentImgVariant(href){
//         let imgInd = 'idk'
//         const variantId = href.slice(href.indexOf('?variant=')+9)
//         if(this.initState.variantsrcset[variantId]){
//             this.setCurrentState(this.checkCurrentImg(this.initState.variantsrcset[variantId]))
//         }
//     }
//     setOverIsOpen(boolean, self){
//         if(typeof boolean === 'boolean'){
//             self.currentState.isOverlayOpen = boolean
//         }
//     }
//     // handlers
//     checkCurrentImg(srcset){
//         let imgInd = 'idk'
//         this.initState.srcset.forEach((el, ind)=>{
//             if(el.trim().replace(/(\r\n|\n|\r)/gm, "") === srcset.trim().replace(/(\r\n|\n|\r)/gm, ""))
//             {imgInd =  ind}
//         })
//         return imgInd
//     }
//     preventImgSelection(){
//         const target = document.querySelector(`.${this.blockClass}`)
//         target.addEventListener('mousedown', function (event) {
//             if (event.detail > 1) {
//               event.preventDefault();
//             }
//           }, false);
//     }
//     createOverlay(){
//         const html = document.querySelector("html");
//         const overlay = `<div class="productImgOverlay__section">
//                         <div class="productImgOverlay__section__overlay"></div>
//                         <div class="productImgOverlay__section__imagecard">
//                         <div class="productImgOverlay__section__imagecard__container">
//                             <div class="productImgOverlay__section__imagecard__container__close" id = "closeImgOverlay">
//                             <i class="far fa-window-close"></i>
//                             </div>
//                             <div class="productImgOverlay__section__imagecard__imgWrapper">
//                             <img class = "productImgOverlay__section__imagecard__imgWrapper__img lazyload">
//                             </div>
//                         </div>
//                         </div>
//                         </div>`;
//         if(window.innerWidth>=600){
//             html.insertAdjacentHTML("afterbegin", overlay);
//             this.closeOverlay = document.querySelector("#closeImgOverlay")
//             this.zoomOverlay = document.querySelector(".productImgOverlay__section")
//         }
//     }
//     // effectors
//     setMainImgSrc(currentImg){
//         this.mainImg.srcset  = this.initState.srcset[currentImg]
//         return this.mainImg.srcset
//     }
//     moveSlide(currentImg){
//        this.thumbnailHolder.forEach((el)=>{
//         el.style.transform = window.innerWidth<600?`translateX(${-100*currentImg}%)`:`translateX(${-100*currentImg}%)`
//        })
//     }
//     setPagActive(currentImg){
//         this.pags.forEach((el)=>el.classList.remove(this.activePagClass))
//         this.pags[currentImg].classList.add(this.activePagClass)
//     }
//     offOverlay = (target)=>{
//         target.style.opacity = '0%';
//         setTimeout(() => {
//             target.style.display = 'none'
//         }, 300);
//     }
//     renderOverlay = (target, self)=>{
//         const isOpen = self.currentState.isOverlayOpen
//         const srcset = self.currentState.srcset[self.currentState.currentImage]
//         const img = target.querySelector("img")
//         if(isOpen){
//             // renderOverlayVisible
//             target.style.display = "flex"
//             setTimeout(() => {
//                 target.style.opacity = "100%"                
//             }, 100);
//             // renderOverlay to currentImg
//             img.srcset = srcset            
//         }
//         if(!isOpen){
//             // renderOverlay invisible
//             return
//         }
//     }
//     evoke(currentState = this.currentState){
//         this.setMainImgSrc(currentState.currentImage)
//         this.moveSlide(currentState.currentImage)
//         this.setPagActive(currentState.currentImage)
//     }

//     // use state to detect current image compared to the array of images 
//     // use state to control style changes
//     init(){
//         const self = this
//         this.createOverlay()
//         this.setInitState()
//         this.initLRControls()
//         this.preventImgSelection()
//         this.initPickImg()
//         this.initVariantInput()
//         this.initThumbnailSlider()
//         if(window.innerWidth >= 600){
//             this.initZoomClose(self.closeOverlay, self.zoomOverlay, self)
//             this.initZoomImage(self.mainImgContainer, self.zoomOverlay, self)
//         }
//     }
// }

// const imageControlsParams = [
//   thumbnailholderClass,
//   thumbnailimgClass,
//   maincontainerImgClass,
//   thumbnailLeftClass,
//   thumbnailRightClass,
//   productImgBlockClass,
//   pagClass,
//   pagActiveClass,
//   variantInputClass,
//   variantDataClass
// ];
// const imageControls = new ProductImageControls(...imageControlsParams)
// imageControls.init()
