// store all created alarms
var alarms=[];
// store all pre-defined categories.
var cate_options = [];
// an auto increment number. Used to assign to each newly created alarm row.
var auto_incre=0;

var stopIndices=[];

/*
* This function add options to 'select' element.
*/

function addOption(){
	//add category options
	var select_cate = document.getElementById("category_list");	
	cate_options.push("Other");
	cate_options.push("Cardio");
	cate_options.push("Work out");
	cate_options.push("Wake up");
	cate_options.push("Appointment");
	for(var i=0;i<cate_options.length;i++){
		var newOption = document.createElement("option");	
		newOption.innerText=cate_options[i];
		select_cate.appendChild(newOption);	
	}
	// add 1 to 12 as hour options.
	var select_hour = document.getElementById("hour_list");
	for (var i=1;i<=12;i++){
		var newOption = document.createElement("option");
		newOption.innerText = i;
		select_hour.appendChild(newOption);
	}

	// add 00 to 59 as minitue options.
	var select_minute = document.getElementById("minute_list");
	for (var i=0;i<=59;i++){
		var newOption = document.createElement("option");
		if(i<10){
			newOption.innerText="0"+i;
		}else{
			newOption.innerText = i;
		}
		select_minute.appendChild(newOption);
	}

	// add buttons to button row
	var buttonRow = document.getElementById("button_row");
	for(var i=0;i<cate_options.length;i++){
		var newButton = document.createElement("BUTTON");
		newButton.innerText=cate_options[i];
		newButton.id=cate_options[i];
        newButton.className = "add_btn"
		newButton.onclick = category_selected;
		buttonRow.appendChild(newButton);
	}

	// when first loaded, set default values;
	document.getElementById("category_list").selectedIndex=-1;
	document.getElementById("hour_list").selectedIndex = -1;
	document.getElementById("minute_list").selectedIndex=-1;
	document.getElementById("description").value="";
	document.getElementById("am_pm").innerText="AM";

	//load data which stored in database.
	load_data();
	sivamtime();
	

}


/*
* Display real time clock
 */
function sivamtime() {
	now=new Date();
	hour=now.getHours();
	min=now.getMinutes();
	sec=now.getSeconds();if (min<=9) { min="0"+min; }
	if (sec<=9) { sec="0"+sec; }
	if (hour>12) { hour=hour-12; add="pm"; }
	else { hour=hour; add="am"; }
	if (hour==12) { add="pm"; }
	document.timeForm.field.value = ((hour<=9) ? "0"+hour : hour) + ":" + min + ":" + sec + " " + add;
	setTimeout("sivamtime()", 1000);
}

/*
* When page first loaded, show alarms of that user.
 */
function load_data(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState==4 && xhttp.status==200){
			var data = xhttp.responseText.split(";");
			for(var i=0;i<data.length-1;i++){
				var para = data[i].split(",");
				para[0] = parseInt(para[0]);
				para[1] = parseInt(para[1]);
				para[2] = parseInt(para[2]);
                if(para[6]=="True"){
                    para[6]=true;
                }else{
                    para[6]=false;
                }
				var alarm = {id:para[0],hour:para[1],minute:para[2],am_pm:para[3],category:para[4],desp:para[5],status:para[6],timeOut:null};
				var newRow = alarm_table_row(alarm,alarm.status,alarm.id);
				alarm.newRow = newRow;
				alarms.push(alarm);
                if(alarm.id>auto_incre) auto_incre=alarm.id;
			}
		}
	}

	xhttp.open("GET","/loadData",false);
	xhttp.send();
    alarms.sort(newComparetor);

	showAlarms(alarms);
	auto_incre++;

	//set time out if status is true, has to be after showAlarms, otherwise,
	//document.getElement won't work.
	for(var i=0;i<alarms.length;i++){
		if(alarms[i].status==true && alarms[i].timeOut==null){
			alarms[i].timeOut = setAlarm(alarms[i].hour,alarms[i].minute,alarms[i].am_pm,i);
		}
	}
}


/*
* This function is called when am/pm button is clicked.
* It enable a swtich between am and pm
*/
function switch_am_pm(){
	var time= document.getElementById("am_pm");
	if (time.innerText=="AM"){
		time.innerText="PM";
	}else{
		time.innerText="AM";
	}

}

/*
* This function add am alarm to the list
*/
function setClock(){
	var cateogory_index = document.getElementById("category_list").selectedIndex;
	var category;
	if(cateogory_index==-1){
		category=cate_options[0];
	}else{
		category=cate_options[cateogory_index];
	}
	var hour_index = document.getElementById("hour_list").selectedIndex;
	if(hour_index==-1){
		alert("Hour needed!");
		return;
	}
	var hour = hour_index+1;
	var minute_index = document.getElementById("minute_list").selectedIndex;
	if(minute_index==-1){
		alert("Minute needed!");
		return;
	}
	var minute=minute_index;
	//if(minute_index<10){
	//	minute = "0"+minute_index;
	//}else{
	//	minute = minute_index;
	//}
	var am_pm=document.getElementById("am_pm").innerText;
	var desp = document.getElementById("description").value;
    if (desp==""){
        desp=" ";
    }

	// after information is read, set all fields to default
	document.getElementById("category_list").selectedIndex=-1;
	document.getElementById("hour_list").selectedIndex = -1;
	document.getElementById("minute_list").selectedIndex=-1;
	document.getElementById("description").value="";
	document.getElementById("am_pm").innerText="AM";

	var alarm = {id:auto_incre,hour:hour,minute:minute,am_pm:am_pm,category:category,desp:desp,status:true,timeOut:null};

	var newRow = alarm_table_row(alarm,alarm.status,alarm.id);

	alarm.newRow = newRow;
	for(var i=0;i<alarms.length;i++){
		if(alarm==alarms[i]){
			alert("Alarm already exists.");
			break;
		}
	}

	alarms.push(alarm);
	alarms.sort(newComparetor);

	showAlarms(alarms);

	//add timeOut to newly added alarm
	for(var i=0;i<alarms.length;i++){
		if(alarms[i].status==true && alarms[i].timeOut==null){
			alarms[i].timeOut = setAlarm(alarm.hour,alarm.minute,alarm.am_pm,i);
		}
	}


    var sendParameters = "?MyID="+auto_incre+"&Hour="+hour
    +"&Minute="+minute+"&Am_pm="+am_pm+"&Category="+
            category+"&Description="+desp+"&Status="+true;
    $.ajax({url:"/addAlarm/"+sendParameters,success:function(result){
        console.log(result);
    }});


	auto_incre++;
}

/*
* Define a new comparetor to sort alarms
*/
function newComparetor(alarm1,alarm2){
	if (alarm1.am_pm==alarm2.am_pm){
		if(alarm1.hour!=alarm2.hour){
			return alarm1.hour-alarm2.hour;
		}else{
			return alarm1.minute-alarm2.minute;
		}
	}else if(alarm1.am_pm=="AM"){
		return -1;
	}else{
		return 1;
	}
}

/*
* This function show only selected category alarms.
*/
function category_selected(){
	var category=this.id;
	var newAlarms=[];
	for(var i=0;i<alarms.length;i++){
		if(alarms[i].category==category){
			newAlarms.push(alarms[i]);
		}
	}
	newAlarms.sort(newComparetor);
	showAlarms(newAlarms);
}

// show specified alarms within table.
function showAlarms(alarms){
	var table = document.getElementById("showClock");
	table.innerHTML="";
	for(var i=0;i<alarms.length;i++){
		var newRow = alarms[i].newRow;
		table.appendChild(newRow);
	}
}

/*
* This function create a fancy button inside a column.
*/
function create_fancy_button(status,ID) {
	var newCol = document.createElement("td");
	var newDiv = document.createElement("div");
	newDiv.className = "container";
	var newLable = document.createElement("label");
	newLable.className = "switch";
	var newInput = document.createElement("input");
	newInput.type = "checkbox";
	newInput.className = "switch-input";
	newInput.onchange = switchOnOff;
	newInput.id = ""+ID;
	if (status == true) {
		newInput.checked = "checked";
	}
	var newSpan = document.createElement("span");
	newSpan.className="switch-label";
	var newSpan2 = document.createElement("span");
	newSpan2.className="switch-handle";
	newLable.appendChild(newInput);
	newLable.appendChild(newSpan);
	newLable.appendChild(newSpan2);
	newDiv.appendChild(newLable);
	newCol.appendChild(newDiv);
	return newCol;
}

/*
* Show all alarms.
*/
function show_all_alarms(){
	showAlarms(alarms);
}

/*
* For each newly created alarm, create a new row.
* Assign each column a class name.
*/
function alarm_table_row(alarm,status,ID){
	var newRow = document.createElement("tr");
	var newCol = document.createElement("td");
	newCol.className = 	"Alarm"+ID;
	//newCol.className = 	"AlarmCol";
	//console.log(newCol.className);
	var minute = alarm.minute;
	if(minute<10){
		minute="0"+minute;
	}
	newCol.innerText = alarm.hour+":"+minute+" "+alarm.am_pm+" "+alarm.category+" "+alarm.desp+"\n";
	var newCol2 = create_fancy_button(status,ID);
	newCol2.className = "Alarm"+ID;
	newRow.appendChild(newCol);
	newRow.appendChild(newCol2);
	return newRow;
}

/*
* When any on or off button, actually checkbox is clicked, this function is called.
* It loops through all alarms listed to see which one is checked and update its status.
* Then call updateAlarm function to change the status of that alarm in database.
*/
function switchOnOff(){
	for(var i=0;i<alarms.length;i++){
		var ID = alarms[i].id;
		var row = document.getElementById(""+ID);
		if(row.checked!=alarms[i].status){
			alarms[i].status = row.checked;
			if(row.checked==true){
				alarms[i].timeOut=setAlarm(alarms[i].hour,alarms[i].minute,alarms[i].am_pm);
			}else{
				clearTimeout(alarms[i].timeOut);
				alarms[i].timeOut=null;
			}
			updateAlarm(ID,row.checked);
			return;
		}
	}
}

/*
* update alarm in database
 */
function updateAlarm(ID,status){
	var sendParameters = "?MyID="+ID+"&Status="+status;
    $.ajax({url:"/updateAlarm/"+sendParameters,success:function(result){
        console.log(result);
    }});
}

/*
* When an alarm is turned on, set time out so that when it's the time, do some changes.
 */
function setAlarm(hour,minute,am_pm,index){
	var now = new Date();
	if(am_pm=="PM"&&hour!=12){
		hour = hour+12;
	}
	var alarmTime = new Date(now.getFullYear(),now.getMonth(),now.getDate(),hour,minute,0,0);
	var ms = alarmTime-now;
	if(ms<0){
		ms +=86400000;
	}
	var timeOut = setTimeout(function(){
		onAlarmOn(index);
	},ms);
	return timeOut;
}

/*
* When it's time of a certain alarm, it will notify user.
 */
function onAlarmOn(index){
	stopIndices.push(index);
	var ID = alarms[index].id;
	var alarmRow = document.getElementsByClassName("Alarm"+ID);
	alarmRow[0].style.fontSize='25px';
	alarmRow[0].style.color='orangered';
	alarmRow[0].style.backgroundColor='yellow';
	var audio = new Audio('/static/alarm.mp3');
	audio.play();


}

/*
* User could manually stop a clock.
 */
function stopClock(){
	for(var i=0;i<stopIndices.length;i++){
		var index = stopIndices[i];
		var ID = alarms[index].id;
		var alarmRow = document.getElementsByClassName("Alarm"+ID);
		alarmRow[0].style.fontSize='16px';
		alarmRow[0].style.color='black';
		alarmRow[0].style.backgroundColor='transparent';
	}
	stopIndices=[];

}







