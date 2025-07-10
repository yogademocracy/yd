'use strict';

/**
 * Create a SOM shipment model
 * @constructor
 * @classdesc class that represents a shipment object
 *
 * @param {Object} somApiShipment - Shipment from SOM API in JSON format
 */
function SomShipment(somApiShipment) {
    this.id = somApiShipment.Id;
    this.fulfillmentOrderId = somApiShipment.FulfillmentOrderId;
    this.shipToName = somApiShipment.ShipToName;
    this.status = somApiShipment.Status;
    this.trackingNumber = somApiShipment.TrackingNumber;
}
module.exports = SomShipment;
