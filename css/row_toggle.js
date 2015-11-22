function runEffect(invoice) {
	var id = invoice.substr(3, invoice.length);
	var divToShow = document.getElementById(id);
	document.getElementById("hiddenInvoiceId").value=id;
	var collapseDivs = document.getElementsByName("collapse");
	var expandDivs = document.getElementsByName("expand");
	for (j = 0; j < collapseDivs.length; j++) {
		if (collapseDivs[j].style.display == "block") {
			collapseDivs[j].style.display = "none";
			expandDivs[j].style.display = "block";
		}
	}
	var divsToHide = document.getElementsByClassName('wpfHideSection');

	for ( var i = 0; i < divsToHide.length; i++) {
		divsToHide[i].style.display = "none";
	}
	divToShow.style.display = "block";
	document.getElementById(invoice).style.display = "none";
	document.getElementById("col" + id).style.display = "block";
	if (isIE () == 9) {
		
		 dojo.query("div[name=collapse]").forEach(function(node){
				console.log("inside the function");
				dojo.style(node,"display","none");
			}); 
			
		dojo.query("div[name=expand]").forEach(function(node){
			dojo.style(node,"display","block");
		});
		document.getElementById(invoice).style.display = "none";
		document.getElementById("col" + id).style.display = "block";  
		}
}

function isIE () {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

function runEffectCollapse(invoiceId) {
	var colId = invoiceId.substr(3, invoiceId.length);
	document.getElementById(colId).style.display = "none";
	document.getElementById("col" + colId).style.display = "none";
	document.getElementById("exp" + colId).style.display = "block";
}

require(["dojo/query", "dojo/dom", "dojo/on", "dojo/ready", "dojo/NodeList-traverse"], function(query, dom, on, ready){
	var trigger_event = function(event, target){	
		on.emit(target, "click", {
			bubbles: true,
			cancelable: true
		});
	};

	var button_invoker = function(invoker_id, invokee_name){
		return query(invoker_id).parent().query("input[name='"+invokee_name+"']");
	};
	
	var anchor_invoker = function(invoker_id, invokee_name){
		return query(invoker_id).parent().query("a[name='"+invokee_name+"']");
	};

	var showAdditionalFilters = function(event){
		event.preventDefault();

		var dojo_obj = button_invoker("#show_all", "ShowAllFilters_Button");
		trigger_event(event, dojo_obj[0]);
	};

	var hideAdditionalFilters = function(event){
		event.preventDefault();

		var dojo_obj = button_invoker("#hide_all", "HideAllFilters_Button");
		trigger_event(event, dojo_obj[0]);
	};

	var InvokeShowFilters = function(event){
		event.preventDefault();
		
		var dojo_obj = button_invoker("#FilterButtonid", "FilterButton");
		trigger_event(event, dojo_obj[0]);
	};

	var InvokeApplyFilters = function(event){
		event.preventDefault();

		var dojo_obj = button_invoker("#apply_filter", "ApplyFiltersButton");
		trigger_event(event, dojo_obj[0]);
	};

	var InvokeExportTable = function(event){
		event.preventDefault();

		var dojo_obj = button_invoker("#export_all", "ExportThisTableButton");
		trigger_event(event, dojo_obj[0]);
	};

	var InvokeDownloadInovices = function(event){
		event.preventDefault();
		
		var dojo_obj = anchor_invoker("#download_all", "downloadAllInvoicesButton");
		trigger_event(event, dojo_obj[0]);
	};

	var show_hide_info = function(current_icon, show_icon_class, state){
		var dojo_current_icon = query(current_icon);
		var dojo_icon_container = dojo_current_icon.parent();
		var dojo_td_parent = dojo_icon_container.parent();
		var dojo_show_icon_container = dojo_td_parent.children(show_icon_class);
		var dojo_tr_parent = dojo_td_parent.parent();
		var dojo_additional_info = dojo_tr_parent.next(".additional-info");

		if(state === "show"){
			var dojo_tbody = dojo_tr_parent.parent();

			dojo_tbody.query(".active-info").addClass("hidden").removeClass(".active-info");
			dojo_tbody.query(".active-info-icon").addClass("hidden").removeClass(".active-info-icon");
			dojo_tbody.query(".inactive-info-icon").removeClass("hidden").removeClass(".inactive-info-icon");

			dojo_additional_info.removeClass("hidden");
			dojo_additional_info.addClass("active-info");

			dojo_icon_container.addClass("hidden");
			dojo_icon_container.addClass("inactive-info-icon");

			dojo_show_icon_container.removeClass("hidden");
			dojo_show_icon_container.addClass("active-info-icon");
		}
		if(state === "hide"){
			dojo_additional_info.addClass("hidden");
			dojo_additional_info.removeClass("active-info");

			dojo_icon_container.addClass("hidden");
			dojo_icon_container.removeClass("active-info-icon");

			dojo_show_icon_container.removeClass("hidden");
			dojo_show_icon_container.removeClass("inactive-info-icon");
		}
	};

	var showAdditionalInfo = function(event){
		event.preventDefault();

		show_hide_info(event.target, ".collaspe-container", "show");
	};

	var hideAdditionalInfo = function(event){
		event.preventDefault();

		show_hide_info(event.target, ".expand-container", "hide");
	};

	ready(function(){
		on(dom.byId("myFormNew"), "#FilterButtonid:click", InvokeShowFilters);
		on(dom.byId("myFormNew"), "#apply_filter:click", InvokeApplyFilters);
		on(dom.byId("myFormNew"), "#export_all:click", InvokeExportTable);
		on(dom.byId("myFormNew"), "#download_all:click", InvokeDownloadInovices);
		on(dom.byId("myFormNew"), "#show_all:click", showAdditionalFilters);
		on(dom.byId("myFormNew"), "#hide_all:click", hideAdditionalFilters);
		on(dom.byId("myFormNew"), ".expand-container > span:click", showAdditionalInfo);
		on(dom.byId("myFormNew"), ".collaspe-container > span:click", hideAdditionalInfo);
		
		        
		
		//Jun27
	});
});