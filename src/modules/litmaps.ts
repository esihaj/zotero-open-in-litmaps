/**
 * "Open in Litmaps" module. 
 * Bypasses strict TS checks using `(Zotero as any)` in a few places.
 */
const Zotero = (globalThis as any).Zotero;

/**
 * Send a Litmaps query and open the first match in a browser tab.
 */
async function openInLitmaps(item: any): Promise<void> {
    try {
        // 1) Get the title from the Zotero item
        const title = item.getField("title") || "";
        if (!title) {
            await (Zotero as any).alert(
                (Zotero as any).getMainWindow() as Window,
                "Litmaps",
                "This item has no title to query."
            );
            return;
        }

        // 2) Construct Litmaps search URL
        const url = `https://api.litmaps.com/keywordSearch?query=${encodeURIComponent(
            title
        )}&page=1&per=10&showArticleDetails=true&useReranker=false&searchEngine=semantic_scholar`;

        // 3) Fetch results
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // 4) Check for any results
        const data = (await response.json()) as any;
        const resultItems = data?.resultItems || [];

        if (!resultItems.length) {
            await (Zotero as any).alert(
                (Zotero as any).getMainWindow() as Window,
                "Litmaps",
                "No matching articles found."
            );
            return;
        }

        // 5) Construct the Litmaps preview URL and open it
        const articleId = resultItems[0].id;
        const finalUrl = `https://app.litmaps.com/preview/${articleId}`;
        (Zotero as any).launchURL(finalUrl);
    } catch (err) {
        // 6) Log and notify the user on error
        (Zotero as any).logError(err);
        await (Zotero as any).alert(
            (Zotero as any).getMainWindow() as Window,
            "Litmaps Error",
            String(err)
        );
    }
}

/**
 * Registers a right-click menu item for "regular" Zotero items.
 */
export function registerLitmapsMenu(): void {
    // Access our global ztoolkit object
    const ztoolkit = (globalThis as any).addon?.data?.ztoolkit;
    if (!ztoolkit) return;

    ztoolkit.ui.registerRightClickMenuItem({
        id: "open-in-litmaps",
        label: "Open in Litmaps",
        showFor: "regularItem",
        callback: async (items: any[]) => {
            if (items?.[0]) {
                await openInLitmaps(items[0]);
            }
        },
    });
}
