import Collection = require('dw/util/Collection');
import Region = require('./Region');

/**
 * This class represents a page designer managed component as part of a page. A component comprises of multiple regions that again hold components, thus spanning a hierarchical tree of components. Using the `PageMgr.renderRegion(Region)` or `PageMgr.renderRegion(Region, RegionRenderSettings)` a region can be rendered which implicitly includes rendering of all contained visible components. All content attributes (defined by the corresponding component type) can be accessed, reading the accordant values as provided by the content editor that created this component.
 */
declare class Component {
  private constructor();
  readonly ID: string;
  readonly name: string;
  readonly typeID: string;

  getID(): string;
  getName(): string;
  getTypeID(): string;
  getRegion(id: string): Region | null;
  getAttribute(id: string): object | null;
}

export = Component;
