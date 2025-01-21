import { BasicTool } from "zotero-plugin-toolkit";
import Addon from "./addon";
import { config } from "../package.json";

const basicTool = new BasicTool();
const Zotero = basicTool.getGlobal("Zotero");
const _globalThis = globalThis as any;

// If our plugin isn't attached to Zotero yet, create and attach it
if (!(Zotero as any)[config.addonInstance]) {
  // Create the add-on instance, store it in globalThis
  _globalThis.addon = new Addon();

  // Optionally define "ztoolkit" as a getter on globalThis
  defineGlobal("ztoolkit", () => {
    return _globalThis.addon.data.ztoolkit;
  });

  // Attach the plugin instance to Zotero with a safe cast
  (Zotero as any)[config.addonInstance] = _globalThis.addon;
}

/**
 * Helper function to define a property on globalThis with a given getter.
 */
function defineGlobal(name: string, getter: () => any) {
  Object.defineProperty(_globalThis, name, {
    get: getter,
    configurable: true,
  });
}
