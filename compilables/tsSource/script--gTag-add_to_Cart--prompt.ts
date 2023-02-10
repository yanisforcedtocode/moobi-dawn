// <!-- GA4 data layer -->
  const promptA2CBtns:NodeListOf<HTMLElement> = document.querySelectorAll(".promptBuyButton")
  console.log(promptA2CBtns)
  promptA2CBtns.forEach((btn)=>{
    btn.addEventListener("click", function () {
      const itemDataNodes:NodeListOf<HTMLElement> = document.querySelectorAll('.promptProduct--listItem')
      const itemDataArr:{
        id: string | undefined,
        img: string | undefined,
        url: string | undefined,
        price: string | undefined,
        caprice: string | undefined,
        title: string | undefined,
        varid: string | undefined}[] = []
      itemDataNodes.forEach((node)=>{
        const dataObj = {
          id: node.dataset.productid,
          img: node.dataset.productimg,
          url: node.dataset.producturl,
          price: node.dataset.price,
          caprice: node.dataset.compared_at_price,
          title: node.dataset.producttitle,
          varid: node.dataset.productvarid,
        }
        console.log(dataObj)
        itemDataArr.push(dataObj)
      })

      let totalPrice:number = 0
      itemDataArr.forEach((el)=>{
        let price:number = 0
        if(el.price)
        {
            price = parseFloat(el.price)}
        if(el.caprice){
            price = parseFloat(el.caprice)
        }
      })

      console.log(totalPrice)

      gtag("event",  "add_to_cart",{
      currency: "HKD",
      value: totalPrice,
      items: [
        {
          item_id: "meta.product.id",
          item_name: "meta.product.variants[0].name",
          currency: "HKD",
          index: 0,
          item_brand: "meta.product.vendor",
          item_category: "meta.product.type",
          item_variant: "variantName",
          price: "parseFloat(getDOMPrice(priceGroup))",
          quantity: 1,
          item_list_name: "product--prompt"
        }
      ]
    })
    console.log('prompt tag fired')
    })
  })
