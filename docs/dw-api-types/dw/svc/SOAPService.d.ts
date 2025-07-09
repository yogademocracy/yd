import Service = require('./Service');

/**
 * Represents an HTTP Service.
 */
declare class SOAPService<T, K> extends Service<T, K> {
  /**
   * The authentication type.
   */
  authentication: string;

  /**
   * The serviceClient object.
   */
  serviceClient: Object;

  protected constructor();

  /**
   * Returns the authentication type.
   */
  getAuthentication(): String;

  /**
   * Returns the serviceClient object.
   */
  getServiceClient(): Object;

  /**
   * Sets the type of authentication.
   * @param authentication
   */
  setAuthentication(authentication: string): this;

  /**
   * Sets the serviceClient object.
   * @param o
   */
  setServiceClient(o: Object): this;
}

export = SOAPService;
