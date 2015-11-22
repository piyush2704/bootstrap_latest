/* Licensed Materials - Property of IBM
 * 5724-O03
 * Copyright 2006 IBM Corp. All rights reserved.
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * See Web Experience Factory ( product id 5724-O03 ) product license for terms and conditions of use.
 *
 * WPF/LWF CORE PRODUCT SUPPORT, NOT CUSTOMER MODIFIABLE, OVERWRITTEN ON UPGRADE
 * Customer modification of core product files may void support agreements with respect to affected portions of the product.
 */
if (typeof wpf_io80201204160803 == "undefined")
{
var wpf_io80201204160803 = {
  bind: function(opts) {
	wpf_io80201204160803 =
typeof dojo != "undefined" ?
{
  bind: function(opts) {
    if (opts.formNode && !opts.formNode.tagName){
      opts.url = opts.url || opts.formNode.action;
      opts.formNode = null;
    }
    var method = (opts.formNode && opts.formNode.method) || "GET";
    var isPost = method.toLowerCase() == "post";
    var url = opts.url || opts.formNode.action;
    var isFileUpload = opts.formNode ? opts.formNode.enctype == "multipart/form-data" : false;
    var dojoOpts = {
      isFileUpload: isFileUpload,
      url: url,
      load: function(content){
        if (this.isFileUpload && content && content.documentElement)
          content = content.documentElement.innerHTML;
        opts.load(null, content, null);
      },
      error: function(err){
        opts.error(null, err);
      },
      form: opts.formNode
    };
    if (dojo.getObject("com.ibm.ajax.auth"))
      com.ibm.ajax.auth.prepareSecure(dojoOpts);
    try
    {
      if (isFileUpload){
        dojo.require("dojo.io.iframe");
        dojoOpts.handleAs = "html";
        dojo.io.iframe.send(dojoOpts);
      } else if (isPost) {
        dojo.xhrPost(dojoOpts);
      } else{
        dojo.xhrGet(dojoOpts);
      }
    } catch (transportError){
      dojoOpts.error(transportError);
      if (typeof console != "undefined")
          console.error("bind:", transportError);
    }
  }
}
:
{
xhpool: [],
bind: function(opts){
  var method = (opts.formNode && opts.formNode.method) || "GET";
  var isPost = method.toLowerCase() == "post";
  var url = opts.url || opts.formNode.action;
  var qs;
  if (opts.formNode){
    qs = this.serializeForm(opts.formNode);
    if (qs && !isPost){
      var sep = "?";
      if (url.indexOf("?") >= 0)
        sep = "&";
      url += sep + qs;
    }
  }
  var xh = this.getXMLHTTP();
  xh.xmlhttp.onreadystatechange = function(){
    if (xh.xmlhttp.readyState == 4){
      if (xh.xmlhttp.responseText){      
        var data = xh.xmlhttp.responseText;
        if (xh.xmlhttp.responseXML && /application.xml/.test(xh.xmlhttp.getResponseHeader("Content-Type"))){
          var feed = wpf_io80201204160803.findElement(xh.xmlhttp.responseXML, "feed");
          if (feed){
            var entry = wpf_io80201204160803.findElement(feed, "entry");
            if (entry){
              var c = wpf_io80201204160803.findElement(entry, "content");
              if (c && c.firstChild)
                data = c.firstChild.nodeValue;
            }
          }
        }
        opts.load(null, data, null);
      }
      delete xh.xmlhttp['onreadystatechange'];
      xh.active = false;
    }
  };
  xh.xmlhttp.open(isPost ? "POST" : "GET", url, true);
  xh.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  xh.xmlhttp.send(isPost ? qs : null);
},
findElement: function(el, p){
  for (var i = 0; i < el.childNodes.length; i++){
    var n = el.childNodes[i];
    if (n.nodeType != 1)
      continue;
    if (n.localName == p || n.baseName == p)
      return n;
  }
},
PROGIDS: ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
getXMLHTTP: function(){
  var xh = null, xmlhttp = null;
  for (var x = 0; x < this.xhpool.length; x++){
    if (!this.xhpool[x].active){
      xh = this.xhpool[x];
      xh.active = true;
      xh.xmlhttp.abort();
      return xh;
    }
  }
  var err = null;
  try { xmlhttp = new XMLHttpRequest(); if (xmlhttp) { return { xmlhttp: xmlhttp, active: true }; } } catch(e) { }
  for (var i = 0; !xmlhttp && i < this.PROGIDS.length; ++i){
    var progid = this.PROGIDS[i];
    try {xmlhttp = new ActiveXObject(progid);} catch(e){err = e;}
  }
  if (xmlhttp) this.PROGIDS = [progid];
  else throw(err);
  return this.cacheXMLHTTP(xmlhttp);
},
cacheXMLHTTP: function(xmlhttp){
  var xh = {active: true, xmlhttp: xmlhttp};
  this.xhpool.push(xh);
  return xh;
},
serializeForm: function(form){
  if (!form || !form.elements || !form.elements.length)
    return "";
  var q = [];
  for (var i = 0; i < form.elements.length; i++){
    var vals = this.serializeElement(form.elements[i]);
    if (vals && vals.length > 0)
      q.push(vals.join("&"));
  }
  return q.join("&");
},
serializeElement: function(el){
  var vals = [];
  if (!el.type) return vals;
  switch (el.type.toLowerCase()){
  case 'text':
  case 'textarea':
  case 'hidden':
  case 'password': 
  case 'submit':
    vals.push(encodeURIComponent(el.name) + "=" + encodeURIComponent(el.value));
    break;
  case 'checkbox':
  case 'radio':
    if (el.checked)
      vals.push(encodeURIComponent(el.name) + "=" + encodeURIComponent(el.value));
    break;
  case 'select-one':
  case 'select-multiple':
    for (var i = 0; i < el.options.length; i++){
      if (el.options[i].selected)
        vals.push(encodeURIComponent(el.name) + "=" + encodeURIComponent(el.options[i].value));
    }
    break;
  }
  return vals;
}
};
  return wpf_io80201204160803.bind(opts);  
}
}
}
if (typeof wpf_ppr80201204160803 == "undefined")
{
  var wpf_ppr80201204160803 = {
    submit: function(form, idlist, hdlr, handlerOpts){
      this.execute(form.action, form, idlist, hdlr, handlerOpts);
    },
    load: function(url, idlist, hdlr, handlerOpts){
      this.execute(url, null, idlist, hdlr, handlerOpts);
    },
    execute: function(url, form, idlist, hdlr, handlerOpts){
      if (!hdlr)
        hdlr = wpf_ppr80201204160803.explicitHandler;
      if (hdlr.prepare)
        hdlr.prepare(url, form, idlist, handlerOpts);
      this.prepareEvents(handlerOpts);
      var myself = this;
      var options ={
        url: url,
        load: function(type, data, evt){
          myself.endLoad();
          myself.doEvent(handlerOpts.preUpdateEventID,{ids: idlist});
          if (!hdlr.update(data, idlist, handlerOpts))
            wpf_ppr80201204160803.checkSessionTimeout(data);
          myself.doEvent(handlerOpts.postEventID,{ids: idlist});
        },
        error: function(type,error){
          myself.endLoad();
          myself.doEvent(handlerOpts.postEventID,{ids: idlist});
          myself.error(type,error);
          myself.doEvent(handlerOpts.errorEventID,{ids: idlist, type: type, error: error});
          myself.checkSessionTimeout("<html></html>");
        }
      };
      if (form)
        options.formNode = form;
      this.bind(options);
      myself.startLoad();
      myself.doEvent(handlerOpts.preEventID,{ids: idlist});
    },
    prepareEvents: function(opts){
      if (opts.eventPfx){
        opts.preEventID = opts.eventPfx + "PreLoad";
        opts.preUpdateEventID = opts.eventPfx + "PreUpdate";
        opts.postEventID = opts.eventPfx + "PostLoad";
        opts.errorEventID = opts.eventPfx + "LoadError";
      }
    },
    doEvent: function(id, args){
      if (id && typeof wpf_event_bus != "undefined")
        wpf_event_bus.fireLocally(id, args);
    },
    error: function(type, error){this.debugError(error);},
    startLoad: function(){},
    endLoad: function(){},
    bind: function(opts){
      wpf_io80201204160803.bind(opts);
    },
    checkSessionTimeout: function(data){
      var isTimeout = function(responseText){
        return responseText && responseText.indexOf('<')>=0;
      };
      var handleTimeout = function(){
        if (typeof console == "object" && console.error)
          console.error("unexpected HTML reply - possible session timeout: doing full-page refresh");        
        top.location.reload();
      };
      if (typeof(wpf) == "object" && wpf.overrides && wpf.overrides.ajax){
        if (typeof(wpf.overrides.ajax.isSessionTimeoutResponse) == "function")
          isTimeout = wpf.overrides.ajax.isSessionTimeoutResponse;
        if (typeof(wpf.overrides.ajax.handleSessionTimeout) == "function")
          handleTimeout = wpf.overrides.ajax.handleSessionTimeout;
      }
      if (isTimeout(data))
        handleTimeout();
    },
    debug: function(msg){
      if (typeof console != "undefined")
        console.debug(msg);
    },
    debugError: function(err){
      if (typeof console != "undefined")
        console.debug(err);
    },
    buildWidgets: function(idlist){
      if (typeof(dojo) != 'undefined' &&  dojo.parser && typeof(dojo.parser.parse) == 'function'){
        for (var i = 0; idlist && i < idlist.length; i++){
          var id = idlist[i];
          var dst;
          if (typeof(id) == "string")
            dst = document.getElementById(id);
          else
            dst = id;
          if (dst){
            wpf_ppr80201204160803.removeControls(dst);
            dojo.parser.parse(dst);
          }
        }
      }
    },
    removeControls: function(element){
      if (element.nodeType == 1 ){
        var attrs = element.attributes;
        if(attrs.getNamedItem("dojoType") != null){
          var id = attrs.getNamedItem("id");
          if(id != null && id.value.length > 0 ){
            dijit.registry.remove(id.value);
          }
        }
        var children = element.childNodes;
        for(var i=0; i < children.length; i++){
          wpf_ppr80201204160803.removeControls(children[i]);
        }
      }
    },
    smartRefreshHandler:{
      prepare: function(url, form, idlist, handlerOpts){
        var id = idlist.length > 0 ? idlist[0] : null;
        if (!id || id == "null"){
          var dst = document.body;
          id = dst.id || "_wpf_smart_refresh_body";
          dst.id = id;
          idlist[0] = id;
        }
        if (typeof dojo != "undefined")
          wpf_ppr80201204160803.setTransitionClass(dojo.byId(id), "pre");        
      },
      update: function(data, idlist){
        if(typeof(dijit) != 'undefined')
          dijit._masterTT = null;
        wpf_ppr80201204160803.captureLoadEvents();
        var id = idlist.length > 0 ? idlist[0] : null;
        var dst;
        if (!id || id == "null"){
          dst = document.body;
          id = dst.id || "_wpf_smart_refresh_body";
          dst.id = id;
          idlist = [ id ];
        }else{
          dst = document.getElementById(id);
        }
        var directlyWritten = [];
        var previousDocumentWrite = document.write;
        document.write = function(s){
          directlyWritten.push(s);
        };
        var ok;
        try{
          var dojoAvailable = typeof(dojo) != "undefined";
          ok = wpf_ppr80201204160803.explicitHandler.update(data, idlist, {execScripts:!dojoAvailable, useDojo:dojoAvailable});
          if (ok){
            wpf_ppr80201204160803.executeHandlers();
            if (typeof wpf_dojo_utils80201204160803 != undefined)
              wpf_dojo_utils80201204160803.updateFormInputs(id);
          }
        }catch (ex){
          ok=false;
          if (typeof console != "undefined")
              console.error("update:", ex);
        }
        wpf_ppr80201204160803.releaseLoadEvents();
        document.write = previousDocumentWrite;
        if (ok && directlyWritten.length > 0){
          var dwid = "_wpf_dwh_" + (new Date()).getTime();
          var p = document.createElement("div");
          var h = document.createElement("div");
          h.id = dwid;
          p.appendChild(h);
          dst.appendChild(p);
          var code = "<div id='" + dwid +"'>" + directlyWritten.join(" ") + "</div>";
          this.update(code, [ dwid ]);
        }
        return ok;
      }
    },
    scriptHandler:{
      update: function(data,idlist){
        if (data){
          for (var i = 0; i < wpf_ppr80201204160803.wrapperPatterns.length; i++){
            var regex = wpf_ppr80201204160803.wrapperPatterns[i];
            var result = data.match(regex);
            if (result != null){
              data = result[1];
              break;
            }
          }
          try {eval(data);}
          catch (problem)
          {
              if (typeof console != "undefined")
                  console.error("scriptHandler::update", {exception: problem, script: data});
        	  return false;
       	  }
        }
        return true;
      }
    },
    directHandler:{
      update: function(data, idlist){
        for (var i = 0; idlist && i < idlist.length; i++){
          var id = idlist[i];
          var dst = document.getElementById(id);
          if (dst)
            dst.innerHTML = data;
        }
        wpf_ppr80201204160803.buildWidgets(idlist);
        return true;
      }
    },
    explicitHandler:{
      update: function(data, idlist, handlerOpts){
        var ok = false;
        var isIE = /MSIE/.test(navigator.userAgent);
        var tmp = null;
        if (isIE)
          tmp = document.getElementById("_wpf_ppr80201204160803_temp_span");
        if (!tmp){
          tmp = document.createElement("span");
          tmp.id = "_wpf_ppr80201204160803_temp_span";
          tmp.style.display = "none";
          if (isIE)
            document.body.appendChild(tmp);
        }
        if (isIE)
          data = data.replace(/(<link|<script)/ig, "<input type='hidden' name='.wpiefix' \/>$1");
        if (idlist && idlist[0] == document.body.id) {
          ok = wpf_ppr80201204160803.explicitHandler.injectContent(document.body, data, handlerOpts && handlerOpts.useDojo);
        }else{
          tmp.innerHTML = data;
          var nchildren = tmp.childNodes.length;
          for (var n = 0; n < nchildren; n++){
            var node = tmp.childNodes[n];
            ok = wpf_ppr80201204160803.explicitHandler.updateContent(node, idlist, handlerOpts && handlerOpts.useDojo) || ok;
          }
        }
        if (handlerOpts && handlerOpts.execScripts)
          wpf_ppr80201204160803.executeScripts(document, idlist);
        if (!handlerOpts || !handlerOpts.useDojo)
          wpf_ppr80201204160803.buildWidgets(idlist);
        tmp.innerHTML = "";
        return ok;
      },
      updateContent: function(node, idlist, useDojo){
        var ok = false;
        var id = node.getAttribute ? node.getAttribute("id") : null;
        if (id){
          var found = false;
          if (!idlist || idlist.length == 0){
            var dst = document.getElementById(id);
            if (dst /* && dst.innerHTML != node.innerHTML */){
              dst.innerHTML = node.innerHTML;
              return true;
            }
          }else{
            for (var i = 0; i < idlist.length; i++){
              if (id == idlist[i]){
                var ok = true;
                var dst = document.getElementById(id);
                if (dst){
                  ok = this.injectContent(dst, node.innerHTML, useDojo);
                }
                return ok;
              }
            }
          }
        }
        for (var c = node.firstChild; c != null; c = c.nextSibling){
          ok = wpf_ppr80201204160803.explicitHandler.updateContent(c, idlist, useDojo) || ok;
        }
        return ok;
      },
      injectContent: function(dst, html, useDojo){
        dst.setAttribute("aria-live", "polite");     	  
        var ok = true;
        if (!useDojo) {
          dst.innerHTML = html;
          return true;
        }
        var pane = dijit.byId(dst.id);
        window.wpf_no_dojo_parse = true;
        try {       	
          if (!pane){
            dojo.style(dst, "display", dojo.style(dst, "display"));
            pane = new wpf.widget.RefreshContainer({ content: html, executeScripts: true, renderStyles: true}, dst.id);
            pane.startup();
          } else {
            pane.attr("content", html);
          }
          if(typeof(dijit) != 'undefined' && dijit._underlay != null && dijit._underlay._destroyed)
            dijit._underlay = null;
          wpf_ppr80201204160803.setTransitionClass(dst, "post");            
        } catch (ex){
            if (typeof console != "undefined")
                console.error("injectContent:", ex);
          ok = false;
        }
        try{
          if (typeof SemTagSvc != "undefined")
            SemTagSvc.parseDom(null, dst);
        } catch (ignored){
        }
        window.wpf_no_dojo_parse = false;
        return ok;
      }
    },
    debugHandler:{
      update: function(data,idlist){debug(data);}
    },
    executeScripts: function(el, idlist){
      if (idlist){
        for (var i = 0; i < idlist.length; i++){
          var subel;
          if (el.id == idlist[i])
            subel = el;
          else if (el.getElementById)
            subel = el.getElementById(idlist[i]);
          wpf_ppr80201204160803.executeScripts(subel);
        }
        return;
      }
      if (!el)
        return;
      var scripts = el.getElementsByTagName("script");
      if (!scripts) return;
      for (var i = 0; i < scripts.length; i++){
        var script = scripts[i];
        var scpt = script.innerHTML;
        var src = script.src;
        if (src){
          wpf_ppr80201204160803.addScriptReference({src: src});
        }else{
          wpf_ppr80201204160803.evaluateScriptText(scpt);
        }
      }
    },
    evaluateScriptText: function(scptTxt){
      if (typeof window._wpf_ppr80201204160803_gloabal_eval  == "undefined"){
        window.eval("var _wpf_ppr80201204160803_gloabal_eval  = function(s) { window.eval(s); }");
      }
      if (typeof window._wpf_ppr80201204160803_gloabal_eval  == "undefined"){
        window._wpf_ppr80201204160803_gloabal_eval = function(s){
          wpf_ppr80201204160803.addScriptReference({text:s});
        };
      }
      window._wpf_ppr80201204160803_gloabal_eval (scptTxt);
    },
    addScriptReference: function(opts){
      var el = document.createElement("script");
      el.type = "text/javascript";
      el.defer = false;
      if (opts.text) el.text=opts.text;
      if (opts.src) el.src=opts.src;
      var heads = document.getElementsByTagName("head");
      if (heads.length){
        heads.item(0).appendChild(el);
      }else{
        var head=document.createElement("head");
        head=document.documentElement.appendChild(head);
        head.appendChild(el);
      }
    },
    captureLoadEvents: function(){
      this.handlerList = [];
      var me = this;
      if (window.addEventListener){
        this.window_addEventListener = window.addEventListener;
        window.addEventListener = function(a,b,c){me.addEventListener( a,b,c );};
      }else{
        window.window_attachEvent = window.attachEvent;
        window.attachEvent = function(a,b){me.attachEvent(a,b);};
      }
    },
    releaseLoadEvents: function(){
      if (this.window_addEventListener){
        window.addEventListener=this.window_addEventListener;
      }else{
        window.attachEvent = window.window_attachEvent;
      }
      this.handlerList=[];
    },
    addEventListener: function(eventType, handler, useCapture){
      if (eventType == "load"){
        this.registerHandler(handler);
      }else{
        this.window_addEventListener.apply(window,[eventType,handler,useCapture]);
      }
    },
    attachEvent: function(event,handler){
      if (event == "onload"){
        this.registerHandler(handler);
      }else{
        window.window_attachEvent(event, handler);
      }
    },
    registerHandler: function (handler){
      var executor = function (){
        if (document.createEvent){
          var event = document.createEvent("Events");
          event.initEvent( "load", true, true );
          handler.apply( window, [ event ] );
        }else{
          var funct = function (){return handler();};
          document.body.attachEvent("onload",funct);
          document.body.fireEvent("onload");
          document.body.detachEvent("onload",funct);
        }
      };
      this.handlerList.push({executor: executor, context: window});
    },
    executeHandlers: function(){
      for (var i=0; i < this.handlerList.length; i++){
        var obj = this.handlerList[i];
        try{
          var executor = obj.executor;
          var context = obj.context;
          executor.call(context);
        } catch (error){
            if (typeof console != "undefined")
                console.error("executeHandlers:", error);
        }
        delete this.handlerList[i];
      }
    },
    setTransitionClass: function(el, type)
    { 
      var transClass = "wpf-" + type + "-load-transition", transInitClass = "wpf-" + type + "-load-transition-init", 
          attr = "data-" + transClass + "-class", initAttr = "data-" + transInitClass + "-class";
      var transitionClass = el.getAttribute(attr) || dojo.body().getAttribute(attr) || transClass; 
      var initClass = el.getAttribute(initAttr) || dojo.body().getAttribute(initAttr)|| transInitClass;      
      dojo.removeClass(el, transitionClass);
      if (initClass)
        dojo.addClass(el, initClass);
      window.setTimeout(function() { dojo.addClass(el, transitionClass); }, 10);
    },
    wrapperPatterns: [
      /^\/\*(.*)\s*\*\/\s*$/m,
      /^\/\*-secure-\s*(.*)\s*\*\/\s*$/m,
      /^\s*while\s*\(\s*1\s*\)\s*;(.*)$/m,
      /^([\s\S]*\S[\s\S]*)<script[\s\S]*script>[\s\n]*$/mi,
      /^[\s\n]*<script[\s\S]*script>([\s\S]+)$/mi
    ]
  }
}
