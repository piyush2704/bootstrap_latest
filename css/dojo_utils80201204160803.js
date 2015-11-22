/* Licensed Materials - Property of IBM 5724-O03
 * Copyright IBM Corp. 2011
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * See WebSphere Portlet Factory ( product id 5724-O03 ) product license for terms and conditions of use.
 */
if (typeof wpf_dojo_utils80201204160803 == "undefined")
{
  wpf_dojo_utils80201204160803={
    isDojoStylesLoaded: function(){
      var retval=false;
      try{
        for(var i=0; i<document.styleSheets.length; i++){
          var sheet=document.styleSheets[i];
          var ct=sheet.cssText;
          if (ct&&(typeof ct !="undefined")&&ct.indexOf("dijit")>=0){
            retval = true;
            break;
          }else{
            var rules = sheet.rules || sheet.cssRules;
            for (var j = 0; j < rules.length; j++){
              var sel=rules[j].cssText;
              if (typeof sel == "undefined")
                sel=rules[j].selectorText;
              if (sel && sel.indexOf("dijit")>=0){
                retval = true;
                break;
              }
            }
          }
        }
      }catch(err){}
      if (retval)
        wpf_dojo_utils80201204160803.isDojoStylesLoaded=function(){return true;}
      return retval;
    },
    updateFormInputs: function(id){
      dojo.forEach(dojo.query('#'+id+' form'),function(frm){
        dojo.forEach(dojo.query('*',frm),function(el){
          var widget;
          if(el.id&&(widget=dijit.byId(el.id))&&!widget.form){
            widget.form=frm;
          }
        });
      });
    },
    toggleClass: function(currentNode, targetClass, toggleClass){
      var parent = currentNode.parentNode;
      var targetNodes = null;
      while(parent != null){
        var nodes = dojo.query("." + targetClass, parent);
        if(nodes.length > 0){
          targetNodes = nodes;
          break;
        } else
          parent = parent.parentNode;
      }
    	if(targetNodes != null){
    	  dojo.forEach(targetNodes,function(node){
    	    dojo.toggleClass(node, toggleClass);
    	  });
   	}
    },
    loadIfNeeded:function(wpfDojoUrl,locale,loadViaParent,debug){
     window.wpfLoadedDojo=false;
     if(typeof dojo == "undefined"){
      djConfig={parseOnLoad:false,isDebug:false,locale:locale,isDebug:debug};
      var url=wpfDojoUrl;
      if (loadViaParent){
       if (opener!=null && typeof opener.dojo != "undefined" && typeof opener.dojo != "unknown")
        url=opener.dojo.baseUrl+"dojo.js";
       else if(parent!=null && typeof parent.dojo != "undefined" && typeof parent.dojo != "unknown")
        url=parent.dojo.baseUrl+"dojo.js";
      }
      document.write("<"+"script src='"+url+"'> </"+"script>");
      window.wpfLoadedDojo=true;
     }
    }
  };
}
