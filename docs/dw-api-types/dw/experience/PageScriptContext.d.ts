import Map = require('dw/util/Map');
import Page = require('./Page');

/**
 * This is the context that is handed over to the `render` function of the respective page type script.
 */
declare class ComponentScriptContext {
  private constructor();
  /** The page for which the corresponding page type script is currently executed. */
  readonly page: Page;
  /** The `parameters` argument as passed when kicking off page rendering via `PageMgr.renderPage(String, String)`. */
  readonly renderParameters: string;
  /** The content attributes of the page. Currently those are not merchant manageable but are solely set in your respective page type `render` function. */
  readonly content: Map<string, object>;

  getPage(): Page;
  getRenderParameters(): string;
  getContent(): Map<string, object>;
}

export = ComponentScriptContext;
