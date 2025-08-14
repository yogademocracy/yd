'use strict';

var utilHelpers = require('*/cartridge/scripts/helpers/utilHelpers');
var somPreferences = require('*/cartridge/config/somPreferences');

/**
 * Create a SOM totals model
 * @constructor
 * @classdesc class that represents a total object
 *
 * @param  {Object} somApiOrderSummary - OrderSummaryObject from SOM API in JSON format
 * @param {string} currencyCode - currency code of the order
 */
function SomTotals(somApiOrderSummary, currencyCode) {
    this.isPendingTotal = false;
    this.grandTotal = '-';
    this.subTotal = '-';
    this.shipping = '-';
    this.shippingDiscount = '-';
    this.productDiscount = '-';
    this.tax = '-';
    this.totalQuantity = 0;

    if (somApiOrderSummary && somApiOrderSummary.OrderItemSummaries) {
        var tax = somApiOrderSummary.TotalTaxAmount;
        // subTotal is the amount exclude tax and shipping cost
        var subTotal = somApiOrderSummary.TotalAdjustedProductAmount;
        var shipping = somApiOrderSummary.TotalAdjustedDeliveryAmount;
        var grandTotal = somApiOrderSummary.GrandTotalAmount;
        var shippingDiscount = somApiOrderSummary.TotalDeliveryAdjDistAmount;
        var productDiscount = somApiOrderSummary.TotalProductAdjDistAmount;
        var isPendingTotal = false;
        var isUpdatedTotal = false;
        var totalQty = 0;

        somApiOrderSummary.OrderItemSummaries.records.forEach(function (orderItemSummary) {
            if (orderItemSummary.Type !== somPreferences.orderItemSummaryTypeDeliveryCharge) {
                totalQty += parseInt(orderItemSummary.Quantity, 10);
            }

            // Look for any Return Initiated items that haven't yet been returned and adjust totals accordingly
            if (orderItemSummary.QuantityReturnInitiated > orderItemSummary.QuantityReturned) {
                isPendingTotal = true;

                // If it's a shipping charge and the shipping reduction flag is set
                // to true, reduce the shipping and grand totals.
                if ((orderItemSummary.Type === somPreferences.orderItemSummaryTypeDeliveryCharge) && somPreferences.returnShippingReductionFlag) {
                    shipping -= orderItemSummary.TotalPrice;
                    grandTotal -= orderItemSummary.TotalPrice;
                }

                // Prorate subtotal by number of pending items
                var subTotalAdjustment = ((orderItemSummary.QuantityReturnInitiated - orderItemSummary.QuantityReturned) / orderItemSummary.Quantity) * orderItemSummary.TotalPrice;
                subTotal -= subTotalAdjustment;

                // Prorate tax by the number of products pending, but not yet received
                var taxAdjustment = ((orderItemSummary.QuantityReturnInitiated - orderItemSummary.QuantityReturned) / orderItemSummary.Quantity) * orderItemSummary.TotalTaxAmount;
                tax -= taxAdjustment;

                // Subtract grand total by pending item total and tax adjustment
                grandTotal -= taxAdjustment;
                grandTotal -= subTotalAdjustment;
            }

            // Look for any Returned items and indicate with Updated flag.
            if (orderItemSummary.QuantityReturned > 0) {
                isUpdatedTotal = true;
            }
        });
        this.totalQuantity = totalQty;
        this.isPendingTotal = isPendingTotal;
        this.isUpdatedTotal = isUpdatedTotal;

        this.grandTotal = utilHelpers.formatMoney(grandTotal, currencyCode);
        this.subTotal = utilHelpers.formatMoney(subTotal, currencyCode);
        this.tax = utilHelpers.formatMoney(tax, currencyCode);
        this.shipping = utilHelpers.formatMoney(shipping, currencyCode);
        this.shippingDiscount = utilHelpers.formatMoney(shippingDiscount, currencyCode);
        this.productDiscount = utilHelpers.formatMoney(productDiscount, currencyCode);
    }
}

module.exports = SomTotals;
