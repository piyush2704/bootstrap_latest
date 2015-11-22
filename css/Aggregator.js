/**
 *	DISCLAIMER OF WARRANTIES:
 *	-------------------------
 *	The following [enclosed] code is sample code created by IBM Corporation.
 *	This sample code is provided to you solely for the purpose of assisting
 *	you in the development of your applications.
 *	The code is provided "AS IS", without warranty of any kind. IBM shall
 *	not be liable for any damages arising out of your use of the sample code,
 *	even if they have been advised of the possibility of such damages.
 */

/**
 * Intended for use with WebSphere Portal 8 Server and Portal 8 Themes.
 * This is a sample aggregator which connects to Coremetrics.
 * This file is designed to establish your cmSetClientID and 
 *	be used in coordination with IBM Digital Data Exchange (DDX)
 *
 * (c) Copyright IBM Corp. 2011. All rights reserved.
 */
 /*
 * cmcustom.js 
 * $Id: WebSpherePortal_Integration.js 235201 2014-04-09 20:34:45Z swehrung $
 * $Revision: 235201 $
 *
 * Version 4.1.0
 *
 * Coremetrics Tag v4.0, 8/7/2006
 * COPYRIGHT 1999-2002 COREMETRICS, INC. 
 * ALL RIGHTS RESERVED. U.S.PATENT PENDING
 *
 * Updated aggregator that grabs improved page and element values
 * Normalization included below to properly handle !ut sessionization and WCM hrefs
 * Update cmSetClientID statement below prior to sending
 */


//Send data to test reports - update first and fourth parameters

cmSetClientID ("90410354", true, "data.coremetrics.com", "tatacommunications.com");

// Send data to production reports - update parameters accordingly
//cmSetClientID ("99999999", true, "data.coremetrics.com", "thesite.com");
	
//We advise that logic detecting the environment be implemented (you can edit this file as needed) so that the correct test or production call will be made automatically  (through evaluation of page document.domain for example) 

/**
* LINK NORMALIZATION BELOW
* Updated normalization to removes session values from hrefs. 
* Created and proxo tested on 3/27/2012 by Stephanie Wehrung
* added or '%21ut' to handle HTML encoding issue seen on some 
* links in firefox browser added "%21ut" also updated the WCM 
* variable to be just '?1dmy&' since I was seeing 
* '?1dmy&urile=wcm%3apath%3a' and '?1dmy&pswid' used for WCM content
*/

function myNormalizeURL(url, isHref) {
    var newURL = url;
    if (newURL.toLowerCase().indexOf("!ut")>-1){
    	var startParam=newURL.toLowerCase().indexOf("!ut");
		var wcmParam=newURL.toLowerCase().indexOf("?1dmy&"); 
    	var endParam=newURL.toLowerCase().indexOf("?cm");    	
    		if (wcmParam!=-1){
    		newURL=newURL.substring(wcmParam)
    		} else {
    		 	if (endParam==-1){
				newURL=newURL.substring(0,startParam)
				} else {
				newURL=newURL.substring(0,startParam)+newURL.substring(endParam);
				} 
			}
	}
	
	// %21ut case created to deal with minor firefox HTML encoding 
	if (newURL.toLowerCase().indexOf("%21ut")>-1){
    	var startParam=newURL.toLowerCase().indexOf("%21ut");
		var wcmParam=newURL.toLowerCase().indexOf("?1dmy&"); 
    	var endParam=newURL.toLowerCase().indexOf("?cm");    	
    		if (wcmParam!=-1){
    		newURL=newURL.substring(wcmParam)
    		} else {
    		 	if (endParam==-1){
				newURL=newURL.substring(0,startParam)
				} else {
				newURL=newURL.substring(0,startParam)+newURL.substring(endParam);
				} 
			}
	}
     var blackList = ["cmplaceholder=","paramHash="];
     var paramString;
     var paramIndex = newURL.indexOf("?cm");
     var params;
     var keepParams = new Array();
     var goodParam;

     if (paramIndex > 0) {
	paramString = newURL.substring(paramIndex+1);
        newURL = newURL.substring(0, paramIndex);
	params = paramString.split("&");

		for(var i=0; i<params.length; i++) {
			goodParam = true;
			for(var j=0; j<blackList.length; j++) {
				if (params[i].toLowerCase().indexOf(blackList[j].toLowerCase()) == 0) {
					goodParam = false;
				}
			}
			if(goodParam == true) {
				keepParams[keepParams.length] = params[i];
			}
		}
		newURL += "?" + keepParams.join("&");
    }
    if (defaultNormalize != null) {
        newURL = defaultNormalize(newURL, isHref);
    }
    if (newURL.length > 1023) {    // last ditch Target/HREF URL truncation to avoid linkclick data rejection
	newURL = newURL.substring(0,1023);
    }
    return newURL;
}

// install normalization
if (document.cmTagCtl != null) {
    var func = "" + document.cmTagCtl.normalizeURL;
    if (func.indexOf('myNormalizeURL') == -1) {
        defaultNormalize = document.cmTagCtl.normalizeURL;
        document.cmTagCtl.normalizeURL = myNormalizeURL;
    }
}

cmSetupNormalization(null, null, myNormalizeURL);

/**
 * The aggregator for Websphere Portal 8 which grabs values and places them into tags is below
*/

(function(){

webanalytics = new Object;
webanalytics.page = new Object;


	/**
	 * DO NOT CHANGE THE CODE BELOW THIS LINE.
	 * (c) Copyright IBM Corp. 2011. All rights reserved.
	 */
	
	/**
	 * Regular expression to find asa tags.
	 * Locates all tags with an "asa." prefix.
	 */
	var exp = new RegExp("(^|\\s)asa\..*(\\s|$)");
	
	
	/**
	 * Function to construct the aggregator
	 */
	var CoremetricsAggregator = function() {

		/**
		 * The aggregator instance
		 */
		var aggr = {};

		/**
		 * Bucket for page-specific ASA tags
		 */
		var pTags = {};

		/**
		 * Public function which parses the given DOM nodes to find
		 * ASA microformats.
		 */
		aggr.parse = function(/*DOMNode[]*/ ns, /*Function?*/ cb, /*JSON*/meta) {
			
			if (meta.type == "PAGE") {
				// page notification
				parsePage(ns, meta.id);
			} else if (meta.type == "PORTLET") {
				// portlet notification				
				parsePortlet(ns, meta.id);
			} else if (meta.type == "AJAX") {
				// TODO
			}
			// invoke the callback (if any)
			if (cb) cb();
		};

		/**
		 * Parses the DOM to find all page-specific microformats.
		 */
		var parsePage = function(/*DOMNode[]*/ ns, /*String*/pageID) {
			// locate our root element which contains all page-specific microformats
			//var pRoot = document.getElementsByClassName("wpthemeControlBody wpthemeOverflowAuto wpthemeClear");
			var pRoot = byId("asa.page");
			//var pRoot = byClassName("wpthemeControlBody wpthemeOverflowAuto wpthemeClear");
			/*var cm_div = document.getElementsByTagName("div");
			if(typeof cm_div!= "undefined" && cm_div!= null){
				for(i=0;i<cm_div.length;i++){
				
					if(typeof cm_div[i] != "undefined" && cm_div[i]!= null){
					
						var cm_div_class = cm_div[i].className;
						if(typeof cm_div_class != "undefined" && cm_div_class!= null&& cm_div_class == "wpthemeControlBody wpthemeOverflowAuto wpthemeClear"){
						
							
							pRoot = cm_div[i];
							//alert("got it");
							
							
						
						}
					}
				}
			}*/
			// data bucket
			var d = {};
			if (pRoot) {
				parse(pRoot, d);
				//console.log(i$.toJson(d));
			} else if (console) {
				console.log("WARNING: Root element for page-specific analytics tags not found.");
			}
			// update our cache
			pTags = d;
			// communicate data to Coremetrics
			if (!isEmpty(d)) {
				processRegistrationTag(d);
				processPageTags(d);
			}
			
		};

		/**
		 * Parses the DOM to find all portlet element-specific microformats.
		 */
		var parsePortlet = function(/*DOMNode[]*/ ns, /*String*/ portletID) {
			// check if can skip the parsing process
			if (!ns) {
				if (console) console.log("WARNING: DOM root node for portlet " + portletID + " not found.");
				return;
			}
			// iterate
			if (ns && ns.length > 0) {
				// bucket to collect the portlet data
				var d = {};
				copy(pTags, d);
				// parse the given DOM nodes for ASA microformats
				for (var i = 0, l = ns.length; i < l; ++i) {
					parse(ns[i], d);
				}
				// communicate the data to the Coremetrics server
				if (!isEmpty(d)) {
					processPortletTags(d);
				}
				
				
				
			}
		};

		/**
		 * Communicates the given page-specific data to the
		 * Coremetrics server by creating a pageview tag.
		 */
		var processPageTags = function(/*JSON*/ d) {
			var cm_pgTitle = "";
			var cm_pgTitle_temp = "";
			var cm_catId = "";
			var query = "";
			var res = "";
			var cm_check_wcm = 0;
			//cm_pgTitle_temp = single(d["asa.wcm.content_item.path"])||single(d["asa.url"]) ;
			var cm_pgTitle_temp ="";
			var cm_catId = "";
			var cm_pgTitle = "";
			var cm_url_check = window.location.href.toLowerCase();
			
						
						
						
							cm_pgTitle_temp = single(d["asa.url"]) ;
							if(typeof cm_pgTitle_temp!= "undefined" && cm_pgTitle_temp!= "null" && cm_pgTitle_temp != ""){
								cm_check_wcm = 2;
								
							
							}
							
			
			
			

		if(cm_check_wcm ==0){
									
			
			var cm_span = document.getElementsByTagName("span");
			if(typeof cm_span != "undefined" && cm_span!= null){
				for(j=0;j<cm_span.length;j++){
					if(typeof cm_span[j]!= "undefined" && cm_span[j]!= null && cm_span[j].className == "asa.wcm.content_item.path"){
									
						cm_pgTitle_temp = cm_span[j].innerHTML;
										
						cm_check_wcm = 1;
										
							
					}
				}
			}
									
		}

		
cm_pgTitle_temp = cm_pgTitle_temp.toUpperCase()
var cm_portal=cm_pgTitle_temp.search("PORTAL");
var cm_pgTitle = "";

		
		if(cm_portal!= -1){
			
		    var cm_sub = cm_pgTitle_temp.substring(cm_portal+7,cm_pgTitle_temp.length);
			
			if(cm_sub != ""){
				if(cm_sub.indexOf("/")!= -1){
					cm_catId = cm_sub.substring(0,cm_sub.lastIndexOf("/"));	
					cm_catId = cm_catId.replace(/\//g,":").replace(/-/g," ");
					
					var matchesCount = cm_sub.split("/").length - 1;
					if(matchesCount > 1){
						
						var cm_parts = cm_sub.split("/");
						//cm_pgTitle = cm_sub.substring(cm_ind+1,cm_sub.length);
						//cm_pgTitle = cm_pgTitle.replace(/\//g,":").replace(/-/g," ");
						var len = cm_parts.length;
						cm_pgTitle = cm_parts[len-2]+":"+cm_parts[len-1];
						
						
						
						
						
					}
					else{
					
						cm_pgTitle = cm_sub.replace(/\//g,":").replace(/-/g," ");
					}
					
					
					
					
					
				}
				else{
					cm_catId  = cm_sub;
					cm_pgTitle = cm_sub;
				}
			}
			else{
				cm_catId = "WPS_Portal";
				cm_pgTitle = "WPS_Portal";
			
			
			}
				
				
		}
		else{
			var cm_index = cm_pgTitle_temp.lastIndexOf("/");
			cm_catId = cm_pgTitle_temp.substring(0,cm_index);
			cm_catId = cm_catId.replace(/\//g,":").replace(/-/g," ");
				
			var cm_pg_split = cm_pgTitle_temp.split("/");
			var cm_length = cm_pg_split.length;
			//cm_pgTitle = cm_pg_split[cm_length-2].replace(/-/g," ").toUpperCase()+" : "+cm_pg_split[cm_length-1].replace(/-/g," ");
			if (cm_length > 2)
			{
				var cm_part1 = cm_pg_split[cm_length-2].replace(/-/g," ");
				var cm_part2 = cm_pg_split[cm_length-1].replace(/-/g," ");
				if(cm_part1 == cm_part2){
			
					cm_pgTitle = cm_part1;
			
				}
				else{
			
					cm_pgTitle = cm_part1+" : "+cm_part2;
			
				}
			}
			
			
			
		}
			
			
		
    
    

			
		if(	cm_check_wcm == 0){
		
			cm_pgTitle = cmGetDefaultPageID(); 
			var cm_url = window.location.href.toUpperCase();
			
			var cm_index1 = cm_url.search("PORTAL");
			var cm_index2 = cm_url.indexOf("!");
			
			if(cm_index1!= -1)
			{
							
				var cm_cat1 = cm_url.substring(cm_index1+7,cm_index2).split("/");
				catId =cm_cat1[0]+":"+ cm_cat1[1];
				
		    }
			
		}

		
		/*var cm_span = document.getElementsByTagName("span");
		for(i=0;i<cm_span.length;i++){
			if(typeof cm_span[i]!= "undefined" && cm_span[i]!= "null" ){
			
				var cm_class= cm_span[i].className;
				if(typeof cm_class!= "undefined" && cm_class!= "null" && cm_class == "asa.search.query"){
				
					query = cm_span[i].innerHTML;
					
					
				}
				
				if(typeof cm_class!= "undefined" && cm_class!= "null" && cm_class == "asa.search.results"){
				
					res = cm_span[i].innerHTML;
					
				}
				
				
				
				
			
			}
		
		
		}*/
			
			
			
			/*if( typeof query != 'undefined' && query){
				alert(single(d["asa.search.query"]));
			
				query = single(d["asa.search.query"]);
			}
			
			if(typeof single(d["asa.search.results"]) != "undefined"){
			
				alert(single(d["asa.search.results"]));
				 res = single(d["asa.search.results"]);
				
			
			}*/
			
			
			
			
			if (res) res += "";
			var attr = [];
			setPageAttributes(attr, d);
			var pgAttr = attr.join("-_-");
			if(cm_url_check.indexOf("/ngp/userlist/")!= -1){
			
					cm_catId = "MANAGE USERS";
			
			}
			
			
			else if(cm_url_check.indexOf("dashboard_billing_troubletickets")!= -1){
			
				cm_catId = "DASHBOARD";
			
			}
			else if(cm_url_check.indexOf("dashboard_circuit_troubletickets")!= -1){
			
				cm_catId = "DASHBOARD";
			
			}
			else if(cm_url_check.indexOf("dashboard_circuit_billing")!= -1){
			
				cm_catId = "DASHBOARD";
			
			}
		
			else if(cm_url_check.indexOf("/ngp/managepermissions/")!= -1){
			
				cm_catId = "MANAGE USERS";
			
			}
			else if(cm_url_check.indexOf("/createaccount/")!= -1){
				
				cm_catId = "MANAGE USERS";
			
			}
			
			else if(cm_url_check.indexOf("ngp/editpreferences/")!= -1){
				
				cm_catId = "VIEW PREFERENCES";
			
			}
			
			else if(cm_url_check.indexOf("ngp/webemail/")!= -1){
				
				cm_catId = "BILLING";
			
			}
			else if(cm_url_check.indexOf("/ngp/invoicedetails/")!= -1){
				
				cm_catId = "BILLING";
			
			}
			else if(cm_url_check.indexOf("ngplogin")!= -1){
				
				cm_catId = "LOGIN";
				cm_pgTitle = "LOGIN";
			
			}
			
			else if(cm_url_check.indexOf("downloadarchive")!= -1){
				
				cm_catId = "BILLING";
			
			}
			else if(cm_url_check.indexOf("/ngp/forgotpassword/")!= -1){
				
				cm_catId = "LOGIN";
			
			}
			else if(cm_url_check.indexOf("/ngp/unlockaccount/")!= -1){
				
				cm_catId = "LOGIN";
			
			}
			else if(cm_url_check.indexOf("ngp/firstuselogin/")!= -1){
				
				cm_catId = "LOGIN";
			
			}
			else if(cm_url_check.indexOf("tutorialandguides")!= -1){
				
				cm_catId = "HELPANDSUPPORT";
			
			}
			else if(cm_url_check.indexOf("/ngp/searchcenter/")!= -1){
				
				cm_catId = "SEARCH";
				
				if(cm_url_check.indexOf("query=")!= -1){
				var index = cm_url_check.indexOf("query=");
				var query1 = cm_url_check.substring(index+6,cm_url_check.length);
				}
				query = cm_decodeHtml_URL(query1);
				res = selAllCount;
				if(res>0){
				
					cm_pgTitle = "SEARCH SUCCESSFUL";
				
				}
				else if(res == 0){
				
					cm_pgTitle = "SEARCH UNSUCCESSFUL";
				
				}
			
			}
			
			
			
			cm_catId=cm_decodeHtml_URL(cm_catId);
			cm_pgTitle = cm_decodeHtml_URL(cm_pgTitle);
			
			
				webanalytics.page.categoryid=cm_catId;
				webanalytics.page.pageid=cm_pgTitle;
				webanalytics.page.searchterm=query;
				webanalytics.page.searchresults=res;
				webanalytics.page.attributes=pgAttr;
				webanalytics.page.extrafields="";
			
			// process analytics tags
			cmCreatePageviewTag(webanalytics.page.pageid, webanalytics.page.categoryid, webanalytics.page.searchterm, webanalytics.page.searchresults, webanalytics.page.attributes, webanalytics.page.extrafields);
			processAnalyticsTags(d, cm_pgTitle, pgAttr);
			
			
		};

		/**
		 * Communicates the given page element-specific data to the
		 * Coremetrics server by creating element tags.
		 * Element tags are created for
		 *   - the portlet
		 *   - for each portlet screen
		 *   - for the web content item
		 *   - for each analytics tag (includes site promotions)
		 * To NOT send any element tags, comment or delete the script starting here
		 */
		 		var processPortletTags = function(/*JSON*/ d) {
			var attr = [];
			// portlet
			var pgTitle = single(d["asa.page.title"]) || single(d["asa.page.id"]);
			var cm_element_catId = webanalytics.page.pageid;
			if(cm_element_catId.length>50){
				cm_element_catId = cm_element_catId.substring(0,50);
			
			}
			
			var ptTitle = single(d["asa.portlet.title"]) || single(d["asa.portlet.id"]);
			setPageAttributes(attr, d);
			setPortletAttributes(attr, d);
			var title = ptTitle;
			var ptAttr = attr.join("-_-");
			// create element tag 
			// updated to have page ID be the category
			var temp_title = title;
			if(title.length>50){
				
				title = title.substring(0,50);
				
			}
			// To disable element tags generated from asa.portlet.title/id comment or delete line below
			cmCreateElementTag(title, cm_element_catId, ptAttr);
			// changed from cmCreateElementTag(title, "asa.portlet", ptAttr); to provide page ID context 
			// portlet screens
			var ptScr = multi(d["asa.portlet.screen.title"]);
			if (ptScr && ptScr.length > 0) {
				for (var i = 0, l = ptScr.length; i < l; ++i) {
					var scrTitle = ptScr[i];
					if(scrTitle.length>50){
						
						scrTitle = scrTitle.substring(0,50);
						
					
					}
					// To disable element tags generated from asa.portlet.screen.title comment or delete line below
					cmCreateElementTag(scrTitle, cm_element_catId, ptAttr);
					// changed from cmCreateElementTag(scrTitle, "asa.portlet.screen", ptAttr); to provide page ID context
				}			
			}
			// analytics tags
			processAnalyticsTags(d, title, ptAttr);
			// web content
			var ctTitle = single(d["asa.wcm.content_item.title"]) || single(d["asa.wcm.content_item.id"]);
			if (ctTitle) {
				// add the content attributes
				setContentAttributes(attr, d);
				var ctAttr = attr.join("-_-");
				var temp_title_new = ctTitle;
				// create element tag
				if(temp_title_new.length>50){
					
					temp_title_new = temp_title_new.substring(0,50);
					
				
				}
				// To disable element tags generated from asa.wcm.content_item. comment or delete line below
				cmCreateElementTag(temp_title_new, cm_element_catId, ctAttr);
				// changed from cmCreateElementTag(title, "asa.wcm.content_item", ctAttr); to provide page ID context
				
			}
		};

		/**
		 * Creates element tags for the given analytics tags (site promotions etc.)
		 */		 
		var processAnalyticsTags = function(/*JSON*/tags, /*String*/ref, /*String*/attr) {
			if (!tags) return;
			for (t in tags) {
				if (tags.hasOwnProperty(t) && t.indexOf("asa.tag.") == 0) {
					var v = multi(tags[t]);
					if (v && v.length > 0) {
						for (var i = 0, l = v.length; i < l; ++i) {
							var cat = t, title = v[i];
							var cm_element_id = title + "::" + ref;
							if(cm_element_id.length>50){
								cm_element_id = cm_element_id.substring(0,50);
							
							}
							if(cat.length>50){
								cat = cat.substring(0,50);
							
							}
							// To disable element tags generated from asa.tag. comment or delete line below
							cmCreateElementTag(cm_element_id, cm_element_catId, attr);
						}
					}
				}
			}
		};
		/**
		* STOP COMMENTING OR DELETING SCRIPT FOR PORTLET ELEMENT TAGS HERE
		*/
		
		/**
		 * Communicates the current visitor /user to the Coremetrics
		 * server by creating a registration tag. Note that the registration
		 * tag is only created on the first page of a session where the
		 * Portal visitorID exists.	The cmReg status field is set to prevent
		 * multiple registration tags that refer to the same session.
		 */
		var processRegistrationTag = function(/*JSON*/ d) {
			if (cI("cmReg") != 'Y') {
				// get the visitor ID
				var id = single(d["asa.visitor"]);
				// create registration tag
				if (id) {
					cmCreateRegistrationTag(id, null, null, null, null, null, ibmCfg.userName);
					document.cookie = "cmReg=Y; path=/";
				}
			}
		};


		
		/**
		 * Sets the page-specific attributes.
		 */
		var setPageAttributes = function(/*Array*/ a, /*JSON*/ d) {
			var id = single(d["asa.page.id"]);
			var tit = single(d["asa.page.title"]);
			var url = single(d["asa.url"]);
			var bc = single(d["asa.page.breadcrumb"]);
			var loc = single(d["asa.page.locale"]);
			var dir = single(d["asa.page.direction"]);
			if (id) a[19] = id;
			if (tit) a[20] = tit;
			if (loc) a[21] = loc;
			if (dir) a[22] = dir;
			if (url) a[23] = url;
			if (bc) a[24] = bc;
		};

		/**
		 * Sets the portlet-specific attributes.
		 */
		var setPortletAttributes = function(/*Array*/ a, /*JSON*/ d) {
			var id = single(d["asa.portlet.id"]);
			var tit = single(d["asa.portlet.title"]);
			var loc = single(d["asa.portlet.locale"]);
			var dir = single(d["asa.portlet.direction"]);
			var scr = multi(d["asa.portlet.screen.title"]);
			var scrID = single(d["asa.portlet.screen.id"]);
			var sel = single(d["asa.portlet.selected"]);
			if (id) a[29] = id;
			if (tit) a[30] = tit;
			if (loc) a[31] = loc;
			if (dir) a[32] = dir;
			if (scr) a[33] = scr.join(", ");
			if (scrID) a[34] = scrID;
			if (sel) a[35] = sel;
		};
		
		/**
		 * Sets the content-specific attributes.
		 */
		var setContentAttributes = function(/*Array*/ a, /*JSON*/ d) {
			var id = single(d["asa.wcm.content_item.id"]);
			var tit = single(d["asa.wcm.content_item.title"]);
			var path = single(d["asa.wcm.content_item.path"]);
			var auth = multi(d["asa.wcm.content_item.authors"]);
			if (id) a[39] = id;
			if (tit) a[40] = tit;
			if (path) a[41] = path;
			if (auth) a[42] = auth.join(", ");
		};
		
		/**
		 * Parses the DOM subtree with the given root node to find all
		 * all ASA microformats. Assumes that analytics data is only carried
		 * by span elements.
		 */
		var parse = function(/*DOMNode*/ n, /*JSON*/ b) {
			// iterate all span elements
			n = n || document;
			//alert(n);
			var s = n.getElementsByTagName("span");
			//alert(s);
			//alert(s);
			for (var i = 0, l = s.length; i < l; ++i) {
				if (!parseNode(s[i], b)) break;
			}
		};
		
		/**
		 * Parses a single DOM node to find an ASA tag.
		 */
		var parseNode = function(/*DOMNode*/ n, /*JSON*/ b) {
			// get the data tuple
			var p = asa(n);
			if (p) {
				var n = p.n, v = p.v, vs = b[n];
				if (!vs) {
					vs = [];
					b[n] = vs;
				}
				if (!contains(vs, v)) {
					vs.push(v);
				}
			}
			return true;
		};

		/**
		 * Returns the inner HTML of the element that matches the
		 * given class name.
		 */
		var asa = function(/*DOMNode*/ n) {
			var c = n.className;
			
			if (c && exp.test(c)) {
				// return name /value pair
				return {"n": c, "v": n.innerHTML};
			} else {
				return null;
			}
		};

		var isArray = function(o) {
			return o && (typeof o === "array" || o instanceof Array);
		};

		var byId = function(id) {
			return id ? document.getElementById(id) : null;
		};
		
		var byClassName = function(id) {
			var cm_proot ="";
			var cm_div = document.getElementsByTagName("div");
			if(typeof cm_div!= "undefined" && cm_div!= null){
				for(i=0;i<cm_div.length;i++){
				
					if(typeof cm_div[i] != "undefined" && cm_div[i]!= null){
					
						var cm_div_class = cm_div[i].className;
						if(typeof cm_div_class != "undefined" && cm_div_class!= null&& cm_div_class == id){
						
							alert("got it");
							cm_proot = cm_div[i];
							
							
						
						}
						else{
							cm_proot = null;
						
						}
					
					
					}
				
				}
			
			
			}
			return cm_proot;
		};
		var isEmpty = function(/*Object*/o) {
			for (var k in o) {
				if (o.hasOwnProperty(k)) {
					return false;
				}
			}
			return true;
		};
		
		var contains = function(/*Array*/a, /*Object*/o) {
			if (a) {
				for (var i = a.length - 1; i >= 0; --i) {
					if (a[i] === o) {
						return true;
					}
				}
			}
			return false;
		};

		var copy = function(/*JSON*/ src, /*JSON*/ trg) {
			if (src && trg) {
				for (var key in src) {
					// don't copy analytics tags
					if (src.hasOwnProperty(key) && key.indexOf("asa.tag.") < 0) {
						trg[key] = src[key];
					}
				}
			}
		};

		var single = function(v) {
			if (v && isArray(v) && v.length > 0) {
				return v[0];
			} else {
				return v;
			}
		};

		var multi = function(v) {
			if (v && !isArray(v)) {
				return [v];
			} else {
				return v;
			}
		};
		
		return aggr;
	
	};
	 var cm_decodeHtml_URL=function(strValue) {
		 if (strValue!=null) {
	strValue = strValue.replace(/\%2F/gi,"/");
	strValue = strValue.replace(/\%3F/gi,"?");
	strValue = strValue.replace(/\%3D/gi,"=");
	strValue = strValue.replace(/\%26/gi,"&");
	strValue = strValue.replace(/\%40/gi,"@");     
	strValue = strValue.replace(/\%23/gi,"#");
	strValue = strValue.replace(/\%20/gi," ");
	strValue = strValue.replace(/\+/gi," ");
	strValue = strValue.replace(/\%22/gi,'"');
	strValue = strValue.replace(/\%27/gi,"'");
	strValue = strValue.replace(/\%2C/gi,",");
	strValue = strValue.replace(/\%28/gi,"(");
	strValue = strValue.replace(/\%29/gi,")");
	strValue = strValue.replace(/\%7C/gi,"|");
	strValue = strValue.replace(/\%3A/gi,":");
		 }
		 return strValue;
	};
	
	var cm_GetValueFromUrl = function(cmUrl, cmKey){
	cmUrl = (cmUrl != null) ? "?" + cm_Trim(cmUrl.toLowerCase()) : null;
	cmKey = (cmKey != null) ? cm_Trim(cmKey.toLowerCase()) : null;

	if (cmUrl == null || cmKey == null || cmUrl.indexOf(cmKey) == -1) 
		return null;
	
	var start = cmUrl.indexOf('&' + cmKey + '=');
	start = (start == -1) ? cmUrl.indexOf('?' + cmKey + '=') : start;
	if (start >= 0)
	{
		start = start + cmKey.length;
		var end = cmUrl.indexOf("&", start);
		if(end == -1) 
			end = cmUrl.length;
		var middle = cmUrl.indexOf("=", start);
		return cmUrl.substring(middle + 1, end);
	}
	return null;
};

	

	// register with site analytics mediator


		// workaround until onload is fixed
		var aggregator = new CoremetricsAggregator();
		com.ibm.portal.analytics.SiteAnalyticsMediator.register(function() {
			aggregator.parse.apply(aggregator, arguments);
		});	
		

})();