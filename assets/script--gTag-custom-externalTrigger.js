"use strict";
const gTagHandler_external = (eventName, types, options) => {
    if (dataLayer) {
        const dataLayerObj = {
            event: ''
        };
        const dataLayerObjNull = {
            event: null
        };
        if (eventName) {
            dataLayerObj.event = eventName;
        }
        types.forEach((el) => {
            if (el.key && el.value !== undefined) {
                dataLayerObj[el.key] = el.value;
                dataLayerObjNull[el.key] = null;
            }
        });
        dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        dataLayer.push(dataLayerObj);
        dataLayer.push(dataLayerObjNull); // Clear the keys defined by this push.
        if (options === null || options === void 0 ? void 0 : options.dev) {
            // console.log(dataLayerObj)
        }
    }
};
