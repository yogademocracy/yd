import Page = require('./Page');
import Region = require('./Region');
import RegionRenderSettings = require('./RegionRenderSettings');

/**
 * Provides functionality for getting and rendering page designer managed pages. The basic flow is to initiate page rendering by ID via `renderPage(String, String)`. This will trigger page rendering from a top level perspective, i.e. the page serves as entry point and root container of components. As a related page or component template will likely want to trigger rendering of nested components within its regions it can do this by first fetching the desired region by ID via Page.getRegion(String) or Component.getRegion(String) and then call to `renderRegion(Region, RegionRenderSettings)` with the recently retrieved region (and optionally provide RegionRenderSettings for customized rendering of region and component wrapper elements).
 *
 * Various attributes required for rendering in the corresponding template can be accessed with the accordant methods of Page and Component.
 *
 * **Any rendering or retrieval of pages, components and regions will return null in case the page designer feature is turned off. The page designer feature is a beta feature only and must not be used if not explicitly taking part in the corresponding beta program.**
 */
declare class PageMgr {
  private constructor();

  /**
   * Returns the page identified by the specified id.
   * @param id - the id of the page
   * @returns the page, or null if not found.
   */
  static getPage(id: string): Page | null;
  /**
   * Render a page.
   * @param id - the ID of the page that will be rendered
   * @param parameters - the optional parameters passed to page rendering
   * @returns the remote include that will yield the markup as produced by page rendering
   */
  static renderPage(id: string, parameters: string): string | null;
  /**
   * Renders a region by triggering rendering of all visible components within this region.
   */
  static renderRegion(region: Region): string | null;
  /**
   * Renders a region by triggering rendering of all visible components within this region.
   */
  static renderRegion(region: Region, regionRenderSettings: RegionRenderSettings): string | null;
}

export = PageMgr;
