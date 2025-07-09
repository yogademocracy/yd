import EnumValue = require('./value/EnumValue');
import MarkupText = require('./content/MarkupText');
import CustomAttributes = require('./object/CustomAttributes');

// example of definitions for custom objects attrs
// this file should not be edited but copyed in new place and edited there
declare global {
  module ICustomAttributes {
    interface Session extends CustomAttributes {}
    interface Appeasement {}
    interface AppeasementItem {}
    interface Basket {}
    interface BonusDiscountLineItem {}
    interface Campaign {}
    interface Catalog {}
    interface Category {
      isWineClubPage: boolean;
      wineClubName: string;
      wineClubShortDescription: string;
      wineClubLongDescription: string;
      wineClubShipments: string;
      wineClubShipmentCostDescription: string;
      wineClubSavings: string;
      wineClubAdditionalBenefits: string;
      wineClubQuestionsInformation: string;
      wineClubTermsConditions: string;
      wineClubCancellationPolicy: string;
      wineClubPhone: string;
      wineClubEmail: string;
      wineClubID: string;
      wineClubShippingMethod: string;
      wineClubBigThumbnail: string;
      wineClubSmallThumbnail: string;
      wineClubDescriptionImage: string;
      wineClubHeroImage: string;
      wineClubBrandLogo: string;
    }
    interface CategoryAssignment {}
    interface Content {
      /**
       * Body
       */
      body: MarkupText;
    }
    interface Coupon {}
    interface CouponLineItem {}
    interface CustomerActiveData {}
    interface CustomerAddress {
      code: string;
      email: string;
      birthday: Date;
      isShipping: boolean;
      isBilling: boolean;
      subproAddressID: string;
    }
    interface CustomerGroup {}
    interface CustomerPaymentInstrument {
      subproPaymentProfileID: string;
      isDefault: boolean;
    }
    interface Folder {}
    interface GiftCertificate {}
    interface GiftCertificateLineItem {}
    interface Invoice {}
    interface InvoiceItem {}
    interface Library {}
    interface Order {}
    interface OrderAddress {}
    interface OrderItem {}
    interface OrderPaymentInstrument {}
    interface OrganizationPreferences {}
    interface PaymentCard {
      subproCardType: string;
    }
    interface PaymentMethod {}
    interface PaymentTransaction {}
    interface PriceAdjustment {}
    interface PriceBook {}
    interface Product {
      foleyProductType: EnumValue<string>[];
      bottleSize: EnumValue<string>[];
      acid: string;
      aging: string;
      alcoholPercentage: string;
      appellation: string;
      availableForInStorePickup: boolean;
      awards: string;
      bottlingDate: string;
      color: string;
      fermentation: string;
      foleyBrand: EnumValue<string>[];
      foodPairing: string;
      harvestDate: string;
      isNew: boolean;
      isSale: boolean;
      itemDiscountGroup: string;
      itemDivision: EnumValue<string>[];
      labelNo: string;
      otherNotes: string;
      ph: string;
      productionNotes: string;
      rating: MarkupText;
      region: string;
      residualSugar: string;
      rp_Rating: number;
      shipCompliantBrandKey: string;
      size: string;
      sugar: string;
      tannin: string;
      tastingNotes: string;
      teaser: string;
      varietal: string;
      vineyardDesignation: string;
      vineyardNotes: string;
      vintageOrYear: string;
      we_Rating: number;
      wineColor: string;
      wineType: EnumValue<string>[];
      winemakerNotes: string;
      ws_Rating: string;
      wineClubSubscriptionName: string;
      wineClubSubscriptionShortDescription: string;
      wineClubSubscriptionLongDescription: string;
      wineClubSubscriptionShipmentsPerYear: EnumValue<string>[];
      wineClubSubscriptionPreference: EnumValue<string>[];
      wineClubSubscriptionPreferenceCode: string;
    }
    interface ProductActiveData {}
    interface ProductInventoryList {}
    interface ProductInventoryRecord {}
    interface ProductLineItem {
      isManualPrice: boolean;
    }
    interface ProductList {}
    interface ProductListItem {}
    interface ProductListItemPurchase {}
    interface ProductListRegistrant {}
    interface Profile {
      altEmail: string;
      altPhone: string;
      familyStatus: EnumValue<string>[];
      loyaltyBalance: number;
      loyaltyDetails: string;
      loyaltyNumber: string;
      isLoyaltyProgrammDisabled: boolean;
      priceDiscountGroup: EnumValue<string>[];
      sourceAssociate: string;
      sourceBrand: string;
      type: EnumValue<string>[];
      wc_Brand: string;
      wc_CancellationDate: Date;
      wc_CancellationReason: string;
      wc_Code: string;
      wc_GiftMembership: boolean;
      wc_Level: string;
      wc_LocationCode: string;
      wc_MembershipStatus: EnumValue<string>[];
      wc_MemberDiscountGroup: string;
      wc_PreferenceCode: string;
      wc_ReferralCustomerID: string;
      wc_Rejoin: Date;
      wc_ShipmentMethodCode: string;
      wc_SignUp: Date;
      wd_Customer: boolean;
      wd_UserName: string;
      subproCustomerID: string;
      wineClubsIDs: EnumValue<string>[];
    }
    interface Promotion {}
    interface Recommendation {}
    interface Return {}
    interface ReturnCase {}
    interface ReturnCaseItem {}
    interface ReturnItem {}
    interface ServiceConfig {}
    interface ServiceCredential {}
    interface ServiceProfile {}
    interface Shipment {
      applicableShippingMethods: string;
    }
    interface ShippingLineItem {
      isManualPrice: boolean;
    }
    interface ShippingMethod {}
    interface ShippingOrder {}
    interface ShippingOrderItem {}
    interface SitePreferences {}
    interface SlotConfiguration {}
    interface SourceCodeGroup {}
    interface Store {}
    interface StoreGroup {}
    interface TrackingInfo {}
    interface TrackingRef {}
  }
}
