import Quantity = require('../value/Quantity');

declare class ProductAvailabilityLevels {
  backorder: Quantity;
  count: number;
  inStock: Quantity;
  notAvailable: Quantity;
  preorder: Quantity;

  getBackorder(): Quantity;
  getCount(): number;
  getInStock(): Quantity;
  getNotAvailable(): Quantity;
  getPreorder(): Quantity;
}

export = ProductAvailabilityLevels;
