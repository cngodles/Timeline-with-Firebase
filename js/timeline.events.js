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
.on("click", ".editable", function(){
    if(!$(this).hasClass("editing")){
        var text = $(this).text();
        if(text.indexOf("+ Add") == 0){
            text = '';
        }
        $(this).html('<input value="'+text+'" style="width:100%">').addClass("editing");
        $(this).find("input").focus();
    }
    return false;
})
.on("blur", ".editable input", function(){
    var $this = $(this);
    var thisobj = this;
    var thisid = $this.parents(".source").attr("id").split("_")[1];
    var newvalue = $this.val();

    if(newvalue.length == 0){
        newvalue = $this.parent().data('default');
    }
    if(newvalue.indexOf("+ Add") == -1 && newvalue.indexOf("+ YouTube") == -1){

        timeline.firebase.child(thisid).update({ name: newvalue });

    }
    setTimeout(function(){ $this.parent().html(newvalue).removeClass("editing"); }, 500);
.on("click", ".event", function(){
	//Load Data Into Box Below.
	var updateform = $("#form_addevent").html();
	$("#datapool").html("<h2>Update Event</h2><div>"+$(this).find("span").html()+"</div><div>"+$(this).data("length")+"</div><div>"+$(this).data("startdate")+"</div>");
})
;