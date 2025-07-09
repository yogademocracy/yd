import ExtensibleObject = require('../object/ExtensibleObject');
import CustomAttributes = require('../object/CustomAttributes');
declare global {
  module ICustomAttributes {
    interface SiteOrganizationPreferences extends CustomAttributes {}
  }
}
/**
 * OrganizationPreferences is a container for custom global (i.e. organization-level) attributes. The object corresponds with system object definition "OrganizationPreferences". It has no system attributes and exists only as a place for merchants to define custom attributes which need to be available to all of their sites.
 *
An instance is obtained by calling System.getPreferences(). Once an instance of the container is obtained, it is possible to read/write organization preference values by using the usual syntax for ExtensibleObject instances. For example:
```
 var orgPrefs : OrganizationPreferences = dw.system.System.getPreferences();
 var myOrgPrefValue : String = orgPrefs.getCustom()["myOrgPref"];
 ```
 */
declare class OrganizationPreferences extends ExtensibleObject<ICustomAttributes.SiteOrganizationPreferences> {}

export = OrganizationPreferences;
