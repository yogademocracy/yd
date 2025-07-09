import PersistentObject = require('../object/PersistentObject');

/**
 * AB-tests provide the merchant the ability to compare one set of storefront "experiences" - promotions, sorting rules, and slot configurations in particular - against another set. The merchant configures different AB-test segments which define the sets of experiences that the merchant wishes to test. AB-tests run for a configured period of time, and customers are randomly assigned by the platform to the test segments according to allocation percentages defined by the merchant.
 */
declare class ABTest extends PersistentObject {
  private constructor();

  readonly ID: string;
  getID(): string;
}
export = ABTest;
