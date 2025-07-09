import Collection = require('../util/Collection');
import Promotion = require('./Promotion');
import ShippingMethod = require('../order/ShippingMethod');
import Product = require('../catalog/Product');
import PaymentCard = require('../order/PaymentCard');
import PaymentMethod = require('../order/PaymentMethod');

type SORT_BY_EXCLUSIVITY = 1;
type SORT_BY_START_DATE = 2;
/**
 * PromotionPlan represents a set of Promotion instances and is used to display active or upcoming promotions on storefront pages, or to pass it to the PromotionMgr to calculate a DiscountPlan and subsequently apply discounts to a line item container. Instances of the class are returned by the PromotionMgr.getActivePromotions(), PromotionMgr.getActiveCustomerPromotions() and PromotionMgr.getUpcomingPromotions(Number).
PromotionPlan provides methods to access the promotions in the plan and to remove promotions from the plan. All methods which return a collection of promotions sort them by the following ordered criteria:

 1. Exclusivity: GLOBAL exclusive promotions first, followed by CLASS exclusive promotions, and NO exclusive promotions last.
 2. Rank: sorted ascending
 3. Promotion Class: PRODUCT promotions first, followed by ORDER promotions, and SHIPPING  promotions last.
 4. Discount type: Fixed price promotions first, followed by free, amount-off, percentage-off, and bonus product promotions last.
 5. Best discount: Sorted descending. For example, 30% off comes before 20% off.
 6. ID: alphanumeric ascending.

 See Also:
PromotionMgr
 */

declare class PromotionPlan {
  /**
   *     Constant indicating that a collection of promotions should be sorted first by exclusivity, then rank, promotion class, etc. See class-level javadoc for details. This is the default sort order for methods that return a collection of promotions.
   */
  static readonly SORT_BY_EXCLUSIVITY: SORT_BY_EXCLUSIVITY;

  /**
   *     Constant indicating that a collection of promotions should be sorted by start date ascending. If there is no explicit start date for a promotion the start date of its containing Campaign or AB-test is used instead. Promotions without a start date are sorted before promotions with a start date in the future and after promotions with a start date in the past. In case two promotion assignments have the same start date, they are sorted by their ID.
   */
  static readonly SORT_BY_START_DATE: SORT_BY_START_DATE;

  private constructor();

  /**
     *     Returns all order promotions contained in this plan.
    @Returns The sorted collection of order promotions contained in the promotion plan.
     */
  getOrderPromotions(): Collection<Promotion>;

  /**
     *
        Returns the order promotions explicitly associated to the specified discounted payment card.
        This method is usually used to display order promotions along with payment card choices.


    @param paymentCard Discounted payment card
    @returns The sorted collection of order promotions associated with the specified payment card.
     */
  getPaymentCardPromotions(paymentCard: PaymentCard): Collection<Promotion>;

  /**
     *
    Returns the order promotions explicitly associated to the specified discounted payment method.
    This method is usually used to display order promotions along with payment method choices.


    @param paymentMethod Discounted payment method
    @returns The sorted collection of order promotions associated with the specified payment method.
     */
  getPaymentMethodPromotions(paymentMethod: PaymentMethod): Collection<Promotion>;

  /**
     * Returns all product promotions contained in this plan.
        @returns The sorted collection of product promotions contained in the promotion plan.
     */
  getProductPromotions(): Collection<Promotion>;

  /**
     * Returns the promotions related to the specified product.
    The method returns all promotions where the product is either a qualifying product, or a discounted product, or both.It also returns promotions where the specified product is a bonus product.
    This method is usually used to display product promotions on a product details page.

    If a master product is passed, then this method will return promotions which are relevant for the master itself or at least one of its variants.


    @param product Product associated with promotion
    @returns The sorted collection of promotions related to specified discounted product.
     */
  getProductPromotions(product: Product): Collection<Promotion>;

  /**
    Returns the product promotions for which the specified product is a discounted(and possibly also a qualifying) product.It also returns promotions where the specified product is a bonus product.
    This method is usually used to display product promotions on a product details page when separate callout messages are defined depending on if the product is a qualifying or discounted product for the promotion.

        If a master product is passed, then this method will return promotions for which the master product itself or at least one of its product's variants is a discounted product.


    @param product The discounted product.
    @returns Product promotions related to the specified discounted product.
     */
  getProductPromotionsForDiscountedProduct(product: Product): Collection<Promotion>;

  /**
     *
    Returns the product promotions for which the specified product is a qualifying but NOT a discounted product.
    This method is usually used to display product promotions on a product details page when separate callout messages are defined depending on if the product is a qualifying or discounted product for the promotion.

        If a master product is passed, then this method will return promotions for which the master product itself or at least one of its product's variants is a qualifying product.


    @param product The qualifying product.
    @returns Product promotions related to the specified qualifying product.
     */
  getProductPromotionsForQualifyingProduct(product: Product): Collection<Promotion>;

  /**
     * Returns all promotions contained in this plan sorted by exclusivity.
        @returns The sorted collection of promotions contained in the promotion plan.
     */
  getPromotions(): Collection<Promotion>;

  /**
     *
    Returns all promotions contained in this plan sorted according to the specified sort order. If the passed sort order is invalid, then the returned promotions will be sorted by exclusivity.

    @param sortOrder - the sort order to use. Must be SORT_BY_EXCLUSIVITY or SORT_BY_START_DATE. If an invalid value is passed, SORT_BY_EXCLUSIVITY is used.
    Returns:
    The sorted collection of promotions contained in the promotion plan.
     */
  getPromotions(sortOrder: SORT_BY_EXCLUSIVITY | SORT_BY_START_DATE): Collection<Promotion>;

  /**
     *     Returns all shipping promotions contained in this plan.
     @returns The sorted collection of shipping promotions contained in promotion plan.
     */
  getShippingPromotions(): Collection<Promotion>;

  /**
     *     Returns the shipping promotions related to the specified discounted shipping method, i.e. the returned promotions apply a discount on the specified shipping method.
        This method is usually used to display shipping promotions along with shipping methods.


        @param shippingMethod - Discounted shipping method
        @returns The sorted collection of shipping promotions with specified method as discounted method.
     */
  getShippingPromotions(shippingMethod: ShippingMethod): Collection<Promotion>;

  /**
     *     Remove promotion from promotion plan.
    Please note that this is the only way to remove promotions from the plan, i.e. removing promotions from the collections returned by methods such as getProductPromotions() has no effect on the promotion plan.


     * @param promotion Promotion to remove from promotion plan
     */
  removePromotion(promotion: Promotion): void;
}

export = PromotionPlan;
