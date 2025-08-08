'use strict';

export const xPref = (() => {
  const prefs = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefBranch);
  const observers = {};

  function get(name, defaultValue) {
    try {
      return prefs.getBoolPref(name);
    } catch (e) {
      return defaultValue;
    }
  }

  function set(name, value) {
    prefs.setBoolPref(name, value);
  }

  function observe(name, callback) {
    if (observers[name]) return; // only one observer per pref
    const observer = {
      observe(subject, topic, data) {
        if (data === name) callback();
      },
    };
    observers[name] = observer;
    Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefBranch)
      .addObserver(name, observer, false);
  }

  return { get, set, observe };
})();
