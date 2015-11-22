dojo.require("dijit.form.DateTextBox");
var today=new Date();

var BPFromMin=new Date();
BPFromMin.setFullYear(BPFromMin.getFullYear() - 2);
var BPFromMax=new Date();
BPFromMax.setMonth(BPFromMax.getMonth()+6);

var BPToMin=new Date();
BPToMin.setFullYear(BPToMin.getFullYear() - 2);
var BPToMax=new Date();
BPToMax.setMonth(BPToMax.getMonth()+6);

var DRFromMin=new Date();
DRFromMin.setFullYear(DRFromMin.getFullYear() - 1);
var DRFromMax=new Date();
DRFromMax.setMonth(DRFromMax.getMonth()+6);

var DRToMin=new Date();
DRToMin.setFullYear(DRToMin.getFullYear() - 1);
var DRToMax=new Date();
DRToMax.setMonth(DRToMax.getMonth()+6);


