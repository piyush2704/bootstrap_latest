/* Licensed Materials - Property of IBM 5724-O03
 * Copyright IBM Corp. 2011
 */
if (typeof wpf_dojo_progress_indicator == "undefined")
{
  wpf_dojo_progress_indicator={
    isShowing: false,
    show: function(opts) {
      if (this.isShowing)
        return;
      if (opts.useDialog) {
        if (!this.dlg) {
          this.dlg = new dijit.Dialog({});
        }
        if (!this.isShowing) {
          var el = dojo.byId(opts.source);
          this.dlg.attr("content", el.innerHTML);
          this.dlg.show();
        }
      } else {
        var source = dojo.byId(opts.source);
        var sourceHTML = "";
        if (source && source.innerHTML)
          sourceHTML = source.innerHTML.replace(/wef.hide.script/gmi, "script");        
        for (var i = 0; i < opts.ids.length; i++) {
          var loc = dojo.byId(opts.ids[i]);
          if (loc) {
            if (loc.style.display == "none")
              loc.style.display = "";
            if (source) {
              var src = sourceHTML;
              if (opts.insertInsideBottom) {
                var br = document.createElement("br");
                loc.appendChild(br);
                var div = document.createElement("div");
                loc.appendChild(div);
                loc = div;
                div.style.clear = "both";
              } else if (opts.insertInsideTop || opts.overRegion) {
                var div = document.createElement("div");
                loc.insertBefore(div, loc.firstChild);
                loc = div;
                dojo.style(div, {clear: "both"});
              }
              var ppr = (opts.ppr && typeof opts.ppr === "string") ? dojo.getObject(opts.ppr) : opts.ppr;
              if (ppr && !opts.insertInsideBottom && !opts.insertInsideTop && !opts.overRegion)
                ppr.explicitHandler.injectContent(loc, sourceHTML, true); 
              else
                loc.innerHTML = sourceHTML;
              if (opts.overRegion) {
                div.setAttribute("class", "wpf_progress_indicator_box");
                var w = div.clientWidth;
                dojo.addClass(loc, "progress-indicator");
                if (dojo.isIE)
                  dojo.style(loc, { backgroundColor: "white" });
              }
            }
          }
        }
      }
      this.isShowing = true;
    },
    hide: function(opts){
      this.isShowing = false;
      if (opts.useDialog){
        if (this.dlg){
          this.dlg.hide();
          this.dlg = null;
        }
      } else if (opts.hide || opts.overRegion){
        for (var i = 0; i < opts.ids.length; i++){
          var loc = dojo.byId(opts.ids[i]);
          if (loc){
            if (opts.hide)
              loc.style.display = "none";
          }
        }
      }
    }
  };
}