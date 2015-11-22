/* Licensed Materials - Property of IBM
 * 5724-O03
 * Copyright 2006 IBM Corp. All rights reserved.
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * See Web Experience Factory ( product id 5724-O03 ) product license for terms and conditions of use.
 *
 * WPF/LWF CORE PRODUCT SUPPORT, NOT CUSTOMER MODIFIABLE, OVERWRITTEN ON UPGRADE
 * Customer modification of core product files may void support agreements with respect to affected portions of the product.
 */
if (typeof wpf_event_bus == "undefined"){
  var wpf_event_bus = {
    listeners: [],
    fire: function(id, args){
      var windows = [];
      wpf_event_bus.getAllWindows(window.top, windows);
      for (var iw = 0; iw < windows.length; iw++){
        var bus = windows[iw].wpf_event_bus;
        if (bus){
          if (!windows[iw].name || !/^wpf_ar_/.test(windows[iw].name))
            bus.fireLocally(id, args);
        }
      }
    },
    fireLocally: function(id, args){
      var ls = (this.listeners[id] || []).concat(this.listeners["*"] || []);
      for (var i = 0; i < ls.length; i++){
        ls[i].handle.apply(args, [id]);
      }
    },
    addListener: function(id, l){
      if (/^wpf_ar_/.test(window.name))
        return;
      if (!this.listeners[id]) this.listeners[id] = [];
      if (l._handlerID){
        var lst = this.listeners[id];
        for (var i = 0; i < lst.length; i++){
          if (l._handlerID == lst[i]._handlerID){
            lst[i] = l;
            return;
          }
        }
      }
      this.listeners[id].push(l);
    },
    getAllWindows: function(w, windows){
      windows.push(w);
      for (var i = 0; i < w.frames.length; i++){
        wpf_event_bus.getAllWindows(w.frames[i], windows);
      }
    }
  };
}
/* Allow unversioned access, especially for widgets - first one wins. */
window["wpf" + "_event_bus"] = window["wpf" + "_event_bus"] || wpf_event_bus;
