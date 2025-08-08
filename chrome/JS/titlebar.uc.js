(async function () {
  const PREF_TITLE = "userchrome.Title";

  const { xPref } = await ChromeUtils.importESModule(
    "chrome://modules/content/xPref.sys.mjs"
  );

  function applyAttributesToWindow(win) {
  try {
    const doc = win.document;
    const root = doc.getElementById("main-window");
    if (!root) return; // Not a main window

    const titleBase = xPref.get(PREF_TITLE, "Microsoft Internet Explorer");
    const isPrivate = PrivateBrowsingUtils.isWindowPrivate(win);

    doc.title = "";

    root.setAttribute("data-title-default", titleBase);
    root.setAttribute("data-title-private", `${titleBase} (Private browsing)`);
    root.setAttribute("data-content-title-default", `CONTENTTITLE — ${titleBase}`);
    root.setAttribute("data-content-title-private", `CONTENTTITLE — ${titleBase} (Private browsing)`);

    
    doc.title = isPrivate
      ? `${titleBase} (Private browsing)`
      : titleBase;

    
    const tabbrowser = win.gBrowser;
    if (tabbrowser?.selectedTab?.label) {
      const tabTitle = tabbrowser.selectedTab.label;
      doc.title = `${tabTitle} — ${doc.title}`;
    }

  } catch (e) {
    Cu.reportError("applyAttributesToWindow error: " + e);
  }
}

  function applyToAllOpenWindows() {
    const enumWin = Services.wm.getEnumerator(null);
    while (enumWin.hasMoreElements()) {
      const win = enumWin.getNext();
      if (win?.document?.documentElement) {
        applyAttributesToWindow(win);
      }
    }
  }

  
  Services.obs.addObserver((subject) => {
    subject.addEventListener("load", () => {
      applyAttributesToWindow(subject);

      
      subject.gBrowser?.tabContainer?.addEventListener("TabSelect", () => {
        applyAttributesToWindow(subject);
      });

    }, { once: true });
  }, "chrome-document-global-created");

  
  xPref.observe(PREF_TITLE, applyToAllOpenWindows);

  applyToAllOpenWindows();
  console.log("titlebar.uc.js initialized.");
})();
