// Wait for the DOM to be ready before working with it
require(
	[ "dojo/query", "dojo/dom-construct", "dojo/dom", "dojo/dom-attr",
			"dojo/ready", "dojo/dom-class", "dojo/on",
			"dojo/NodeList-dom", "dojo/domReady!", "dojo/NodeList-traverse" ],
	function(query, domConstruct, dom, domAttr, ready, domClass, on) {

		ready(function() {
		query(".h61class").forEach(function(node) {			
			var dojo_node = query(node);
			var dojo_tr = dojo_node.parent().parent();
			var sibling = dojo_tr.next();
			var payment_details = query(".account-summary > div:last-child", sibling.attr('id')[0]);
			
			if (dojo.getAttr(node, "id") == "Overdue") {
				console.log("Overdue");
				dojo_node.next("[name='h62']").addClass("hidden");
				var row = domConstruct.toDom("<div class='icon left'><i class='fa fa-exclamation-circle' id='exclamation_circle' style='color:red;'></i></div>");
				domConstruct.place(row, node,"before");
				dojo_tr.addClass("odue");
				payment_details.addClass("odue");
				console.log(dojo_node);
				console.log(sibling);
				console.log(payment_details);
				
				
			}
			if (dojo.getAttr(node, "id") == "Payment Received") {
				console.log("Payment Received");
				dojo_node.next("[name='h62']").addClass("hidden");
				var row = domConstruct.toDom("<div class='icon left'><i class='fa fa-check'id='fa_check' style='color:grey;'></i></div>");
				domConstruct.place(row, node,"before");
				dojo_tr.addClass("paid");
			}
			if ((dojo.getAttr(node, "id")) == "In Dispute" || (dojo.getAttr(node, "id")) == "Payment Due" || (dojo.getAttr(node, "id")) == "Partially Paid") {
				if(dojo.getAttr(node, "id") == "Payment Due"){
					console.log("Payment Due");
					dojo_tr.addClass("due");
				};
				if(dojo.getAttr(node, "id") == "In Dispute"){
					console.log("InDispute");
					dojo_node.next("[name='h62']").addClass("hidden");
					dojo_tr.addClass("odue");
					
				};
				domClass.add(node, "recentStatus");
			}
			query(".wpfListColumn > div").forEach(function(node) {
				if ((dojo.getAttr(node, "id")) == "Overdue") 
					domClass.add(node, "odue");
			});	
		});
		
		
		///ie9//////////////
		//Jun27
		   if(dojo.isIE ==9){
		        //console.log("IE9");
		        dojo.query("div[name=bLContainer]").forEach(function(cnode,index){
		        //console.log("node",cnode);
		        //console.log("index",index);
		        if(index>=1){
		        	//console.log("index is > 1");
		        	var paginationNode=dojo.query(".page-button-container")[0];
		        	//console.log("pagination node is: "+paginationNode);
		        	if(paginationNode){
		        		//console.log("moving to parent node");
		        		dojo.place(paginationNode,dojo.query("div[name=div2]")[0],2);
		        	}
		            dojo.destroy(cnode);
		            //console.log("deleted");
		        }
		    });
		//dojo.query("div#invoices_container");
		     
		        
		         }
		   else
			   console.log("Not ie9");
//		query(".wpfFixedTop").forEach(function(node) {
//			console.log("inside 2");
//
//			if ((dojo.getAttr(node, "status")) == "Payment Due") 
//				domClass.add(node, "due");
//			if ((dojo.getAttr(node, "status")) == "Overdue" || (dojo.getAttr(node, "status")) =="In Dispute") 
//				domClass.add(node, "odue");
//			if ((dojo.getAttr(node, "status")) == "Payment Received") 
//				domClass.add(node, "paid");
//		});
//		
//		
//		query(".wpfListColumnItemLeft > div").forEach(function(node) {
//			if ((dojo.getAttr(node, "id")) == "Overdue") 
//				domClass.add(node, "odue");
//		});	
//		query(".wpfListColumnItemLeftCenter > div").forEach(function(node) {
//				if ((dojo.getAttr(node, "id")) == "Overdue") 
//					domClass.add(node, "odue");
//		});
	});
});