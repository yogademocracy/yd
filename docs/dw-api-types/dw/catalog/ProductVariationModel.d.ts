import Variant = require('./Variant');
import Product = require('./Product');
import Collection = require('../util/Collection');
import VariationGroup = require('./VariationGroup');
import ProductVariationAttribute = require('./ProductVariationAttribute');
import ProductVariationAttributeValue = require('./ProductVariationAttributeValue');
import MediaFile = require('../content/MediaFile');
import List = require('../util/List');
import HashMap = require('../util/HashMap');
import URL = require('../web/URL');

declare class ProductVariationModel {
  defaultVariant: Variant;
  master: Product;
  productVariationAttributes: Collection<ProductVariationAttribute>;
  selectedVariant: Variant;
  selectedVariants: Collection<Variant>;
  variants: Collection<Variant>;
  variationGroups: Collection<VariationGroup>;

  getAllValues(attribute: ProductVariationAttribute): Collection<ProductVariationAttributeValue>;
  getDefaultVariant(): Variant;
  getFilteredValues(attribute: ProductVariationAttribute): Collection<ProductVariationAttributeValue>;
  getHtmlName(attribute: ProductVariationAttribute): string;
  getHtmlName(prefix: string, attribute: ProductVariationAttribute): string;
  getImage(viewtype: string, attribute: ProductVariationAttribute, value: ProductVariationAttributeValue): MediaFile;
  getImage(viewtype: string, index: number): MediaFile;
  getImage(viewtype: string): MediaFile;
  getImages(viewtype: string): List<MediaFile>;
  getMaster(): Product;
  getProductVariationAttribute(id: string): ProductVariationAttribute;
  getProductVariationAttributes(): Collection<ProductVariationAttribute>;
  getSelectedValue(attribute: ProductVariationAttribute): ProductVariationAttributeValue;
  getSelectedVariant(): Variant;
  getSelectedVariants(): Collection<Variant>;
  getVariants(): Collection<Variant>;
  getVariants(filter: HashMap<string, string>): Collection<Variant>;
  getVariationGroups(): Collection<VariationGroup>;
  getVariationValue(variantOrVariationGroup: Product, attribute: ProductVariationAttribute): ProductVariationAttributeValue | null;
  hasOrderableVariants(attribute: ProductVariationAttribute, value: ProductVariationAttributeValue): boolean;
  isSelectedAttributeValue(attribute: ProductVariationAttribute, value: ProductVariationAttributeValue): boolean;
  /**
     * Applies a selected attribute value to this model instance. Usually this method is used to set the model state corresponding to the variation attribute values specified by a URL. The URLs can be obtained by using one of the models URL methods, like urlSelectVariationValue(String, ProductVariationAttribute, ProductVariationAttributeValue) and urlUnselectVariationValue(String, ProductVariationAttribute). Anyway, there are some limitations to keep in mind when selecting variation attribute values. A Variation Model created for a Variation Group or Variant Product is bound to an initial state. Example:

    *    * A Variation Model created for Variation Group A can't be switched to Variation Group B.
    *    * A Variation Model created for Variant A can't be switched to Variant B.
    *    * The state of a Variation Model for a Variation Group that defines color = red can't be changed to color = black.
    *    * The state of a Variation Model for a Variant that defines color = red / size = L can't be changed to color = black / size = S. However, the state of a Variation Model created for a Variation Group that defines color = red can be changed to a more specific state by adding another selected value, e.g. size = L.


    * The state of a Variation Model created for a Variation Master can be changed in any possible way because the initial state involves all variation values and Variants.
     * @param variationAttributeID the ID of an product variation attribute, must not be null, otherwise a exception is thrown
     * @param variationAttributeValueID the ID of the product variation attribute value to apply, this value must not be part of the initial model state (e.g. the variant or group that the model has been created for), otherwise a exception is thrown
     */
  setSelectedAttributeValue(variationAttributeID: string, variationAttributeValueID: string): void;
  url(action: string, ...varAttrAndValues: string): URL;
  urlSelectVariationValue(action: string, attribute: ProductVariationAttribute, value: ProductVariationAttributeValue): string;
  urlUnselectVariationValue(action: string, attribute: ProductVariationAttribute): string;
}

export = ProductVariationModel;
