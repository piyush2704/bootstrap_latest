/**
 * 
 */
function onFocusColorChange1() {
			document.getElementById("countryCode").style.borderColor = "#99D6FF";
			document.getElementById("countryCode").style.borderWidth = "1px";
			document.getElementById("ChangeBillTelephone").style.color = "black";
		}

function onFocusColorChange(ele) {
	ele.style.borderColor = "#99D6FF";
	ele.style.borderWidth = "1px";
	ele.style.color = "black";
}
function serviceDropdwnChange(){
	document.getElementById("errMsgForNoServiceNms").innerHTML="";
}
function fnOtherRequest(){
	
	document.getElementById("errormagChangeBill").innerHTML="";
	document.getElementById('servicNamesBillDropDown').disabled=true;
	document.getElementById('descriptionbill').disabled=true;
	document.getElementById("descriptionbill").style.backgroundColor = "#f6f6f6";
document.getElementById('descriptionbill_otherReq').disabled=false;	
document.getElementById("descriptionbill_otherReq").style.backgroundColor = "white";

document.getElementById('selectedRadioVal').value="other";
document.getElementById("confStmt3").style.display='block';

	
}


function cancelChangeBill(){
	 document.getElementById('PaperlessBill').disabled = false; 
	 document.getElementById("billprefChangebtn").style.display='block';
	 document.getElementById("descriptionbill").style.backgroundColor = "#f6f6f6";
	document.getElementById("errormagChangeBill").innerHTML="";
	document.getElementById("errMsgForNoServiceNms").innerHTML="";
	 
	document.getElementById('selectedRadioVal').value="";
	document.getElementById('changeBillForm').reset();
	removeErrorDiv();
	document.getElementById('errorDivBill').innerHTML="";
	document.getElementById('errorDescMsgBill').style.display='none';
	document.getElementById('errorOtherDescMsgBill').style.display='none';
	document.getElementById('servicNamesBillDropDown').disabled=true;
	document.getElementById('descriptionbill').disabled=true;
	document.getElementById('descriptionbill_otherReq').disabled=true;
	$("#billprefDialogContent").dialog("close");
	

}
function openConfirmDialogChangeBill()
{
	$("#confirmDialogChangeBill").dialog("open");
}
function openErrorDialogChangeBill(){
	$("#errorDialogChangeBill").dialog("open");
}

function closeConfirmDialog()
{
	document.getElementById("errMsgForNoServiceNms").innerHTML="";
	document.getElementById('selectedRadioVal').value="";
	$("#confirmDialogChangeBill").dialog("close");
	document.getElementById('changeBillForm').reset();
	$("#billprefDialogContent").dialog("close");
}

function fnfetchLegEntId(selLegalEntity) {
	
	document.getElementById("errMsgForNoServiceNms").innerHTML="";
	
	document.getElementById('PaperlessBill').disabled = false; 
    var str = selLegalEntity;
    var res = str.split(" ");
   
    var CUID = res[res.length-1];
   
    
    document.getElementById('changedDropdownLegalEntity').value=CUID;
    document.getElementById('onChangeDropdownLegalEntity').onchange();
    document.getElementById('PaperlessBill').checked = false;
    
}
function fnPaperless(){
	
	document.getElementById("descriptionbill_otherReq").style.backgroundColor = "#f6f6f6";

	document.getElementById("errormagChangeBill").innerHTML="";
	document.getElementById('hiddenOnchangeRadVal').onchange();

	

}
function validateBillDesc(){
	var flag=false;
	var pattern=/^[a-zA-Z0-9 ;:,.-]*$/;
	var subject=document.getElementById('descriptionbill').value;
	if(subject!=null){
		if (!subject.match(pattern)){
			document.getElementById('errorDescMsgBill').style.display='block';
			 flag=true;
		}
		else{
			document.getElementById('errorDescMsgBill').style.display='none';
			flag=false;
		}
	}
}
function validateBillOtherDesc(){
	var flag=false;
	var pattern=/^[a-zA-Z0-9 ;:,.-]*$/;
	var subject=document.getElementById('descriptionbill_otherReq').value;
	if(subject!=null){
		if (!subject.match(pattern)){
			document.getElementById('errorOtherDescMsgBill').style.display='block';
		 flag=true;
		}
		else{
			document.getElementById('errorOtherDescMsgBill').style.display='none';
			 flag=false;
		}
	}
}


var nameflag= false;
var mailflag= false;
var telflag= false;



	 


function chkOnSubmitBill()
{
	
	 if (checkNameBill() && checkMailBill() && checkTelBill())
	 { 
		flag=true;
	 }
	 
	 return flag;		

}



function leftTrim(element)
{
	if(element)
		element.value=element.value.replace(/^\s+/,"");
}
function checkNameBill() { 
	var x = document.getElementById("ChangeBillName").value; 
	var alphaExp =/^[a-zA-Z ']{2,30}$/;
	var flag= false;
	
	if (( !x.match(alphaExp)) ) { 
		document.getElementById('errorDivBill').innerHTML="Please enter a valid name";
		
		dojo.query("#ChangeBillName").addClass("errorDivClass");
		nameflag = true;
		flag= false; 
	} 
 
	else { 
		document.getElementById('errorDivBill').innerHTML="";
		
		dojo.query("#ChangeBillName").removeClass("errorDivClass");
		nameflag= false;
		flag= true; 
	} 
	
	return flag;
} 


function checkMailBill() { 
	var actuallength = 0;
	var cntctEmailVal = document.getElementById("ChangeBillEmail").value;
	var stringLength =cntctEmailVal .length;
	var y = document.getElementById("ChangeBillEmail");
	var alphaExp = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	var flag = false;
	
	if(cntctEmailVal.charAt(stringLength - 1)==","){
		
		document.getElementById('errorDivBill').innerHTML="Please enter valid email id";
		    
		dojo.query("#ChangeBillEmail").addClass("errorDivClass");
			mailflag = true;
			flag = false;

		}
	else if (cntctEmailVal.indexOf(",") == -1) {

	if ((cntctEmailVal != "" && !cntctEmailVal.match(alphaExp))
	|| cntctEmailVal.length > 60) {
	
	document.getElementById('errorDivBill').innerHTML="Please enter valid email id";
    
		dojo.query("#ChangeBillEmail").addClass("errorDivClass");
	mailflag = true;
	flag = false;

	return flag;
	}

	else {

	document.getElementById('errorDivBill').innerHTML="";
    
		dojo.query("#ChangeBillEmail").removeClass("errorDivClass");
	
	mailflag = false;
	flag = true;

	}
	}
	
	else {

	cntctEmailVal = cntctEmailVal.substring(0,cntctEmailVal.trim().length - 1);
 
	if (cntctEmailVal.indexOf(",") != -1) {
		var splitval;

	for ( var len1 = 0; len1 < cntctEmailVal.split(",").length; len1++) {
		splitval=cntctEmailVal.split(",")[len1];
		splitval.indexOf( ' ' ) == 0 ? splitval = splitval.replace( ' ', '' ) : splitval;
	if ((splitval != "" && !splitval.match(alphaExp))|| splitval.length > 60) {

document.getElementById('errorDivBill').innerHTML="Please enter valid email id";
    
		dojo.query("#ChangeBillEmail").addClass("errorDivClass");
	
	mailflag = true;
	flag = false;

	break;
	}

	else {


document.getElementById('errorDivBill').innerHTML="";
    
		dojo.query("#ChangeBillEmail").removeClass("errorDivClass");
	mailflag = false;
	flag = true;

	}
	}
	}
	}
	
	return flag;
}

function checkTelBill() {

	var x = document.getElementById("ChangeBillTelephone").value.replace(/^\s+|\s+$/g,' '); 
 	document.getElementById("ChangeBillTelephone").value=x; 
 	var y = document.getElementById("countryCode");  
	var flag= false; 
 	 
   
  	var phoneno1 =   /^\(([0-9]{3})\)[ ]([0-9]{3})[-]([0-9]{1,8})$/; 
	var phoneno2 =   /^\(([0-9]{3})\)[ ]([0-9]{3})[.]([0-9]{1,8})$/; 
	var phoneno3 =   /^\(([0-9]{3})\)[ ]([0-9]{3})[ ]([0-9]{1,8})$/; 
	var phoneno7 =   /^\(([0-9]{3})\)([0-9]{3})([0-9]{1,8})$/;  
	var phoneno8 =   /^([0-9]{6,14})$/; 
	var phoneno4 =   /^([0-9]{3})[-]([0-9]{3})[-]([0-9]{1,8})$/; 
	var phoneno5 =   /^([0-9]{3})[.]([0-9]{3})[.]([0-9]{1,8})$/; 
	var phoneno6 =   /^([0-9]{3})[ ]([0-9]{3})[ ]([0-9]{1,8})$/; 
	if ( x != "") {   
	if ((x != "" && !(x.match(phoneno1)||x.match(phoneno2)||x.match(phoneno3)||x.match(phoneno4)||x.match(phoneno5)||x.match(phoneno6)||x.match(phoneno7)||x.match(phoneno8)))) {  

		document.getElementById('errorDivBill').innerHTML="Please enter valid telephone number";
		dojo.query("#ChangeBillTelephone").addClass("errorDivClass");
		 phoneErrorFlag = true;  
		flag= false;   
 	} 
 	else {   
  
 		dojo.query("#ChangeBillTelephone").removeClass("errorDivClass");
		 var countryflagvalue=x.substr(0,x.indexOf(' ')); 
		
		var teleformatted=x;
		var numbers = teleformatted.replace(/\D/g, ''), 
		char = {0:'(',3:') ',6:'-'}; 
		teleformatted = ''; 
		for (var i = 0; i < numbers.length; i++) { 
			teleformatted += (char[i]||'') + numbers[i]; 
		} 
		var telenum=teleformatted; 
		 document.getElementById('errorDivBill').innerHTML="";
		document.getElementById("ChangeBillTelephone").value=telenum;   
		 phoneErrorFlag = false;  
			flag= true;   
		}   
 
		
	 return flag;  
	}else { 
	 
	 return true;  
	 } 

}


function teleformat() {
	
	var tele = document.getElementById("ChangeBillTelephone").value; 
	var countryflagvalue=tele.substr(0,tele.indexOf(' '));
	var teleformatted=tele.substr(tele.indexOf(' ')+1);
   var numbers = teleformatted.replace(/\D/g, ''),
   char = {0:'(',3:') ',6:'-'};
   teleformatted = '';
	for (var i = 0; i < numbers.length; i++) {
		teleformatted += (char[i]||'') + numbers[i];
	}
	var telenum=countryflagvalue+" "+teleformatted;
	
	document.getElementById("telephonetext").value=telenum;
	
}


function removeErrorDiv(){
	
	var nameError=document.getElementById("ChangeBillName"); 
	var emailError=document.getElementById("ChangeBillEmail"); 
	var teleError=document.getElementById("ChangeBillTelephone"); 

	if(dojo.hasClass(nameError, 'errorDivClass')){
	dojo.query(nameError).removeClass("errorDivClass");
	}
	
	if(dojo.hasClass(emailError, 'errorDivClass')){
	dojo.query(emailError).removeClass("errorDivClass");
	}
	
	if(dojo.hasClass(teleError, 'errorDivClass')){
	dojo.query(teleError).removeClass("errorDivClass");
	}
	
}