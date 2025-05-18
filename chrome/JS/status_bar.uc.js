ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
var appversion = parseInt(Services.appinfo.version);

let status = document.createElement("vbox");
status.setAttribute("id", "browser-bottombox");
document.body.appendChild(status);
var AddStatus = {
  init: function() {

	if (location != 'chrome://browser/content/browser.xhtml')
      return;

	/* blank tab workaround */
	try {
	  if(gBrowser.selectedBrowser.getAttribute('blank')) gBrowser.selectedBrowser.removeAttribute('blank');
	} catch(e) {}

	if (location != 'chrome://browser/content/browser.xhtml')
      return;
	try {
	 if(document.getElementById('status-bar') == null) {
		
	  var tb_status = document.createXULElement("toolbar");
	  tb_status.setAttribute("id","status-bar");
	  tb_status.setAttribute("customizable","true");
	  tb_status.setAttribute("class","toolbar-primary chromeclass-toolbar browser-toolbar customization-target");
	  tb_status.setAttribute("mode","icons");
	  tb_status.setAttribute("iconsize","small");
	  tb_status.setAttribute("lockiconsize","true");
	  tb_status.setAttribute("ordinal","1005");
	  
	  document.querySelector('#browser-bottombox').appendChild(tb_status);
	  
	  CustomizableUI.registerArea("status-bar", {legacy: true});
	  CustomizableUI.registerToolbarNode(tb_status);
		  
		  try {
			Services.prefs.getDefaultBranch("browser.status-bar.").setBoolPref("enabled",true);
			setToolbarVisibility(document.getElementById("status-bar"), Services.prefs.getBranch("browser.status-bar.").getBoolPref("enabled"));
		  } catch(e) {};

          var tb_staustext = document.createXULElement("toolbaritem");
	  tb_staustext.setAttribute("id","status-text");
	  tb_staustext.setAttribute("class","chromeclass-toolbar-additional");
	  tb_staustext.setAttribute("customizableui-areatype","toolbar");
	  tb_staustext.setAttribute("removable","false");
	  tb_staustext.setAttribute("label", "Done");
          tb_staustext.appendChild(document.getElementById('statuspanel-label'));
	  
	  tb_status.appendChild(tb_staustext);
 // CSS
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
		 #status-bar {
            color: initial !important;
            background-color: var(--toolbar-non-lwt-bgcolor) !important;
display: flex;
          }
          #status-text > #statuspanel-label {
            border-top: 0 !important;
            background-color: unset !important;
            color: #444;
            text-align: center !important;
          }
          #status-bar > #status-text {
            display: flex !important;
            justify-content: center !important;
            align-content: center !important;
            flex-direction: column !important;
            -moz-window-dragging: drag;
            width: 100%;
          }
	  #wrapper-status-text, #status-text {
		width: 100% !important;
                height: 16px;
	  }
          toolbarpaletteitem #status-text:before {
            content: "Status text" !important;
            color: red !important;
            border: 1px #aaa solid;
            border-radius: 3px;
            font-weight: bold;
            width: -moz-available !important;
            text-align: center !important;
            width: 100%;
          }
	body:has(#statuspanel[inactive]) #statuspanel-label {
		visibility: hidden !important;
	}

body:has(#statuspanel[inactive]) #status-text::before {
  content: 'Done';
width: 100%;
position: absolute;
text-align: center;
text-shadow: -1px -1px 5px rgba(0,0,0,0.6);
	color: #fff;
	}
          :root[inFullscreen]:not([macOSNativeFullscreen]) #browser-bottombox {
            visibility: collapse !important;
          }
	  `), null, null);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	 }
	} catch(e){}

  }

}

/* initialization delay workaround */
document.addEventListener("DOMContentLoaded", AddStatus.init(), false);
/* Use the below code instead of the one above this line, if initialization issues occur on startup */
/*
setTimeout(function(){
  AddStatus.init();
},2000);
*/