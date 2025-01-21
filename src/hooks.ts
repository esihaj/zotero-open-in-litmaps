import { registerLitmapsMenu } from "./modules/litmaps";

async function onStartup(): Promise<void> {
  // Wait for Zotero to load fully
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  // Register the “Open in Litmaps” right-click item
  registerLitmapsMenu();
}

function onShutdown(): void {
  (globalThis as any).addon?.data?.ztoolkit?.unregisterAll();
  // Clean up references
  (globalThis as any).addon.data.alive = false;
  delete (Zotero as any)[(globalThis as any).addon.data.config.addonInstance];
}

export default {
  onStartup,
  onShutdown,
};
