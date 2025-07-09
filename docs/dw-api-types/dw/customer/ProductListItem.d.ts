import ExtensibleObject = require('../object/ExtensibleObject');
import ProductList = require('./ProductList');
import Product = require('../catalog/Product');
import ProductOptionModel = require('../catalog/ProductOptionModel');
import Quantity = require('../value/Quantity');
import ProductListItemPurchase = require('./ProductListItemPurchase');
import Collection = require('../util/Collection');
import CustomAttributes = require('../object/CustomAttributes');

declare global {
  module ICustomAttributes {
    interface ProductListItem extends CustomAttributes {}
  }
}

declare class ProductListItem extends ExtensibleObject<ICustomAttributes.ProductListItem> {
  static TYPE_GIFT_CERTIFICATE: number;
  static TYPE_PRODUCT: number;

  ID: string;
  list: ProductList;
  priority: number;
  product: Product;
  productID: string;
  productOptionModel: ProductOptionModel;
  public: boolean;
  purchasedQuantity: Quantity;
  purchasedQuantityValue: number;
  purchases: Collection<ProductListItemPurchase>;
  quantity: Quantity;
  quantityValue: number;
  type: number;

  createPurchase(quantity: number, purchaserName: string): ProductListItemPurchase;
  getID(): string;
  getList(): ProductList;
  getPriority(): number;
  getProduct(): Product;
  getProductID(): string;
  getProductOptionModel(): ProductOptionModel;
  getPurchasedQuantity(): Quantity;
  getPurchasedQuantityValue(): number;
  getPurchases(): Collection<ProductListItemPurchase>;
  getQuantity(): Quantity;
  getQuantityValue(): number;
  getType(): number;
  isPublic(): boolean;
  setPriority(priority: number): void;
  setProductOptionModel(productOptionModel: ProductOptionModel): void;
  setPublic(flag: boolean): void;
  setQuantityValue(value: number): void;
}

export = ProductListItem;
