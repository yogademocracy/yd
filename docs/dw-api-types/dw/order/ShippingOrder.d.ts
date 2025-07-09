import AbstractItemCtnr = require('./AbstractItemCtnr');
import Collection = require('../util/Collection');
import FilteringCollection = require('../util/FilteringCollection');
import TrackingInfo = require('./TrackingInfo');
import EnumValue = require('../value/EnumValue');
import Quantity = require('../value/Quantity');
import ShippingOrderItem = require('./ShippingOrderItem');
import OrderAddress = require('./OrderAddress');
import OrderItem = require('./OrderItem');
import Invoice = require('./Invoice');
import ShippingMethod = require('./ShippingMethod');

/**
 * A shipping order is used to specify items that should be shipped, and is typically exported to, and updated by a back-office warehouse management system.

An Order can have n shipping orders expressing how the order is to be shipped. The creation, export and update of shipping orders is largely handled by custom logic in scripts by implementing ShippingOrderHooks. Use method Order.createShippingOrder() for creation and add items using createShippingOrderItem(OrderItem, Quantity) - each item is related to an order item which in turn represents a product- or shipping- line item in the order.

A shipping order has a status calculated from its item status, one of

    - CONFIRMED - shipping order not yet exported, with 0 items, or all items in status CONFIRMED.
    - WAREHOUSE - shipping order exported, with all items in status WAREHOUSE.
    - SHIPPED - exported shipping order has been updated, with 1-n items in status SHIPPED and 0-n CANCELLED.
    - CANCELLED - exported shipping order has been updated, with all items in status CANCELLED.
 */

declare class ShippingOrder {
  /**
   * Sorting by item id. Use with method getItems() as an argument to method FilteringCollection.sort(Object).
   */
  static readonly ORDERBY_ITEMID: Object;

  /**
   * Sorting by the position of the related oder item. Use with method getItems() as an argument to method FilteringCollection.sort(Object).
   */
  static readonly ORDERBY_ITEMPOSITION: Object;

  /**
   * Unsorted , as it is. Use with method getItems() as an argument to method FilteringCollection.sort(Object).
   */
  static readonly ORDERBY_UNSORTED: Object;

  /**
   * Selects the product items. Use with method getItems() as an argument to method FilteringCollection.select(Object).
   */
  static readonly QUALIFIER_PRODUCTITEMS: Object;

  /**
   * Selects for the service items. Use with method getItems() as an argument to method FilteringCollection.select(Object).
   */
  static readonly QUALIFIER_SERVICEITEMS: Object;

  static readonly STATUS_CANCELLED: string;

  static readonly STATUS_CONFIRMED: string;
  static readonly STATUS_SHIPPED: string;
  static readonly STATUS_WAREHOUSE: string;

  /**
   * Returns null or the previously created Invoice.
   */
  readonly invoice: Invoice | null;

  /**
   * Returns null or the invoice-number.
   */
  invoiceNumber: string | null;

  /**
     * A filtering collection of the shipping order items belonging to the shipping order.

    This FilteringCollection could be sorted / filtered using:

        - FilteringCollection.sort(Object) with ORDERBY_ITEMID
        - FilteringCollection.sort(Object) with ORDERBY_ITEMPOSITION
        - FilteringCollection.sort(Object) with ORDERBY_UNSORTED
        - FilteringCollection.select(Object) with QUALIFIER_PRODUCTITEMS
        - FilteringCollection.select(Object) with QUALIFIER_SERVICEITEMS 
    */
  items: FilteringCollection<any>;

  /**
     * Gets the shipping date.

    Returns null if this shipping order is not yet shipped.
    */
  shipDate: Date | null;

  /**
     * The shipping address (optional, can be null).

    Note: the shipping address is not copied into the ShippingOrder but is a link to a OrderAddress held in the Order.
    */
  shippingAddress: OrderAddress;

  /**
     * The shipping method of the shipping order.

    Can be null.
    */
  readonly shippingMethod: ShippingMethod | null;

  /**
   * Gets the shipping order number.
   */
  readonly shippingOrderNumber: string;

  /**
     * Gets the status of this shipping order. The status is read-only and calculated from the item status. See class documentation for more details.
     * 
    The possible values are STATUS_CONFIRMED, STATUS_WAREHOUSE, STATUS_SHIPPED, STATUS_CANCELLED.
    */
  readonly status: EnumValue<string>;

  /**
   * Gets all tracking informations for this shipping order.
   */
  readonly trackingInfos: Collection<TrackingInfo>;

  private constructor();

  /**
   * Adds a tracking info to this shipping order with the given ID.
   * @param trackingInfoID
   */
  addTrackingInfo(trackingInfoID: string): TrackingInfo;

  /**
   * Creates a new Invoice based on this ShippingOrder.
   */
  createInvoice(): Invoice;

  /**
   * Creates a new Invoice based on this ShippingOrder.
   * @param invoiceNumber  the invoice-number to use
   */
  createInvoice(invoiceNumber: string): Invoice;

  /**
   * Create a ShippingOrderItem in the shipping order with the number shippingOrderNumber.
   * @param orderItem  the order item for which the shipping order item is to be created
   * @param quantity  the quantity for which the shipping order item will be created
   */
  createShippingOrderItem(orderItem: OrderItem, quantity: Quantity): ShippingOrderItem;

  /**
   * Create a ShippingOrderItem in the shipping order with the number shippingOrderNumber.
   * @param orderItem the order item for which the shipping order item is to be created
   * @param quantity the quantity for which the shipping order item will be created, not null
   * @param splitIfPartial the flag whether ProductLineItem should be split when requested quantity is less than ProductLineItem's quantity
   */
  createShippingOrderItem(orderItem: OrderItem, quantity: Quantity, splitIfPartial: boolean): ShippingOrderItem;

  /**
   * Returns null or the previously created Invoice.
   */
  getInvoice(): Invoice | null;

  /**
   * Returns null or the invoice-number.
   */
  getInvoiceNumber(): string;

  /**
   * A filtering collection of the shipping order items belonging to the shipping order.
   */
  getItems(): FilteringCollection<ShippingOrderItem>;

  /**
   * Gets the shipping date.
   */
  getShipDate(): Date;

  /**
   * Returns the shipping address (optional, can be null).
   */
  getShippingAddress(): OrderAddress | null;

  /**
   * Returns the shipping method of the shipping order.
   */
  getShippingMethod(): ShippingMethod;

  /**
   * Gets the shipping order number.
   */
  getShippingOrderNumber(): string;

  /**
   * Gets the status of this shipping order.
   */
  getStatus(): EnumValue<string>;

  /**
   * Gets a tracking info for this shipping order.
   * @param trackingInfoID
   */
  getTrackingInfo(trackingInfoID: string): TrackingInfo;
  /**
   * Gets all tracking informations for this shipping order.
   */
  getTrackingInfos(): Collection<TrackingInfo>;

  /**
   * Sets the shipping date.
   * @param date
   */
  setShipDate(date: Date): void;

  /**
   * Set a shipping address for the shipping order.
   * @param address  the shipping address
   */
  setShippingAddress(address: OrderAddress): void;

  /**
   * Set the id of shipping method.
   * @param shippingMethodID
   */
  setShippingMethodID(shippingMethodID: string): void;

  /**
     * Set a CONFIRMED shipping order (all items in status CONFIRMED) to status WAREHOUSE (all items in status WAREHOUSE).
    Note - this method is the only way to transition a shipping order from CONFIRMED to WAREHOUSE.
    */
  setStatusWarehouse(): void;
}

export = ShippingOrder;
