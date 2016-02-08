var j = jQuery.noConflict();
var defaultPagePath='app/pages/';
var headerMsg = "Expenzing";
var urlPath='http://fabercastell.expenzing.com/TnEV1_0AWeb/WebService/Login/';
var clickedFlagCar = false;
var clickedFlagTicket = false;
var clickedFlagHotel = false;
var clickedCarRound = false;
var clickedTicketRound = false;
var clickedHotelRound = false;
var perUnitDetailsJSON= new Object();
var ismodeCategoryJSON=new Object();
var exceptionStatus = 'N';
var exceptionMessage='';
var expenseClaimDates=new Object();
var successMessage;
var pictureSource,destinationType;
var camerastatus;

j(document).ready(function(){ 
document.addEventListener("deviceready",loaded,false);
});

function login()
   {

    var userName = document.getElementById("userName");
    var password = document.getElementById("pass");

    var jsonToBeSend=new Object();
    jsonToBeSend["user"] = userName.value;
    jsonToBeSend["pass"] = password.value;
    
	var headerBackBtn=defaultPagePath+'categoryMsgPage.html';
	var pageRef=defaultPagePath+'category.html';
	j('#loading').show();
    j.ajax({
         url: urlPath+"LoginWebService",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToBeSend),
         success: function(data) {
         	if (data.Status == 'Success'){
        	 j('#mainHeader').load(headerBackBtn);
             j('#mainContainer').load(pageRef);
              appPageHistory.push(pageRef);
			  //addEmployeeDetails(data);
			  setUserSessionDetails(data);
			  synchronizeBEMasterData();
			  synchronizeTRMasterData();
			  synchronizeTRForTS();
         	}else if(data.Status == 'Failure'){
 			   successMessage = data.Message;
			   if(successMessage.length == 0){
					successMessage = "Wrong UserName or Password";
				}
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			   j('#loading').hide();
           }else{
			    j('#loading').hide();
             alert("Please enter correct username or password");
           }

         },
         error:function(data) {
		   j('#loading').hide();
         }
   });

 }

  function createBusinessExp(){
	
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
    var pageRef=defaultPagePath+'addAnExpense.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }


	 function displayBusinessExp(){
		 
		 var headerBackBtn=defaultPagePath+'headerPageForBEOperation.html';
     var pageRef=defaultPagePath+'fairClaimTable.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }

	 function displayTSExp(){
		 
		 var headerBackBtn=defaultPagePath+'headerPageForTSOperation.html';
		var pageRef=defaultPagePath+'travelSettlementTable.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
		appPageHistory.push(pageRef);
	 }

	 function cerateTravelReq(){
		 
      var pageRef=defaultPagePath+'addToTravelRequest.html';
      var headerBackBtn=defaultPagePath+'backbtnPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }


	 function createWallet(){
		 
		 var headerBackBtn=defaultPagePath+'headerPageForWalletOperation.html';
		 var pageRef=defaultPagePath+'addToWallet.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }

 function init() {
	 var pgRef;
	var headerBackBtn;
	
	if(window.localStorage.getItem("EmployeeId")!= null){
		pgRef=defaultPagePath+'category.html';
		
		headerBackBtn=defaultPagePath+'categoryMsgPage.html';
	}
	else{
		headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		pgRef=defaultPagePath+'loginPage.html';
	}
	
	j(document).ready(function() {
		j('#mainHeader').load(headerBackBtn);
			j('#mainContainer').load(pgRef);

			j('#mainContainer').swipe({
				swipe:function(event,direction,distance,duration,fingercount){
					switch (direction) {
						case "right":
								goBack();
								break;
						default:

					}
				},
				 threshold:200,
				allowPageScroll:"auto"
			});
	});
	appPageHistory.push(pgRef);
 }
 
  function loaddate(){
	j(function(){
		window.prettyPrint && prettyPrint();
		j('.dp1').datepicker({
			format: 'dd-mm-yyyy'
		});		
	});

	j('.dp1').on('changeDate', function(ev){
		j(this).datepicker('hide');
	});

}
 

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
				
 
function viewBusinessExp(){
    var pageRef=defaultPagePath+'fairClaimTable.html';
    var headerBackBtn=defaultPagePath+'headerPageForBEOperation.html';
	j(document).ready(function() {
		
		j('#mainHeader').load(headerBackBtn);
		j('#mainContainer').load(pageRef);
	});
    appPageHistory.push(pageRef);
    j('#loading_Cat').hide();
}


function viewTravelSettlementExp(){
    var pageRef=defaultPagePath+'travelSettlementTable.html';
    var headerBackBtn=defaultPagePath+'headerPageForTSOperation.html';
			j(document).ready(function() {
				
				j('#loading_Cat').hide();
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
     }
	 
function saveBusinessExpDetails(jsonBEArr,busExpDetailsArr){
	 var jsonToSaveBE = new Object();
	 var headerBackBtn=defaultPagePath+'backbtnPage.html';
	 jsonToSaveBE["employeeId"] = window.localStorage.getItem("EmployeeId");;
	 jsonToSaveBE["ProcessStatus"] = "0";
	 jsonToSaveBE["expenseDetails"] = jsonBEArr;
	 var pageRef=defaultPagePath+'success.html';
	 j('#loading_Cat').show();
	 j.ajax({
				  url: urlPath+"BusExpService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonToSaveBE),
				  success: function(data) {
				  	if(data.Status=="Success"){
				  		successMessage = "Record(s) has been synchronized successfully.";
						 for(var i=0; i<busExpDetailsArr.length; i++ ){
							var businessExpDetailId = busExpDetailsArr[i];
							deleteSelectedExpDetails(businessExpDetailId);
						 }
						 j('#mainHeader').load(headerBackBtn);
						 j('#mainContainer').load(pageRef);
						 //appPageHistory.push(pageRef);
					 }else if(data.Status=="Error"){
					 	successMessage = "Oops!! Something went wrong. Please contact system administrator";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRef);
					 }else{
					 	successMessage = "Error in synching expenses. Please contact system administrator";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRef);
					 } 
				  },
				  error:function(data) {
					  j('#loading_Cat').hide();
					alert("error: Oops something is wrong, Please Contact System Administer");
				  }
			});
}

function saveTravelSettleExpDetails(jsonTSArr,tsExpDetailsArr){
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	 var jsonToSaveTS = new Object();
	 jsonToSaveTS["employeeId"] = window.localStorage.getItem("EmployeeId");
	 jsonToSaveTS["expenseDetails"] = jsonTSArr;
	 var pageRef=defaultPagePath+'success.html';
	j.ajax({
				  url: urlPath+"SyncSettlementExpensesWebService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonToSaveTS),
				  success: function(data) {
				  	if(data.Status=="Success"){
				  	successMessage = "Record(s) has been synchronized successfully.";
					 for(var i=0; i<tsExpDetailsArr.length; i++ ){
						var travelSettleExpDetailId = tsExpDetailsArr[i];
						deleteSelectedTSExpDetails(travelSettleExpDetailId);
					 }
					 j('#mainHeader').load(headerBackBtn);
					 j('#mainContainer').load(pageRef);
					 }else if(data.Status=="Error"){
						successMessage = "Oops!! Something went wrong. Please contact system administrator.";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRef);
					 }else{
						successMessage = "Error in synching expenses. Please contact system administrator.";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRef);
					 }
				  },
				  error:function(data) {
					alert("Error: Oops something is wrong, Please Contact System Administer");
				  }
			});
}

function sendForApprovalBusinessDetails(jsonBEArr,busExpDetailsArr,accountHeadID){
	 var jsonToSaveBE = new Object();
	 jsonToSaveBE["employeeId"] = window.localStorage.getItem("EmployeeId");
	 jsonToSaveBE["expenseDetails"] = jsonBEArr;
	 jsonToSaveBE["startDate"]=expenseClaimDates.minInStringFormat;
	 jsonToSaveBE["endDate"]=expenseClaimDates.maxInStringFormat;
	 jsonToSaveBE["DelayAllowCheck"]=false;
	 jsonToSaveBE["BudgetingStatus"]=window.localStorage.getItem("BudgetingStatus");
	 jsonToSaveBE["accountHeadId"]=accountHeadID;
	 jsonToSaveBE["ProcessStatus"] = "1";
	 jsonToSaveBE["title"]= window.localStorage.getItem("FirstName")+"/"+jsonToSaveBE["startDate"]+" to "+jsonToSaveBE["endDate"];
	
	 var pageRef=defaultPagePath+'success.html';
	 callSendForApprovalServiceForBE(jsonToSaveBE,busExpDetailsArr,pageRef);
	 
}

function callSendForApprovalServiceForBE(jsonToSaveBE,busExpDetailsArr,pageRef){
j('#loading_Cat').show();
var headerBackBtn=defaultPagePath+'backbtnPage.html';
j.ajax({
				  url: urlPath+"SynchSubmitBusinessExpense",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonToSaveBE),
				  success: function(data) {
				  	if(data.Status=="Success"){
					  	if(data.hasOwnProperty('DelayStatus')){
					  		setDelayMessage(data,jsonToSaveBE,busExpDetailsArr);
					  		 j('#loading_Cat').hide();
					  	}else{
						 successMessage = data.Message;
						 for(var i=0; i<busExpDetailsArr.length; i++ ){
							var businessExpDetailId = busExpDetailsArr[i];
							deleteSelectedExpDetails(businessExpDetailId);
						 }
						 j('#loading_Cat').hide();
						 j('#mainHeader').load(headerBackBtn);
						 j('#mainContainer').load(pageRef);
						// appPageHistory.push(pageRef);
						}
					}else if(data.Status=="Failure"){
					 	successMessage = data.Message;
					 	 j('#loading_Cat').hide();
						 j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRef);
					 }else{
						 j('#loading_Cat').hide();
					 	successMessage = "Oops!! Something went wrong. Please contact system administrator.";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRef);
					 }
					},
				  error:function(data) {
					j('#loading_Cat').hide();
					alert("Error: Oops something is wrong, Please Contact System Administer");
				  }
			});
}

function createAccHeadDropDown(jsonAccHeadArr){
	var jsonArr = [];
			if(jsonAccHeadArr != null && jsonAccHeadArr.length > 0){
				for(var i=0; i<jsonAccHeadArr.length; i++ ){
					var stateArr = new Array();
					stateArr = jsonAccHeadArr[i];
					jsonArr.push({id: stateArr.Label,name: stateArr.Value});
				}
			}
			
			j("#accountHead").select2({
				data:{ results: jsonArr, text: 'name' },
				placeholder: "Account Head",
				minimumResultsForSearch: -1,
				initSelection: function (element, callback) {
					callback(jsonArr[1]);
					getExpenseNamesBasedOnAccountHead();
				},
				formatResult: function(result) {
					if ( ! isJsonString(result.id))
						result.id = JSON.stringify(result.id);
						return result.name;
				}
			});
			
}
function createTRAccHeadDropDown(jsonAccHeadArr){
	var jsonArr = [];
	if(jsonAccHeadArr != null && jsonAccHeadArr.length > 0){
		for(var i=0; i<jsonAccHeadArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonAccHeadArr[i];
			jsonArr.push({id: stateArr.Label,name: stateArr.Value});
		}
	}
	j("#trAccountHead").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Select Account Head",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
}

function createExpNameDropDown(jsonExpNameArr){
	var jsonExpArr = [];
	if(jsonExpNameArr != null && jsonExpNameArr.length > 0){
		for(var i=0; i<jsonExpNameArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonExpNameArr[i];
			jsonExpArr.push({id: stateArr.ExpenseID,name: stateArr.ExpenseName});
		}
	}
		
	j("#expenseName").select2({
		data:{ results: jsonExpArr, text: 'name' },
		placeholder: "Expense Name",
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
			callback(jsonExpArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val","");
}

function createCurrencyDropDown(jsonCurrencyArr){
	var jsonArr = [];
	if(jsonCurrencyArr != null && jsonCurrencyArr.length > 0){
		for(var i=0; i<jsonCurrencyArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonCurrencyArr[i];
			
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#currency").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Currency",
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
					callback(jsonArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val",jsonArr[0]);
} 

function createTravelModeDown(jsonTrvlModeArr){
	var jsonArr = [];
	if(jsonTrvlModeArr != null && jsonTrvlModeArr.length > 0){
		for(var i=0; i<jsonTrvlModeArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonTrvlModeArr[i];
			
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#travelMode").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Travel Mode",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
	
	j("#roundTripMode").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Travel Mode",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
} 

function createCategoryDropDown(jsonCategoryArr){
	var jsonArr = [];
	if(jsonCategoryArr != null && jsonCategoryArr.length > 0){
		for(var i=0; i<jsonCategoryArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonCategoryArr[i];
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#travelCategory").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Travel Category",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
	
	j("#roundTripCategory").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Travel Category",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
} 

function createCitytownDropDown(jsonCityTownArr){
	var jsonArr = [];
	if(jsonCityTownArr != null && jsonCityTownArr.length > 0){
		for(var i=0; i<jsonCityTownArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonCityTownArr[i];
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#fromCitytown").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "From Location",
		//minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
	
	j("#toCitytown").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "To Location",
		//minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
} 

function createTravelTypeDropDown(jsonTravelTypeArr){
	var jsonArr = [];
	if(jsonTravelTypeArr != null && jsonTravelTypeArr.length > 0){
		for(var i=0; i<jsonTravelTypeArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonTravelTypeArr[i];
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#travelType").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Purpose Of Travel",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
} 

function getFormattedDate(input){
    var inputDate=input.split('-');
    var month = inputDate[1];
    var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return inputDate[0]+"-"+months[(month-1)]+"-"+inputDate[2];
   
}

function validateExpenseDetails(exp_date,exp_from_loc,exp_to_loc,exp_narration,exp_unit,exp_amt,acc_head_id,exp_name_id,currency_id){
	if(exp_date == ""){
		alert("Expense Date is invalid");
		return false;
	}
	if(acc_head_id == "-1"){
		alert("Account Head is invalid");
		return false;
	}
	if(exp_name_id == "-1"){
		alert("Expense Name is invalid");
		return false;
	}
	if(perUnitDetailsJSON.expenseIsfromAndToReqd!='N'){
		if(exp_from_loc == ""){
			alert("From Location is invalid");
			return false;
		}
		if(exp_to_loc == ""){
			alert("To Location is invalid");
			return false;
		}
	}

	if(exp_narration == ""){
		alert("Narration is invalid");
		return false;
	}
	
	if(perUnitDetailsJSON.expIsUnitReq == 'Y'){
		if(exp_unit != ""){
			if(isOnlyNumeric(exp_unit,"Unit")==false)
			{
				return false;
			}
		}else{
			alert("Unit is invalid");
			return false;
		}
	}
		if(exp_amt != ""){
			if(isOnlyNumeric(exp_amt,"Amount")==false)
			{
				return false;
			}
		}else{
			alert("Amount is invalid");
			return false;
		}
	
	if(currency_id == "-1"){
		alert("Currency Name is invalid");
		return false;
	}
	
	return true;
}


function isOnlyNumeric(object,messageContent) {
	if(object.search(/^[0-9]*$/) == -1) {
		alert(messageContent+" should be numeric." );
		return false;
	}else {
		return true;
	}
}

function syncSubmitTravelDetails(){
	
	var tvl_hotel = document.getElementById('travelHotel').value;
	var tvl_plane = document.getElementById('travelPlane').value;
	var tvl_car = document.getElementById('travelCar').value;
	var tvl_rnd_hotel = document.getElementById('roundTravelHotel').value;
	var tvl_rnd_plane = document.getElementById('roundTravelPlane').value;
	var tvl_rnd_car = document.getElementById('roundTravelCar').value;
	var tvl_date = document.getElementById('selectDate_One').value;
	var tvl__rod_dateOne = document.getElementById('selectDate_Two').value;
	var tvl__rod_dateTwo = document.getElementById('selectDate_Three').value;	
	var	travel_title=document.getElementById('travelTitle').value;	
	var travel_purpose_id;
	var from_id;
	var from_val;
	var to_id;
	var to_val;
	var account_head_id;
	var travel_mode_id;
	var travel_category_id;
	var tvl_mode_rnd_id;
	var tvl_category_rnd_id;
	
	if(j("#travelType").select2('data') != null){
		travel_purpose_id = j("#travelType").select2('data').id;
	}else{
		travel_purpose_id = '-1';
	}
	
	if(j("#fromCitytown").select2('data') != null){
		from_id = j("#fromCitytown").select2('data').id;
		from_val = j("#fromCitytown").select2('data').name;
	}else{
		from_id = '-1';
	}	
	
	if(j("#trAccountHead").select2('data') != null){
		account_head_id = j("#trAccountHead").select2('data').id;
	}else{
		account_head_id = '-1';
	}
	
	if(j("#toCitytown").select2('data') != null){
		to_id = j("#toCitytown").select2('data').id;
		to_val = j("#toCitytown").select2('data').name;
	}else{
		to_id = '-1';
	}
	
	if(j("#travelMode").select2('data') != null){
		travel_mode_id = j("#travelMode").select2('data').id;
	}else{
		travel_mode_id = '-1';
	}
	if(j("#travelCategory").select2('data') != null){
		travel_category_id = j("#travelCategory").select2('data').id;
	}else{
		travel_category_id = '-1';
	}
	
	if(j("#roundTripMode").select2('data') != null){ 
		tvl_mode_rnd_id = j("#roundTripMode").select2('data').id;
	}else{
		tvl_mode_rnd_id = '-1';
	}
	if(j("#roundTripCategory").select2('data') != null){
		tvl_category_rnd_id = j("#roundTripCategory").select2('data').id;
	}else{
		tvl_category_rnd_id = '-1';
	}


	if(validatetravelDetails(travel_purpose_id,account_head_id,from_id,to_id,travel_mode_id,travel_category_id,tvl_mode_rnd_id,tvl_category_rnd_id,tvl_date,travel_title)){

		 var jsonToSaveTR = new Object();
		 j('#loading_Cat').show();
		 jsonToSaveTR["EmployeeId"] = window.localStorage.getItem("EmployeeId");;
		 jsonToSaveTR["BudgetingStatus"] = window.localStorage.getItem("BudgetingStatus");;
		 jsonToSaveTR["TravelPurpose"] = travel_purpose_id;
		 jsonToSaveTR["AccountHeadId"] = account_head_id;
		 jsonToSaveTR["FromLocation"] = from_id;
		 jsonToSaveTR["FromLocationName"] = from_val;
		 jsonToSaveTR["ToLocaton"] = to_id;
		 jsonToSaveTR["ToLocatonName"] = to_val;
		 jsonToSaveTR["TravelTitle"] = travel_title;
		   jsonToSaveTR["EntitlementAllowCheck"] = false;
		 
		 var listItineraryTab = document.getElementById('myTab');
			if(hasClass(listItineraryTab.children[0],"active")){
				jsonToSaveTR["ItenaryType"] = 'O';
				jsonToSaveTR["TravelModeId"] = travel_mode_id;
				jsonToSaveTR["TravelCategoryId"] = travel_category_id;
				jsonToSaveTR["Hotel"] = tvl_hotel;
				jsonToSaveTR["TravelTicket"] = tvl_plane;
				jsonToSaveTR["CarRent"] = tvl_car;
				
				if(clickedFlagCar == true){
					jsonToSaveTR["IsCarRent"] = 'true';
				}else{
					jsonToSaveTR["IsCarRent"] = 'false';
				}
				if(clickedFlagTicket == true){
					jsonToSaveTR["IsTravelTicket"] = 'true';
				}else{
					jsonToSaveTR["IsTravelTicket"] = 'false';
				}
				if(clickedFlagHotel == true){
					jsonToSaveTR["IsHotel"] = 'true';
				}else{
					jsonToSaveTR["IsHotel"] = 'false';
				}
				jsonToSaveTR["DepartDate"] = tvl_date;
				jsonToSaveTR["DepartTime"] = '12:20 AM';
				jsonToSaveTR["ArriveDate"] = tvl_date;
				jsonToSaveTR["ArriveTime"] = '14:00 AM';
			}else{
				jsonToSaveTR["ItenaryType"] = 'R';
				jsonToSaveTR["TravelModeId"] = tvl_mode_rnd_id;
				jsonToSaveTR["TravelCategoryId"] = tvl_category_rnd_id;
				jsonToSaveTR["Hotel"] = tvl_rnd_hotel;
				jsonToSaveTR["TravelTicket"] = tvl_rnd_plane;
				jsonToSaveTR["CarRent"] = tvl_rnd_car;
				
				if(clickedCarRound == true){
					jsonToSaveTR["IsCarRent"] = 'true';
				}else{
					jsonToSaveTR["IsCarRent"] = 'false';
				}
				if(clickedTicketRound == true){
					jsonToSaveTR["IsTravelTicket"] = 'true';
				}else{
					jsonToSaveTR["IsTravelTicket"] = 'false';
				}
				if(clickedHotelRound  == true){
					jsonToSaveTR["IsHotel"] = 'true';
				}else{
					jsonToSaveTR["IsHotel"] = 'false';
				}
				jsonToSaveTR["DepartDate"] = tvl__rod_dateTwo;
				jsonToSaveTR["DepartTime"] = '12:20 AM';
				jsonToSaveTR["ArriveDate"] = tvl__rod_dateOne;
				jsonToSaveTR["ArriveTime"] = '14:00 AM';
		}
		 
		 saveTravelRequestAjax(jsonToSaveTR);
		}else{
			return false;
		}
}
function saveTravelRequestAjax(jsonToSaveTR){
	var pageRef=defaultPagePath+'success.html';
	 j.ajax({
			  url: urlPath+"SyncTravelRequestDetail",
			  type: 'POST',
			  dataType: 'json',
			  crossDomain: true,
			  data: JSON.stringify(jsonToSaveTR),
			  success: function(data) {
				  if(data.Status=="Failure"){
					  if(data.hasOwnProperty('IsEntitlementExceed')){
							setTREntitlementExceedMessage(data,jsonToSaveTR);
							 j('#loading_Cat').hide();
						}
					  successMessage = data.Message;
					  alert(successMessage);
					  j('#loading_Cat').hide();
				  }else if(data.Status=="Success"){
					  successMessage = data.Message;
						j('#loading_Cat').hide();
						j('#mainContainer').load(pageRef);
						appPageHistory.push(pageRef);
				  }else{
					 successMessage = "Error: Oops something is wrong, Please Contact System Administer";
					  j('#loading_Cat').hide();
					  j('#mainContainer').load(pageRef);
					   appPageHistory.push(pageRef);
				  }
				},
			  error:function(data) {
				successMessage = "Error: Oops something is wrong, Please Contact System Administer";
					  j('#loading_Cat').hide();
					  j('#mainContainer').load(pageRef);
					  appPageHistory.push(pageRef);
			  }
	});
}
function hasClass(ele,cls) {
	  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function setBooleanValueCar(){
	if(clickedFlagCar == false){
		document.getElementById('carActive').style.display="";
		document.getElementById('carDisabled').style.display="none";
	 	document.getElementById('travelCar').focus();
		clickedFlagCar = true;
	}else{
		document.getElementById('carActive').style.display="none";
		document.getElementById('carDisabled').style.display="";
		document.getElementById('travelCar').value ="";
		clickedFlagCar = false;
	}
}
function setBooleanValueCarTextField(){
	if(clickedFlagCar == false){
		document.getElementById('carActive').style.display="";
		document.getElementById('carDisabled').style.display="none";
	 	document.getElementById('travelCar').focus();
		clickedFlagCar = true;
	}
}

function setBooleanValueTicket(){
	 if(clickedFlagTicket == false){	
		document.getElementById('ticketActive').style.display="";
		document.getElementById('ticketDisabled').style.display="none";
		document.getElementById('travelPlane').focus();
		clickedFlagTicket = true;
	}else{
		document.getElementById('ticketActive').style.display="none";
		document.getElementById('ticketDisabled').style.display="";
		document.getElementById('travelPlane').value ="";
		clickedFlagTicket = false;
	}
}

function setBooleanValueTicketTextField(){
	 if(clickedFlagTicket == false){	
		document.getElementById('ticketActive').style.display="";
		document.getElementById('ticketDisabled').style.display="none";
		document.getElementById('travelPlane').focus();
		clickedFlagTicket = true;
	}
}

function setBooleanValueHotel(){
	 if(clickedFlagHotel == false){
		document.getElementById('hotelActive').style.display="";
		document.getElementById('hotelDisabled').style.display="none";		 
		document.getElementById('travelHotel').focus();
		clickedFlagHotel = true;
	}else{
		document.getElementById('hotelActive').style.display="none";
		document.getElementById('hotelDisabled').style.display="";
		document.getElementById('travelHotel').value ="";
		clickedFlagHotel = false;
	}
}

function setBooleanValueHotelTextField(){
	 if(clickedFlagHotel == false){
		document.getElementById('hotelActive').style.display="";
		document.getElementById('hotelDisabled').style.display="none";		 
		document.getElementById('travelHotel').focus();
		clickedFlagHotel = true;
	}
}

function setBooleanValueCarRound(){
	 if(clickedCarRound == false){	
		document.getElementById('carRoundActive').style.display="";
		document.getElementById('carRoundDisabled').style.display="none";	
		document.getElementById('roundTravelCar').focus();
		clickedCarRound = true;
	}else{
		document.getElementById('carRoundActive').style.display="none";
		document.getElementById('carRoundDisabled').style.display="";
		document.getElementById('roundTravelCar').value ="";
		clickedCarRound = false;
	}
}

function setBooleanValueCarRoundTextField(){
	 if(clickedCarRound == false){	
		document.getElementById('carRoundActive').style.display="";
		document.getElementById('carRoundDisabled').style.display="none";	
		document.getElementById('roundTravelCar').focus();
		clickedCarRound = true;
	}
}

function setBooleanValueTicketRound(){
	 if(clickedTicketRound == false){
		document.getElementById('ticketRoundActive').style.display="";
		document.getElementById('ticketRoundDisabled').style.display="none"; 
		document.getElementById('roundTravelPlane').focus();
		clickedTicketRound = true;
	}else{
		document.getElementById('ticketRoundActive').style.display="none";
		document.getElementById('ticketRoundDisabled').style.display="";
		document.getElementById('roundTravelPlane').value ="";
		clickedTicketRound = false;
	}
}

function setBooleanValueTicketRoundTextField(){
	 if(clickedTicketRound == false){
		document.getElementById('ticketRoundActive').style.display="";
		document.getElementById('ticketRoundDisabled').style.display="none"; 
		document.getElementById('roundTravelPlane').focus();
		clickedTicketRound = true;
	}
}
function setBooleanValueHotelRound(){
	 if(clickedHotelRound == false){
		document.getElementById('hotelRoundActive').style.display="";
		document.getElementById('hotelRoundDisabled').style.display="none"; 		 
		document.getElementById('roundTravelHotel').focus();
		clickedHotelRound = true;
	}else{
		document.getElementById('hotelRoundActive').style.display="none";
		document.getElementById('hotelRoundDisabled').style.display="";
		document.getElementById('roundTravelHotel').value ="";
		clickedHotelRound = false;
	}
}

function setBooleanValueHotelRoundTextField(){
	 if(clickedHotelRound == false){
		document.getElementById('hotelRoundActive').style.display="";
		document.getElementById('hotelRoundDisabled').style.display="none"; 		 
		document.getElementById('roundTravelHotel').focus();
		clickedHotelRound = true;
	}
}
function validatetravelDetails(travel_purpose_id,account_head_id,from_id,to_id,travel_mode_id,travel_category_id,tvl_mode_rnd_id,tvl_category_rnd_id,tvl_date,travel_title){
	if(travel_title==""){
		alert("Travel Title is required");
		return false;
	}
	if(travel_purpose_id == "-1"){
		alert("Purpose Of Travel is invalid");
		return false;
	}
	if(account_head_id == "-1"){
		alert("Account Head is invalid");
		return false;
	}
	if(from_id == "-1"){
		alert("From Location is invalid");
		return false;
	}
	if(to_id == "-1"){
		alert("To Location is invalid");
		return false;
	}
	var listItineraryTab = document.getElementById('myTab');
			if(hasClass(listItineraryTab.children[0],"active")){
				if(travel_mode_id == "-1"){
					alert("Mode is invalid");
					return false;
				}
				if(travel_category_id == "-1"){
					alert("Category is invalid");
					return false;
				}
				if(document.getElementById('selectDate_One').value == "Select Date"){
					alert("Travel Date is invalid");
					return false;
				}
			}else{
				if(tvl_mode_rnd_id == "-1"){
					alert("Mode is invalid");
					return false;
				}
				if(tvl_category_rnd_id == "-1"){
					alert("Category is invalid");
					return false;
				}
				if(document.getElementById('selectDate_Three').value == "Select Date"){
					alert("Travel Date is invalid");
					return false;
				}
				if(document.getElementById('selectDate_Two').value == "Select Date"){
					alert("Travel Date is invalid");
					return false;
				}
		} 	
	
	return true;
}

function resetOneTrip(){
	j('#travelMode').select2('data', '');
	j('#travelCategory').select2('data', '');
	document.getElementById('travelCar').value = "";
	document.getElementById('travelHotel').value = "";
	document.getElementById('travelPlane').value = "";
}

function resetRoundTrip(){
	j('#roundTripMode').select2('data', '');
	j('#roundTripCategory').select2('data', '');
	document.getElementById('roundTravelCar').value = "";
	document.getElementById('roundTravelHotel').value = "";
	document.getElementById('roundTravelPlane').value = "";
}

function onloadTimePicker(){
 	
 	if (top.location != location) {
    top.location.href = document.location.href ;
  }
		
	j('.timepicker1').timepicki();
 }

 function getExpenseNamesOnRequestNoChange(){

 	var travelRequestId = j("#travelRequestName").select2('data').id;
      getExpenseNamesfromDBTravel(travelRequestId);
 }
 
 function getStartandEndOnRequestNoChange(){

 	var travelRequestId = j("#travelRequestName").select2('data').id;
      getStartEndDatefromDBTravel(travelRequestId);
 }
 
 function getCurrencyOnRequestNoChange(){

 	var travelRequestId = j("#travelRequestName").select2('data').id;
      getCurrencyDBTravel(travelRequestId);
 }

 function getExpenseNamesBasedOnAccountHead(){

 	var accountHeadID = j("#accountHead").select2('data').id;
      getExpenseNamesfromDB(accountHeadID);
 }


 function getPerUnitBasedOnExpense(){

 	var expenseNameID = j("#expenseName").select2('data').id;
       getPerUnitFromDB(expenseNameID);
 }

  function getModeCatergoryBasedOnExpenseName(){

 	var expenseNameID = j("#travelExpenseName").select2('data').id;
     getModecategoryFromDB(expenseNameID);
 }

  function getCatergoryBasedOnMode(){

 	var modeID = j("#travelMode").select2('data').id;
     getCategoryFromDB(modeID);
 }

  function getRoundCatergoryBasedOnMode(){

	 	var modeID = j("#roundTripMode").select2('data').id;
	     getCategoryFromDB(modeID);
	 }


function setPerUnitDetails(transaction, results){
 		
    	if(results!=null){
		        var row = results.rows.item(0);
		        perUnitDetailsJSON["expenseIsfromAndToReqd"]=row.expIsFromToReq;
		        perUnitDetailsJSON["isUnitReqd"]=row.expIsUnitReq;
		        perUnitDetailsJSON["expRatePerUnit"]=row.expRatePerUnit;
		        perUnitDetailsJSON["expFixedOrVariable"]=row.expFixedOrVariable;
		        perUnitDetailsJSON["expFixedLimitAmt"]=row.expFixedLimitAmt;
		        perUnitDetailsJSON["expenseName"]=row.expName;
				perUnitDetailsJSON["expPerUnitActiveInative"]=row.expPerUnitActiveInative;
		        document.getElementById("expAmt").value="";
		        document.getElementById("expUnit").value="";
		        if(perUnitDetailsJSON.expenseIsfromAndToReqd=='N'){
					document.getElementById("expFromLoc").value="";
					document.getElementById("expToLoc").value="";
					document.getElementById("expFromLoc").disabled =true;
					document.getElementById("expToLoc").disabled =true;
					document.getElementById("expFromLoc").style.backgroundColor='#d1d1d1'; 
					document.getElementById("expToLoc").style.backgroundColor='#d1d1d1'; 
				}else{
					document.getElementById("expFromLoc").disabled =false;
					document.getElementById("expToLoc").disabled =false;
					document.getElementById("expFromLoc").style.backgroundColor='#FFFFFF'; 
					document.getElementById("expToLoc").style.backgroundColor='#FFFFFF'; 
				}
				if(perUnitDetailsJSON.isUnitReqd=='Y'){
					document.getElementById("expAmt").value="";
					if(perUnitDetailsJSON.expFixedOrVariable=='V'){
						document.getElementById("expUnit").disabled =false;
						document.getElementById("expUnit").style.backgroundColor='#FFFFFF'; 
						document.getElementById("expAmt").disabled =false;
						document.getElementById("expAmt").style.backgroundColor='#FFFFFF'; 
					}else{
						document.getElementById("expUnit").disabled =false;
						document.getElementById("expUnit").style.backgroundColor='#FFFFFF'; 
						document.getElementById("expAmt").disabled =true;
						document.getElementById("expAmt").style.backgroundColor='#d1d1d1'; 
					}
				}else{
					document.getElementById("expUnit").disabled =true;
					document.getElementById("expAmt").disabled =false;
					document.getElementById("expAmt").style.backgroundColor='#FFFFFF'; 
					document.getElementById("expUnit").style.backgroundColor='#d1d1d1'; 
				}
				if(perUnitDetailsJSON.expPerUnitActiveInative=='1'){
					document.getElementById("expUnit").disabled =true;
					document.getElementById("expAmt").disabled =false;
					document.getElementById("expAmt").style.backgroundColor='#FFFFFF'; 
					document.getElementById("expUnit").style.backgroundColor='#d1d1d1';
				}
		}else{

			alert("Please Synch your expense Names to claim expense.");
		}
 	
 	}

 	function setModeCategroyDetails(transaction, results){
 	
    	if(results!=null){
		        var row = results.rows.item(0);
		        ismodeCategoryJSON=new Object();
		        ismodeCategoryJSON["expenseNameId"]=row.expenseNameId;
		        ismodeCategoryJSON["isModeCategory"]=row.isModeCategory;
		      if(ismodeCategoryJSON.isModeCategory=='N'){
					  j('#travelMode').select2('data', '');
					  j('#travelCategory').select2('data', '');
					  j('#travelMode').select2('disable');
					  j('#travelCategory').select2('disable');
				}else{
					  j('#travelMode').select2('enable');
					  j('#travelCategory').select2('enable');
				}
		}else{

			alert("Please synch your expense names to settle your travel request.");
		}
 	
 	}

 	function checkPerUnitExceptionStatusForBEAtLineLevel(){
 		
 		exceptionStatus="N";
 		exceptionMessage='';
 		//String acExpNameReqStatus = findByIdAccountCodeExpenseNameRequiredStatus(accountCodeId);

 			 //CASE 1 : IF THE EXP NAME REQUIRED STATUS IS 'Y' FURTHER COMPUTE TO GET THE EXCEPTION STATUS
 			 //CASE 2 : IF 'N' THEN SET THE EXCEPTION STATUS AS 'N' AS THIS AC CODE IS NA FOR BE ENTITLEMENTS
 			 
 			 var perUnitStatus = perUnitDetailsJSON.isUnitReqd;
 			 var fixedOrVariable = perUnitDetailsJSON.expFixedOrVariable;
 			 var ratePerUnit = perUnitDetailsJSON.expRatePerUnit;
 			 var limitAmt = perUnitDetailsJSON.expFixedLimitAmt;
 			 var expName = perUnitDetailsJSON.expenseName;
			 var expActiveInactive = perUnitDetailsJSON.expPerUnitActiveInative;
 			 var amount=document.getElementById("expAmt").value;
 			 var unitValue=document.getElementById("expUnit").value;
 			if (expActiveInactive == '1'){
					exceptionStatus = "N";
 						j('#errorMsgArea').children('span').text("");
				}if (perUnitStatus != "" && limitAmt != "" &&  amount != ""
 						 && perUnitStatus =='N' && expActiveInactive !='1'){
 					if (parseFloat(limitAmt) < parseFloat(amount)){
 						 exceptionStatus = "Y";
 						 exceptionMessage = "(Exceeding per unit amount defined: "
 							 + limitAmt + " for expense name " + expName+")";
 							 j('#errorMsgArea').children('span').text(exceptionMessage);
 					 }else{
 						 exceptionStatus = "N";
 						 j('#errorMsgArea').children('span').text("");
 					 }
 				}else if (perUnitStatus != "" && ratePerUnit != "" && amount != ""
 						 && fixedOrVariable != "" && unitValue != "" && perUnitStatus =='Y'
 						 && fixedOrVariable =='V' && expActiveInactive !='1'){

 					 if (parseFloat(ratePerUnit) < amount/unitValue){
 						 exceptionStatus = "Y";
 						 exceptionMessage = "(Exceeding per unit amount defined: "
 							 + ratePerUnit + " for expense name " + expName+")";
 							 j('#errorMsgArea').children('span').text(exceptionMessage);
 					 }else{
 						 exceptionStatus = "N";
 						  j('#errorMsgArea').children('span').text("");
 					 }
				}
 				
 	}

function calculatePerUnit(){
		 
		 var unit=document.getElementById("expUnit").value;
		if(isOnlyNumeric(unit,"Unit")==false)
		{	
			document.getElementById("expUnit").value="";
			return false;
		}
		 var perUnitStatus = perUnitDetailsJSON.expIsUnitReq;
		 var fixedOrVariable = perUnitDetailsJSON.expFixedOrVariable;
		 var ratePerUnit = perUnitDetailsJSON.expRatePerUnit;
		 var limitAmt = perUnitDetailsJSON.expFixedLimitAmt;
		 var expName = perUnitDetailsJSON.expenseName;
		 var result='';
		 var unitValue=document.getElementById("expUnit").value;
		 if(unitValue!=null && unitValue!='' && ratePerUnit!='' && ratePerUnit!=null){
		 result=parseFloat(unitValue)*parseFloat(ratePerUnit);
		 }
		 document.getElementById("expAmt").value=result;

}

function validateNumericField(obj){
	
	if(document.getElementById("expAmt").value)
		if(obj=='expAmt'){
			var amt=document.getElementById("expAmt").value;
			if(isOnlyNumeric(amt,"Amount")==false)
				{	
					document.getElementById("expAmt").value="";
					return false;
				}
	}else if(obj=='expUnit'){
		var unit=document.getElementById("expUnit").value;
			if(isOnlyNumeric(amt,"Unit")==false){	
					document.getElementById("expUnit").value="";
					return false;
				}
	}
}

function setDelayMessage(returnJsonData,jsonToBeSend,busExpDetailsArr){
		var pageRef=defaultPagePath+'success.html';
		if(returnJsonData.DelayStatus=='Y'){
			exceptionMessage = "This voucher has exceeded Time Limit.";
			
		      j('#displayError').children('span').text(exceptionMessage);
		      j('#displayError').hide().fadeIn('slow').delay(2000).fadeOut('slow');
		    
		}else{

			if(confirm("This voucher has exceeded Time Limit. Do you want to proceed?")==false){
						return false;
					}
			 jsonToBeSend["DelayAllowCheck"]=true;
			 callSendForApprovalServiceForBE(jsonToBeSend,busExpDetailsArr,pageRef);
		}			
}

function setTREntitlementExceedMessage(returnJsonData,jsonToBeSend){
		var pageRef=defaultPagePath+'success.html';
	if(confirm(returnJsonData.Message+".\nThis voucher has exceeded Entitlements. Do you want to proceed?")==false){
		return false;
	}
		 jsonToBeSend["EntitlementAllowCheck"]=true;
		 saveTravelRequestAjax(jsonToBeSend);
				
}

		
	 function cerateTravelSettlement(){
		
	      var pageRef=defaultPagePath+'addTravelSettlement.html';
	      var headerBackBtn=defaultPagePath+'backbtnPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }
function createTravelExpenseNameDropDown(jsonExpenseNameArr){
	var jsonExpArr = [];
	if(jsonExpenseNameArr != null && jsonExpenseNameArr.length > 0){
		for(var i=0; i<jsonExpenseNameArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonExpenseNameArr[i];
			jsonExpArr.push({id: stateArr.ExpenseNameId,name: stateArr.ExpenseName});
		}
	}
		
	j("#travelExpenseName").select2({
		data:{ results: jsonExpArr, text: 'name' },
		placeholder: "Expense Name",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
}


function validateTSDetails(exp_date,exp_narration,exp_unit,exp_amt,travelRequestId,exp_name_id,currency_id,travelMode_id,travelCategory_id,cityTown_id){
	
	if(travelRequestId == "-1"){
		alert("Travel Request Number is invalid.");
		return false;
	}
	if(exp_date == ""){
		alert("Expense Date is invalid.");
		return false;
	}
	if(exp_name_id == "-1"){
		alert("Expense Name is invalid.");
		return false;
	}
	if(ismodeCategoryJSON.isModeCategory=="Y"){
		if(travelMode_id == "-1"){
			alert("Mode is invalid.");
			return false;
		}
		if(travelCategory_id == "-1"){
			alert("Category is invalid.");
			return false;
		}
	}
	if(cityTown_id == "-1"){
		alert("City town details is invalid.");
		return false;
	}
	if(exp_narration == ""){
		alert("Narration is invalid.");
		return false;
	}
	if(exp_unit != ""){
			if(isOnlyNumeric(exp_unit,"Unit")==false)
			{
				return false;
			}
		}else{
			alert("Unit is invalid.");
			return false;
		}
	if(exp_amt != ""){
			if(isOnlyNumeric(exp_amt,"Amount")==false)
			{
				return false;
			}
		}else{
			alert("Amount is invalid.");
			return false;
		}
	if(currency_id == "-1"){
		alert("Currency Name is invalid.");
		return false;
	}
	return true;
}

function createTravelRequestNoDropDown(jsonTravelRequestNoArr){
	var jsonRequestArr = [];
	if(jsonTravelRequestNoArr != null && jsonTravelRequestNoArr.length > 0){
		for(var i=0; i<jsonTravelRequestNoArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonTravelRequestNoArr[i];
			var requestNo=stateArr.TravelRequestNumber;
			var title=requestNo.substr(requestNo.length - 3)+"/"+stateArr.Title;
			
			jsonRequestArr.push({id: stateArr.TravelRequestId,name: title});
		}
	}
		
	j("#travelRequestName").select2({
		data:{ results: jsonRequestArr, text: 'name' },
		placeholder: "Travel Request Number",
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
}
function oprationOnExpenseClaim(){
	j(document).ready(function(){
		j('#send').on('click', function(e){ 
				var jsonExpenseDetailsArr = [];
				  var busExpDetailsArr = [];
				  expenseClaimDates=new Object;
				  
				  var accountHeadIdToBeSent=''
					  if(j("#source tr.selected").hasClass("selected")){
						  j("#source tr.selected").each(function(index, row) {
							  var busExpDetailId = j(this).find('td.busExpId').text();
							  var jsonFindBE = new Object();

							  var expDate = j(this).find('td.expDate1').text();
							  var expenseDate  = expDate;
							  var currentDate=new Date(expenseDate);
							  //get Start Date
							  if(!expenseClaimDates.hasOwnProperty('minInDateFormat')){
								  expenseClaimDates["minInDateFormat"]=currentDate;
								  expenseClaimDates["minInStringFormat"]=expenseDate;
							  }else{
								  if(expenseClaimDates.minInDateFormat>currentDate){
									  expenseClaimDates["minInDateFormat"]=currentDate;
									  expenseClaimDates["minInStringFormat"]=expenseDate;
								  }
							  }
							  //get End Date
							  if(!expenseClaimDates.hasOwnProperty('maxInDateFormat')){
								  expenseClaimDates["maxInDateFormat"]=currentDate;
								  expenseClaimDates["maxInStringFormat"]=expenseDate;
							  }else{
								  if(expenseClaimDates.maxInDateFormat<currentDate){
									  expenseClaimDates["maxInDateFormat"]=currentDate;
									  expenseClaimDates["maxInStringFormat"]=expenseDate;
								  }
							  }


							  jsonFindBE["expenseDate"] = expenseDate;
							  //get Account Head
							  var currentAccountHeadID=j(this).find('td.accHeadId').text();

							  if(validateAccountHead(accountHeadIdToBeSent,currentAccountHeadID)==false){
								  exceptionMessage="Selected expenses should be mapped under Single Expense Type/Account Head."
									  j('#displayError').children('span').text(exceptionMessage);
								  j('#displayError').hide().fadeIn('slow').delay(3000).fadeOut('slow');
								  accountHeadIdToBeSent="";
							  }else{
								  accountHeadIdToBeSent=currentAccountHeadID

								  jsonFindBE["accountCodeId"] = j(this).find('td.accountCodeId').text();
								  jsonFindBE["ExpenseId"] =j(this).find('td.expNameId').text();
								  jsonFindBE["ExpenseName"] = j(this).find('td.expName').text();
								  jsonFindBE["fromLocation"] = j(this).find('td.expFromLoc1').text();
								  jsonFindBE["toLocation"] = j(this).find('td.expToLoc1').text();
								  jsonFindBE["narration"] = j(this).find('td.expNarration1').text();
								  jsonFindBE["perUnitException"] = j(this).find('td.isEntitlementExceeded').text();

								  if(j(this).find('td.expUnit').text()!="" ) {
									  jsonFindBE["units"] = j(this).find('td.expUnit').text();
								  }

								  jsonFindBE["amount"] = j(this).find('td.expAmt1').text();
								  jsonFindBE["currencyId"] = j(this).find('td.currencyId').text();

								  var dataURL =  j(this).find('td.busAttachment').text();

								  //For IOS image save
								  var data = dataURL.replace(/data:image\/(png|jpg|jpeg);base64,/, '');

								  //For Android image save
								  //var data = dataURL.replace(/data:base64,/, '');

								  jsonFindBE["imageAttach"] = data; 

								  jsonExpenseDetailsArr.push(jsonFindBE);

								  busExpDetailsArr.push(busExpDetailId);
							  }
						  });

						  if(accountHeadIdToBeSent!="" && busExpDetailsArr.length>0){
							  sendForApprovalBusinessDetails(jsonExpenseDetailsArr,busExpDetailsArr,accountHeadIdToBeSent);
						  }
					  }else{
						 alert("Tap and select Expenses to send for Approval with server.");
					  }
			});
			
		j('#delete').on('click', function(e){ 
				  var busExpDetailsArr = [];
				  var jsonExpenseDetailsArr = [];
				  expenseClaimDates=new Object;
				
				  var pageRef=defaultPagePath+'fairClaimTable.html';
				  if(j("#source tr.selected").hasClass("selected")){
					  j("#source tr.selected").each(function(index, row) {
						  var busExpDetailId = j(this).find('td.busExpId').text();
						  busExpDetailsArr.push(busExpDetailId);
					  });

					  if(busExpDetailsArr.length>0){
						  for(var i=0; i<busExpDetailsArr.length; i++ ){
							  var businessExpDetailId = busExpDetailsArr[i];
							  deleteSelectedExpDetails(businessExpDetailId);
						  }
					  }
					  j('#mainContainer').load(pageRef);
				  }else{
					  alert("Tap and select Expenses to delete.");
				  }
			});
	j('#synch').on('click', function(e){
				  var busExpDetailsArr = [];
				  var jsonExpenseDetailsArr = [];
				  expenseClaimDates=new Object;
				  if(j("#source tr.selected").hasClass("selected")){
					  j("#source tr.selected").each(function(index, row) { 
						  var busExpDetailId = j(this).find('td.busExpId').text();
						  var jsonFindBE = new Object();
						  var expDate = j(this).find('td.expDate1').text();
						  var expenseDate = expDate;

						  jsonFindBE["expenseDate"] = expenseDate;
						  jsonFindBE["accountHeadId"] =j(this).find('td.accHeadId').text();
						  jsonFindBE["accountCodeId"] = j(this).find('td.accountCodeId').text();
						  jsonFindBE["expenseId"] =j(this).find('td.expNameId').text();
						  jsonFindBE["ExpenseName"] = j(this).find('td.expName').text();
						  jsonFindBE["fromLocation"] = j(this).find('td.expFromLoc1').text();
						  jsonFindBE["toLocation"] = j(this).find('td.expToLoc1').text();
						  jsonFindBE["narration"] = j(this).find('td.expNarration1').text();
						  if(j(this).find('td.expUnit').text()!="" ) {
							  jsonFindBE["units"] = j(this).find('td.expUnit').text();
						  }
						  jsonFindBE["amount"] = j(this).find('td.expAmt1').text();
						  jsonFindBE["currencyId"] = j(this).find('td.currencyId').text();
						  jsonFindBE["perUnitException"] = j(this).find('td.isEntitlementExceeded').text();

						  var dataURL =  j(this).find('td.busAttachment').text();

						  //For IOS image save
						  var data = dataURL.replace(/data:image\/(png|jpg|jpeg);base64,/, '');

						  //For Android image save
						  //var data = dataURL.replace(/data:base64,/, '');

						  jsonFindBE["imageAttach"] = data; 

						  jsonExpenseDetailsArr.push(jsonFindBE);

						  busExpDetailsArr.push(busExpDetailId);

					  });
					  if(busExpDetailsArr.length>0){
						  saveBusinessExpDetails(jsonExpenseDetailsArr,busExpDetailsArr);
					  }
				  }else{
					 alert("Tap and select Expenses to synch with server.");
				  }
			});
	
});
}

function oprationONTravelSettlementExp(){
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	j('#synchTS').on('click', function(e){
			var jsonTravelSettlementDetailsArr = [];
			var travelSettleExpDetailsArr = [];
			minExpenseClaimDate=new Object;
			if(j("#source tr.selected").hasClass("selected")){
				  j("#source tr.selected").each(function(index, row) {
					var travelSettleDetailId = j(this).find('td.tsExpId').text();
					var jsonFindTS = new Object();

					var expDate = j(this).find('td.expDate1').text();
					
					var expenseDate = expDate;
										
					jsonFindTS["expenseDate"] = expenseDate;
					jsonFindTS["travelRequestId"] =j(this).find('td.travelRequestId').text();
					jsonFindTS["accountCodeId"] = j(this).find('td.accountCodeId').text();
					jsonFindTS["expenseId"] =j(this).find('td.expNameId').text();
					jsonFindTS["ExpenseName"] = j(this).find('td.expName').text();

					jsonFindTS["travelModeId"] = j(this).find('td.modeId').text();
					jsonFindTS["travelCategoryId"] = j(this).find('td.categoryId').text();
					jsonFindTS["cityTownId"] = j(this).find('td.fromcityTownId').text();
					jsonFindTS["isModeCategory"] = j(this).find('td.isModeCategory').text();

					jsonFindTS["narration"] = j(this).find('td.expNarration1').text();
					jsonFindTS["units"] = j(this).find('td.expUnit').text();
					jsonFindTS["amount"] = j(this).find('td.expAmt1').text();
					jsonFindTS["currencyId"] = j(this).find('td.currencyId').text();
					
					var dataURL =  j(this).find('td.tsExpAttachment').text();
					
					//For IOS image save
					var data = dataURL.replace(/data:image\/(png|jpg|jpeg);base64,/, '');
					
					//For Android image save
					//var data = dataURL.replace(/data:base64,/, '');
					
					jsonFindTS["imageAttach"] = data; 
					 
					jsonTravelSettlementDetailsArr.push(jsonFindTS);
					
					travelSettleExpDetailsArr.push(travelSettleDetailId);
					});
					if(travelSettleExpDetailsArr.length>0){
				 	 saveTravelSettleExpDetails(jsonTravelSettlementDetailsArr,travelSettleExpDetailsArr);
				  }
			}else{
				 alert("Tap and select Expenses to synch with server.");
			}
			});
			
			j('#deleteTS').on('click', function(e){
				var travelSettleExpDetailsArr = [];
				   
				  var pageRef=defaultPagePath+'travelSettlementTable.html';
				  if(j("#source tr.selected").hasClass("selected")){
					  j("#source tr.selected").each(function(index, row) {
						  var travelSettleDetailId = j(this).find('td.tsExpId').text();
						  travelSettleExpDetailsArr.push(travelSettleDetailId);
					  });
					  if(travelSettleExpDetailsArr.length>0){
						  for(var i=0; i<travelSettleExpDetailsArr.length; i++ ){
							  var travelSettleExpDetailId = travelSettleExpDetailsArr[i];
							  deleteSelectedTSExpDetails(travelSettleExpDetailId);
						  }
					  }
					  j('#mainContainer').load(pageRef);
					  j('#mainHeader').load(headerBackBtn);	
				  }else{
					 alert("Tap and select Expenses to delete.");
				  }	
			});
	}

	function loaded() {
                pictureSource=navigator.camera.PictureSourceType;
                destinationType=navigator.camera.DestinationType;
            }
	
	function onPhotoDataSuccess(imageData) { 
       
        smallImage.style.display = 'block';       
        document.getElementById('image2').files[0] = "data:image/jpeg;base64," + imageData;
		
		smallImage.src = "data:image/jpeg;base64," + imageData;
		if(camerastatus=='1')
		{
		saveWalletAttachment(0);	
		}
		
		
    }
	function capturePhoto(status) {
	
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 10,
            destinationType: 0 });
		camerastatus = status;	
	}
	 
	function onFail(message) {
        
    }
	function onPhotoURISuccess(imageURI) { 
      // Uncomment to view the image file URI 
      // console.log(imageURI);
      // Get image handle
      //
	    smallImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        
        document.getElementById('image2').files[0] = "data:image/jpeg;base64," + imageURI;
		
		smallImage.src = "data:image/jpeg;base64," + imageURI;
		
		 if(camerastatus=='1')
		{			
		saveWalletAttachment(0);	
		}
    }
	
	function getPhoto(source,status) {
      // Retrieve image file location from specified source
	 navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: 0,
        sourceType: source });
		camerastatus = status;
		
    }
	
	
	function saveWalletDetails(jsonWalletArr,jsonWalletIDArr){
		 var walletID;
		 var i = 0;
		 var headerBackBtn=defaultPagePath+'headerPageForWalletOperation.html';
		 var pageRef=defaultPagePath+'addToWallet.html';
		 j('#loading_Cat').show();
		 for(i; i<jsonWalletArr.length; i++ ){
			 j.ajax({
					  url: urlPath+"WalletReceiptsService",
					  type: 'POST',
					  dataType: 'json',
					  crossDomain: true,
					  data: JSON.stringify(jsonWalletArr[i]),
					  success: function(data) {
						if(data.SyncStatus=="Success"){
							for(var i=0; i<jsonWalletIDArr.length; i++ ){
								walletID = jsonWalletIDArr[i];
								deleteSelectedWallets(walletID);
							 }
							document.getElementById("wallet_msg").innerHTML = "Selected File synch successfully.";
							j('#mainHeader').load(headerBackBtn);
							j("#walletSource td.selected").hide();
							j('#wallet_msg').hide().fadeIn('slow').delay(3000).fadeOut('slow');  
							j('#loading_Cat').hide();
						}else if(data.SyncStatus=="Error"){
							document.getElementById("wallet_msg").innerHTML = "Error: Oops something is wrong, Please Contact System Administer";
							j('#mainHeader').load(headerBackBtn);
						 	j('#wallet_msg').hide().fadeIn('slow').delay(3000).fadeOut('slow');
							j('#loading_Cat').hide();
						}else if(data.SyncStatus=="Failure"){
							document.getElementById("wallet_msg").innerHTML = "File "+data.FileName+" synch fail.";
							j('#mainHeader').load(headerBackBtn);
							j('#wallet_msg').hide().fadeIn('slow').delay(3000).fadeOut('slow');
							j('#loading_Cat').hide();
						}
					},
					  error:function(data) {
						  j('#loading_Cat').hide();
						}
				});
			}
		}

function oprationOnWallet(){
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	j('#synchWallet').on('click', function(e){
						  var jsonWalletArr = [];
						  var jsonWalletIDArr = [];
						  if(j("#walletSource td.selected").hasClass("selected")){
						  j("#walletSource td.selected").each(function(index, row) { 
							var jsonFindWalletData = new Object();
							var jsonFindWalletId = new Object();
							var walletData = j(this).text();
							jsonFindWalletId = j(this).find('#para').text();						
							//var dataURL =  j(this).find('td.walletattach').text();
							
							//For IOS image save
							var data = walletData.replace(/data:image\/(png|jpg|jpeg);base64,/, '');
							//For Android image save
							//var data = data.replace(/data:base64,/, '');
							jsonFindWalletData["fileName"] = "walletFile_"+window.localStorage.getItem("EmployeeId")+"_"+j(this).find('#para').text()+".jpeg";
							jsonFindWalletData["fileData"] = data; 
							jsonFindWalletData["employeeId"] = window.localStorage.getItem("EmployeeId");
							jsonWalletArr.push(jsonFindWalletData);
							jsonWalletIDArr.push(jsonFindWalletId);
							
						});
						if(jsonWalletArr.length>0){
						  saveWalletDetails(jsonWalletArr,jsonWalletIDArr);
						}
					}else{
					   alert("Tap and select My Receipts Wallet to synch with server.");
					  }
					});
			}

function notActivated(){
	alert("Not Activated!");
}			