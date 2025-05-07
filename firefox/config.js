// skip 1st line
lockPref('xpinstall.signatures.required', false);
lockPref('extensions.install_origins.enabled', false);
lockPref("extensions.experiments.enabled", true); 
try {
    
  let cmanifest = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('UChrm', Ci.nsIFile);
  cmanifest.append('utils');
  cmanifest.append('chrome.manifest');
  
  if(cmanifest.exists()){
    Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(cmanifest);
    ChromeUtils.importESModule('chrome://userchromejs/content/boot.sys.mjs');
    Services.scriptloader.loadSubScript('chrome://userchromejs/content/BootstrapLoader.js');
  }

} catch(ex) {};

try {
Services.scriptloader.loadSubScript('chrome://userchromejs/content/userChrome.js'); 
} catch (ex) {};