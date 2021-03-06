

var xmlHttp;
var w3c=(document.getElementById)?true:false;
var ie=(document.all)?true:false;
var N=-1;
var isWorked=0;
var divAjaxData="foiaData";
var timeToJump="";
var inProcess=0;
var skipRequest=0;
var chkSkipRequest=1;
var FOIA_PROXY = '';

function startFoiaRequest(foiaDataURL){
var focusComponent;

    if (!/^https:/.test(foiaDataURL)) {
        foiaDataURL = FOIA_PROXY + foiaDataURL;
        console.log("new URL:", foiaDataURL);
    }

	if(skipRequest) return;
	if(inProcess){
		alert("Report is still processing.");
		return;
	}
	inProcess=1;
	if(chkSkipRequest) skipRequest=1;
	
	chkSkipRequest=1;
	var t=setTimeout("acceptRequest()",3000);

	//set focus before make a ajax call
	focusComponent=document.getElementById("reportHeader");
	if(focusComponent != null) focusComponent.focus();
	
	if(window.ActiveXObject){
		try {
  			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
 		}catch(e){	
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	else if(window.XMLHttpRequest){
		xmlHttp=new XMLHttpRequest();
	}
	//xmlHttp.status=0;	
	xmlHttp.open("GET",foiaDataURL,true);
	xmlHttp.setRequestHeader( "Content-type", "text/xml" );
	xmlHttp.onreadystatechange=showFoiaData;
	xmlHttp.send(null);
	var area=document.getElementById(divAjaxData);
	area.innerHTML="<h2>Please Wait ...</h2>";
	document.body.style.cursor="wait";

}

function acceptRequest(){
	skipRequest=0;
}

function showFoiaData(){
var s;
var area;
var tmp;

	if(xmlHttp.readyState == 4){
		document.body.style.cursor="default";
		inProcess=0;
		if(xmlHttp.status == 200){
			s=xmlHttp.responseText;
			area=document.getElementById(divAjaxData);
			area.innerHTML=filterMessage(s);
			tablecloth();
			//Initial();
			try{
				PageInit();
			}catch(e){
				tmp="no initial module in html";
			}
			if(jumpLocation != ""){
				tmp=jumpLocation;
				jumpLocation="";
				timeToJump=tmp;
				window.location.href="#"+tmp;
				//var t=setTimeout("jumpToElement()",1500);

			}
		
		}
		else{
			console.log("responsed not successful: "+xmlHttp.status);
			if(xmlHttp.status == 504){
				s=xmlHttp.responseText;
				area=document.getElementById(divAjaxData);
				area.innerHTML=filterMessage(s);
				//breadcrumRequest("1");
			}
			else{
				area=document.getElementById(divAjaxData);
				area.innerHTML="Foia server is not available now...";
			}
		}
	}
	else{
		if(xmlHttp.readyState > 2){
			document.body.style.cursor="default";
			area=document.getElementById(divAjaxData);
			area.innerHTML="Browser is rendering the content...";
			inProcess=0;
		}
	}
}

function filterMessage(msg){
var strpos=0, endpos;
var checknum=3;
var rest="", xmlReq, xmlMod;
var strsta=0;
var index, istart;

  while (checknum>0){
    strpos=msg.indexOf("&dataURL=/foia/FormChart?",strsta);
    endpos=msg.indexOf("%26formName%3D",strpos+1);
    if (strpos < 0 || endpos <= strpos) break;
    rest+=msg.substring(strsta,strpos);
    xmlReq=msg.substring(strpos,endpos);
    //console.log("watch string("+(4-checknum)+"): "+msg.substring(strsta,strpos));
    istart=-1;
    xmlMod="";
    do{
      index=xmlReq.indexOf("%3D",istart+1);
      if (index<0) break;
      xmlMod+=(xmlReq.substring(istart,index)+"[]");
      istart=index;
    }while(true);
    xmlMod+=xmlReq.substring(istart);
    //console.log("param string: "+xmlMod);
    rest+=xmlMod;
    strsta=endpos;
    --checknum;
  }
  rest+=msg.substring(strsta);
  //console.log("watch string: "+msg.substring(strsta));
  return(rest);
}

function jumpToElement(){
var focusElement;

	focusElement=document.getElementById(timeToJump);
	if(focusElement != null){
		focusElement.focus();
	}
	window.location.href="#"+timeToJump;
}

function IEAjaxRequest(url){
	
	url+="&Random=";
	url+=Math.floor(Math.random()*200);
	if(consolelog) console.log(url);
	startFoiaRequest(url);
}

function getAgencyComponent(noAgency){
var agencyAbbr="";
	
	if(skipRequest) {
		alert("Please try again in 2 seconds.");
		skipRequest=0;
		return;
	}
	if(noAgency == null) noAgency="List";
	var x=document.getElementById("agency"+noAgency);
	//alert(x.value);
	if(x.value != ""){
		if(noAgency == "List"){
			agencyAbbr=x.value;
		}else{
			for(var j=0;j<agencies.length;++j){
				if(x.value == agencies[j]){
					agencyAbbr=agenciesAb[j];
					break;
				}
			}
		}
	}else{
		alert("no agency provided.");
		return;
	}
	var ret=ajaxHost+"FoiaSetComp?agencyName=";
	
	ret+=agencyAbbr;
	var y=document.getElementById("agencyName");
	y.value=agencyAbbr;
	//alert(ret);
	divAjaxData="componentSelectionData";
	IEAjaxRequest(ret);
	popupWinOpen("componentSelection");
}

function delayClose(){
	popupWinClose();
}

function setAgencyComponent(){
	var x=document.getElementById("agencyComponents");
	var y=document.getElementById("agencyName");
	var ret="FoiaSetComp?set=1&agencyName=";
	
	if(x == null) {
		alert("Error - Please run your report again.");
		popupWinClose();
		document.body.style.cursor="default";
		return;
	}
	ret+=y.value;
	for(var i=0;i<x.length;i++){
	  if(x.elements[i].type == "checkbox"){
	  	if(x.elements[i].checked){
		  	ret+="&";
		  	ret+=x.elements[i].name;
	  	}
	  }
	}
	try{
		x=document.getElementById("agency1");
		if(x != null) x.focus();
	}catch(e){
		x=null;
	}
	//alert(ret);
	chkSkipRequest=0;
	IEAjaxRequest(ajaxHost+ret);
	var t=setTimeout("delayClose()",1500);
}

function resetAgencyComponent(noAgency){
	var agencyAbbr="";
	var x;
	var ret="FoiaSetComp?set=2&agencyName=";
	
	if(skipRequest) {
		alert("Please try again in 2 seconds.");
		skipRequest=0;
		return;
	}
	if(noAgency == null) noAgency="List";
	var x=document.getElementById("agency"+noAgency);
	//alert(x.value);
	if(x.value != ""){
		if(noAgency == "List"){
			agencyAbbr=x.value;
		}else{
			for(var j=0;j<agencies.length;++j){
				if(x.value == agencies[j]){
					agencyAbbr=agenciesAb[j];
					break;
				}
			}
		}
	}
	ret+=agencyAbbr;
	//alert(ret);
	divAjaxData="componentSelectionData";
	IEAjaxRequest(ajaxHost+ret);
}

function clearAgencyComponent(){
	var x=document.getElementById("agencyComponents");
	for(var i=0;i<x.length;i++){
	  if(x.elements[i].type == "checkbox"){
	  	x.elements[i].checked=false;
	  }
	}
}
