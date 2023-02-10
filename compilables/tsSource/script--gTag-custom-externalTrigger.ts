"use strict";
// a general dataLayer push to be called by external triggers

type ExternalOptions= {
    dev?: true | false | undefined
}

const gTagHandler_external = (eventName: string, types: {key:string, value:string}[], options: ExternalOptions)=>{
    if(dataLayer){
        const dataLayerObj: { 
            event: string,
            [key: string]: string,
         } = {
            event: ''
         }   
         const dataLayerObjNull: { 
            event: null,
            [key: string]: null,
         } = {
            event: null
         }
    if(eventName){
        dataLayerObj.event = eventName
    }

    types.forEach((el)=>{
        if(el.key && el.value !== undefined){
            dataLayerObj[el.key] = el.value
            dataLayerObjNull[el.key] = null
        }

    })
    
    dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    dataLayer.push(dataLayerObj);
    dataLayer.push(dataLayerObjNull) // Clear the keys defined by this push.
    if(options?.dev){
        // console.log(dataLayerObj)
    }
}
}


