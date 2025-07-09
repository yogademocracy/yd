import Calendar = require('../util/Calendar');
import OrganizationPreferences = require('./OrganizationPreferences');

/**
 * Represents the Commerce Cloud Digital server instance. An application server instance is configured to be of one of three types, "development system", "staging system" or "production system".
 */
declare class System {
  protected constructor();

  /**
   * Represents the development system.
   */
  static readonly DEVELOPMENT_SYSTEM: 0;

  /**
   * Represents the production system.
   */
  static readonly PRODUCTION_SYSTEM: 2;

  /**
   * Represents the staging system.
   */
  static readonly STAGING_SYSTEM: 1;

  /**
   * A new Calendar object in the time zone of the current instance.
   */
  static readonly calendar: Calendar;

  /**
   *     The compatibility mode of the custom code version that is currently active. The compatibility mode is returned as a number, e.g. compatibility mode "15.5" is returned as 1505.
   */
  static readonly compatibilityMode: number;

  /**
   *    Returns instance hostname.
   */
  static readonly instanceHostname: string;

  /**
   * The instance time zone. The instance time zone is the time zone in which global actions like jobs or reporting are specified in the system.
   */
  static readonly instanceTimeZone: string;

  /**
     * The type of the instance. An application server instance is configured to be of one of three types, "development system", "staging system" or "production system".
    This method returns a constant representing the instance type of this application server.
     */
  static readonly instanceType: 0 | 1 | 2;

  /**
   * This method returns a container of all global preferences of this organization (instance).
   */
  static readonly preferences: OrganizationPreferences;

  /**
   *  Returns a new Calendar object in the time zone of the current instance.
   */

  static getCalendar(): Calendar;

  /**
   *     Returns the compatibility mode of the custom code version that is currently active.
   */
  static getCompatibilityMode(): number;

  /**
   * Returns instance hostname.
   */
  static getInstanceHostname(): string;

  /**
   *  Returns the instance time zone.
   */
  static getInstanceTimeZone(): string;

  /**
   * Returns the type of the instance.
   */
  static getInstanceType(): 0 | 1 | 2;

  /**
   *     This method returns a container of all global preferences of this organization (instance).
   */
  static getPreferences(): OrganizationPreferences;
}

export = System;
