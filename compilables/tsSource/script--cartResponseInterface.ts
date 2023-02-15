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
    private _originalTotalPrice: number;
    private _totalPrice: number;
    private _totalDiscount: number;
    private _itemCount: number;
    private _items: {}[];
    private _itemSubtotalPrice: number;
    private _cart_level_discount_applications: any[]
  
    constructor(object: ParsedCartResponse) {
      this._originalTotalPrice = object.original_total_price;
      this._totalPrice = object.total_price;
      this._totalDiscount = object.total_discount;
      this._itemCount = object.item_count;
      this._items = object.items;
      this._itemSubtotalPrice = object.items_subtotal_price;
      this._cart_level_discount_applications = object.cart_level_discount_applications
    }
  
    get originalTotalPrice(): number {
      return this._originalTotalPrice;
    }
  
    get totalPrice(): number {
      return this._totalPrice;
    }
  
    get totalDiscount(): number {
      return this._totalDiscount;
    }
  
    get itemCount(): number {
      return this._itemCount;
    }
  
    get items(): {}[] {
      return this._items;
    }
  
    get itemSubtotalPrice(): number {
      return this._itemSubtotalPrice;
    }

    get cart_level_discount_applications():any[] {
      return this._cart_level_discount_applications
    }
  }
  