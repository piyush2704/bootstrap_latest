function validate(action_list)
{
	 if (chkOnSubmit())
	 {
		    var form= document.getElementById('myFormNew');
			var newaction=action_list;
			form.action=newaction;
			form.submit();
			return true;
	 }
	 else
	 {
		 	return false;
	 }
}


function chkOnSubmit()
{
	if(document.getElementById("calendertext2")!=null)
		{
			invoiceIDVal(); 
			amountVal();
			dateCheck();
			step2();
			 if (invoiceIDVal() && amountVal() && dateCheck() && step2())
			 { 
				flag=true;
			 }
			 else
			 {
			    flag=false;
			 }
		
		
		}
	else
		{
			invoiceIDVal();
			dateCheck();
			
			 if (invoiceIDVal() && dateCheck())
			 { 
				flag=true;
			 }
			 else
			 {
			  	flag=false;
			 }
		
		
		}
	
	 return flag;		

}

function invoiceIDVal()
{
	var flag=true;
	var i=document.getElementById("invoicetext").value;
	var y = document.getElementById("invoicetext");
	var alphaExp =/^[a-zA-Z0-9_]*$/;
	if (!(i.match(alphaExp))) {
		
		invoiceid.show();
		y.style.borderColor= "red";
		y.style.color= "red"; 
		flag=false;
	 }   
	else
		{
		document.getElementById('invoicetext').style.removeProperty('border-color');
			//y.style.borderColor= "#A9A9A9";
			y.style.color= "black"; 
			flag=true;
		}
	return flag;
	
}

function amountVal()
{
	 var a=document.getElementById("amounttextbox").value;
	 var y = document.getElementById("amounttextbox");
     var alphaExp =/^\d*(\.\d{2})?$/;
     var flag=true;
	if (!(a.match(alphaExp))) {
		ponum.show();
		y.style.borderColor= "red";
		y.style.color= "red"; 
		flag=false;
	 } 
	 else
	{
		document.getElementById('amounttextbox').style.removeProperty('border-color');
		y.style.color= "black"; 
		flag=true;
	}
	return flag;	
		
	
}	



function dateCheck()
{
		 var bpf=document.getElementById("calendertext").value;
		 var bpt=document.getElementById("calendertext1").value;
		 var bpfs=document.getElementById("calendertext");
		 var bpts=document.getElementById("calendertext1");
		 var flag=true;
		
		 
		
		 
		 var alphaExp=/^(([0-9])|([0-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\-\d{4}$/;
		 var today = new Date();
		 var a=false;
		 var b=false;
		 
		 if(bpf==""&&bpt!="")
		 {
			 BPFrom.show();
			 bpfs.style.borderWidth= "2px"; 
			 bpfs.style.borderColor= "red"; 
			 bpfs.style.color= "red"; 
			 flag=false;
		 }
		 if(bpf!="" && bpt=="")
		 {
			 BPTo.show();
			 bpts.style.borderWidth= "2px"; 
			 bpts.style.borderColor= "red"; 
			 bpts.style.color= "red"; 
			 flag=false;
		 }
		 
		 if(bpf!="" && bpt!="")
		 {
		 	  if ((bpf != "" &&  !bpf.match(alphaExp))) { 
			 	  BPFromerror.show();
				  bpfs.style.borderWidth= "2px"; 
				  bpfs.style.borderColor= "red"; 
				  bpfs.style.color= "red"; 
				  a=false;
				  flag=false;
			  } 
		 	  else
		 	  { 
		 		 document.getElementById('calendertext').style.removeProperty('border-color');
				  //bpfs.style.borderColor="black"; 
				  bpfs.style.color="black"; 
				  a=true;
				  flag=true;
			  }
		 	  
			  if ((bpt!= "" &&  !bpt.match(alphaExp))) { 
				  BPToerror.show();
				  bpts.style.borderWidth= "2px"; 
				  bpts.style.borderColor= "red"; 
				  bpts.style.color= "red"; 
				  b=false;
				  flag=false;
			  } 
			  else 
			  { 
				  document.getElementById('calendertext1').style.removeProperty('border-color');
				  //bpts.style.borderColor="black"; 
				  bpts.style.color="black"; 
				  b=true;
				  flag=true;
			  }
			 
			}
		 
		 return flag;
} 


function step2()
{
	
			 var drf=document.getElementById("calendertext2").value;
			 var drt=document.getElementById("calendertext3").value;
			 var pdd=document.getElementById("calenderpicker").value;
			 var drfs=document.getElementById("calendertext2");
			 var drts=document.getElementById("calendertext3");
			 var pdds=document.getElementById("calenderpicker"); 
			 var a=false;
			 var b=false;
			 var c=false;
			 var d=false;
			 var flag=true;
			 var alphaExp=/^(([0-9])|([0-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\-\d{4}$/;
			 var today = new Date();
			

		 	 if ((pdd != "" &&  !pdd.match(alphaExp))) { 
			 	  PaymentDueDate.show();
			 	  pdds.style.borderWidth= "2px"; 
			 	  pdds.style.borderColor= "red"; 
			 	  pdds.style.color= "red"; 
			 	  flag=false;
			  } 
		 	  else
		 	  { 
		 		 document.getElementById('calenderpicker').style.removeProperty('border-color');
		 		 flag=true;
			  }
		 	  
		 	if(drf==""&&drt!="")
			 {
			 	 DRFrom.show();
				 drfs.style.borderWidth= "2px"; 
				 drfs.style.borderColor= "red"; 
				 drfs.style.color= "red"; 
				 flag=false;
			 }
			 if(drf!="" && drt=="")
			 {
			     DRTo.show();
				 drts.style.borderWidth= "2px"; 
				 drts.style.borderColor= "red"; 
				 drts.style.color= "red"; 
				 flag=false;
			 }
		 	 
		 	 if(drf!="" && drt!="")
		 	 {
			 	 if ((drf != "" &&  !drf.match(alphaExp))) { 
				 	 DRFromerror.show();
					 drfs.style.borderWidth= "2px"; 
					 drfs.style.borderColor= "red"; 
					 drfs.style.color= "red"; 
					 a=false;
					 flag=false;
			     }
			 	 else
			     { 
			 		 document.getElementById('calendertext2').style.removeProperty('border-color');
					 drfs.style.borderColor="black"; 
					 drfs.style.color="black"; 
					 a=true;
					 flag=true;
				 }
			  	
			 	
			 	  
				  if ((drt!= "" &&  !drt.match(alphaExp))) { 
					  DRToerror.show();
					  drts.style.borderWidth= "2px"; 
					  drts.style.borderColor= "red"; 
					  drts.style.color= "red"; 
					  b=false;
					  flag=false;
				  }
				  else 
				  { 
					  document.getElementById('calendertext3').style.removeProperty('border-color');
					  drts.style.color="black"; 
					  b=true;
					  flag=true;
				  }
			  	 
			  	 
			  
		 	 }
		 	return flag;
	
}