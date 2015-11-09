$(document).ready(function () {
    //alert('hi');
    
    timeline.start = new Date("06/14/2010");
    timeline.run();
    timeline.init();
    
    $("#event_startdate").datepicker({'dateFormat':'yy-mm-dd'});
    //$("#time").append('<div style="width:205px; height:30px; background-color:red; position:absolute; top:170px; left:205px;"></div>');
})
.on("click", ".action_addevent", function(e){
    e.preventDefault();
    timeline.firebase.push({'name':'Sample Event 3','length':16,'startdate':'2010-6-17'});
})
.on("click", ".action_addformevent", function(e){
    e.preventDefault();
    var eventfields = [];
    eventfields.name = $("#event_name").val();
    eventfields.date = $("#event_startdate").val();
    eventfields.days = $("#event_length").val();
    //$("#datapool").html($(".addeventfield").serialize());
    timeline.firebase.push({'name':eventfields.name,'length':eventfields.days,'startdate':eventfields.date});
    $("#datapool").show().html('Event Added.').delay(10).fadeOut(1000);
})
.on("click", ".event", function(){
	//Load Data Into Box Below.
	var updateform = $("#form_addevent").html();
	$("#datapool").html("<h2>Update Event</h2><div>"+$(this).find("span").html()+"</div><div>"+$(this).data("length")+"</div><div>"+$(this).data("startdate")+"</div>");
})
;