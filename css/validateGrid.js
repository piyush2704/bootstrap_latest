   var today=new Date();
    
	var CPFromMin=new Date();
	CPFromMin.setFullYear(CPFromMin.getFullYear() - 1);
	var CPFromMax=new Date();
	
CPFromMax.setMonth(CPFromMax.getMonth()+6);

	var CPToMin=new Date();
	CPToMin.setFullYear(CPToMin.getFullYear() - 1);
	var CPToMax=new Date();
	CPToMax.setMonth(CPToMax.getMonth()+6);

var ServIdarray = [];
var InvoiceIdarray = [];
var ticketNoArray = [];
//onclick of service Id
function getTableInServiceId(value, inRowIndex) {
	value = nullCheck(value);
	
	var varInvoiceId = this.grid.getItem(inRowIndex).RelatesToInvoiceID;
	var varServiceId = this.grid.getItem(inRowIndex).ServiceId;
	var varTicketNumber = this.grid.getItem(inRowIndex).childTickets;
	varInvoiceId = nullCheck(varInvoiceId);
	varServiceId = nullCheck(varServiceId);
	varTicketNumber = nullCheck(varTicketNumber);
	if (varInvoiceId != "" && varInvoiceId != "undefined" && varInvoiceId.indexOf(",") != -1) { 
		// service alias popup
		console.log("inside if service id with invoice id 1 ");
		return new dijit.form.Button({
			label : "Multiple",
			onClick : function() {
				var serviceDailogContent = varServiceId;
				var invoiceDialogContent = varInvoiceId;
				var ticketDialogContent = varTicketNumber;
				//serviceDailogContent = serviceDailogContent.split(",").sort().join(",");
				serviceDailogContent=createServiceTable(serviceDailogContent,invoiceDialogContent,ticketDialogContent);
				//dynamic table
				
				dijit.byId("multipleServiceIds").setContent(serviceDailogContent);
				dijit.byId("multipleServiceIds").show();
			}
		})
	}// type of ticket end if

	else if ((varInvoiceId == "" || varInvoiceId.indexOf(",") == -1) && varServiceId.indexOf(",") != -1) {
		// service Id popup
		console.log("inside else if service id with service alias 1 ");
		return new dijit.form.Button({
			label : "Multiple",
			onClick : function() {
				var serviceDailogContent = varServiceId;
				//serviceDailogContent = serviceDailogContent.split(",").sort().join(",");
				serviceDailogContent=createServiceTable(serviceDailogContent,invoiceDialogContent);
				//dynamic table
				
				dijit.byId("multipleServiceIds").setContent(serviceDailogContent);
				dijit.byId("multipleServiceIds").show();
			}
		})
	}

	else {
		return value;
	}
}

function createServiceTable(serviceDailogContent,invoiceDialogContent,ticketDialogContent) {
	createServiceArray(serviceDailogContent,invoiceDialogContent,ticketDialogContent);
	var myTableDiv = document.getElementById("ServiceDynamicTable");
	var table = document.createElement('TABLE');
	table.border = '1';
	table.id = 'my_table';

	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);

	var tr1 = document.createElement('TR');
	tr1.id = "firstRow";
	tableBody.appendChild(tr1);
	var td1 = document.createElement('TD');
	td1.id = "serviceId_td";
	td1.style.color="#3D86C6";
	td1.appendChild(document.createTextNode("SERVICE ID"));
	
	var td2 = document.createElement('TD');
	td2.id = "invoiceId_td";
	td2.style.color="#3D86C6";
	td2.appendChild(document.createTextNode("INVOICE ID"));
	
	var td3 = document.createElement('TD');
	td3.id = "ticketNumber_td";
	td3.style.color="#3D86C6";
	td3.appendChild(document.createTextNode("TICKET NUMBER"));

	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);

	var tr2 = document.createElement('TR');
	tableBody.appendChild(tr2);

	for ( var j = 0; j < InvoiceIdarray.length; j++) {
		var tr2 = document.createElement('TR');
		tr2.id = "secondRow";
		tableBody.appendChild(tr2);
		
		var td3 = document.createElement('TD');
		var td4 = document.createElement('TD');
		var td5 = document.createElement('TD');

		td3.appendChild(document.createTextNode(ServIdarray[j]));
		tr2.appendChild(td3);

		td4.appendChild(document.createTextNode(InvoiceIdarray[j]));
		tr2.appendChild(td4);
		
		td5.appendChild(document.createTextNode(ticketNoArray[j]));
		tr2.appendChild(td5);
		

	}
	return myTableDiv.appendChild(table);

}

function createServiceArray(dataFromService, dataFromInvoice, dataFromTicket) {
	ServIdarray=[];
	InvoiceIdarray=[];
	ticketNoArray = [];
	
	var myTableDiv = document.getElementById("ServiceDynamicTable");

	var array1 = dataFromService.split(",");
	var array2 = dataFromInvoice.split(",");
	var array3 = dataFromTicket.split(",");

	for ( var i = 0; i < array1.length; i++) {
		ServIdarray.push(array1[i]);	
	}

	for ( var j = 0; j < array2.length; j++) {
		InvoiceIdarray.push(array2[j]);
	}
	
	for ( var k = 0; k < array3.length; k++) {
		ticketNoArray.push(array3[k]);
	}
	
	console.log("ServAliasarray1>>>>>" + ServIdarray);
	console.log("ServAliasarray2>>>>>" + InvoiceIdarray);
	console.log("ServAliasarray3>>>>>" + ticketNoArray);
	console.log("len>>>>>>" + InvoiceIdarray.length + "len1>>>>>>"+ServIdarray.length + "len2>>>>>>"+ticketNoArray.length);

}


function checktext()
{
	document.getElementById("errorCmtVal").style.display = "none";
}
/*changes done on 10 aug to do wiring from parent grid to view ticket Details page*/
function callWiring(inRowIndex){
	 
	var ticketNum = ddg_openQuestions.getItem(inRowIndex).TicketNumber;
	var status = ddg_openQuestions.getItem(inRowIndex).Status;
	document.getElementById("ticketId_wiring").value=ticketNum;
	document.getElementById("status_wiring").value=status;
	document.getElementById("ticketId_wiring").onchange();
/* 	 var form=document.getElementById('myForm1');
	var actionOnSubmit="<%=JSPSupport.getActionURL(webAppAccess, "al_ticketDetailsWiring") %>";
	form.action=actionOnSubmit;
	form.submit(); */
}

/*end of changes done on 10 aug to do wiring from parent grid to view ticket Details page*/
function callAction(inRowIndex){
 	console.log("inside callAction function");
 	console.log("Row index is: "+inRowIndex);
	 var updateToBeUpdated = document.getElementById("textArea").value;
	console.log("update to be updated is : "+updateToBeUpdated); 
	if(updateToBeUpdated == "" || updateToBeUpdated == null){ 
		console.log("data is null");
		document.getElementById("errorCmtVal").style.display = "block";
		console.log("error ensabled");
		return;
		}
 	var item = ddg_openQuestions.getItem(inRowIndex);
	
	var ticketIdToBeUpdated=item.TicketNumber;
	console.log("TICKET No IS: "+ticketIdToBeUpdated);

	
	var myEvent = []; 
	myEvent.push(updateToBeUpdated); 
	myEvent.push(ticketIdToBeUpdated);	
	console.log("values "+updateToBeUpdated+"       "+myEvent);
	console.log("event length"+myEvent.length);
	
	var d=dojo.xhrPost({
	    // The URL to request
	    url: url,
	    handleAs:"text",
		content: {
		updates: myEvent
   		},
   
	  load: function(result) {
	  console.log("result is : "+result);
	 if(result == "true"){
		 
		console.log("RowIndex is: "+inRowIndex);
	 	var item = ddg_openQuestions.getItem(inRowIndex);
	 	 console.log("ITEM IS::::::::"+item);
	 	dds_openQuestions.setValue(item, 'lastUpdatedBy', updateToBeUpdated);
		dojo.byId("cmt").innerHTML = item.lastUpdatedBy;
		document.getElementById("textArea").value = "";
	 }
	 console.log("before return");
	 return result;
	 console.log("after return");
	 console.log("main result"+result);
	  },
	 error: function(result){
		
   			console.log("status code");
   			
   			return result;
   		} 
	
   		
	}); 
	 d.addCallback(
            function(result) {
               console.log("inside call back");
               console.log("callback result"+result);
                 return result;
            }
        );  
} 




function expandRow(inIndex, inShow) {
	  
	
    var indexLength = ddg_openQuestions._by_idx.length; 

   for(var i=0;i<indexLength;i++)
   {
       switch(i)
       {
           case inIndex:		ddg_openQuestions.expandedRows[i] = inShow;
           			ddg_openQuestions.updateRow(i);
										break;
			default:       		ddg_openQuestions.expandedRows[i] = false;
			ddg_openQuestions.updateRow(i);
										break;
   }
   }	
}


function disableEnterKey(e){ 

	var key; 

	    if(window.event){ 

	    key = window.event.keyCode; 

	    } else { 

	    key = e.which;      
	    } 

	    if(key == 13){ 

	    return false; 

	    } else { 

	    return true; 
	    } 
	      

	} 
	
