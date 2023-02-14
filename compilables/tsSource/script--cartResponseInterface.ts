interface ParsedCartResponse{
    token: string;
    note?: string | null;
    attributes: object;
    original_total_price: number;
    total_price: number;
    total_discount: number;
    total_weight: number;
    item_count: number;
    items: any[];
    requires_shipping: boolean;
    currency: string;
    items_subtotal_price: number;
    cart_level_discount_applications: any[]
}

class CartResponseInterface {
    private readonly originalTotalPrice: number;
    private readonly totalPrice: number;
    private readonly totalDiscount: number;
    private readonly itemCount: number;
    private readonly items: {}[];
    private readonly itemSubtotalPrice: number;
  
    constructor(object: ParsedCartResponse) {
      this.originalTotalPrice = object.original_total_price;
      this.totalPrice = object.total_price;
      this.totalDiscount = object.total_discount;
      this.itemCount = object.item_count;
      this.items = object.items;
      this.itemSubtotalPrice = object.items_subtotal_price;
    }
  
    public getOriginalTotalPrice(): number {
      return this.originalTotalPrice;
    }
  
    public getTotalPrice(): number {
      return this.totalPrice;
    }
  
    public getTotalDiscount(): number {
      return this.totalDiscount;
    }
  
    public getItemCount(): number {
      return this.itemCount;
    }
  
    public getItems(): {}[] {
      return this.items;
    }
  
    public getItemSubtotalPrice(): number {
      return this.itemSubtotalPrice;
    }
  }
  