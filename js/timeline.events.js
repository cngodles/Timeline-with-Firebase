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
    timeline.myevents.push({'name':'Sample Event 4','length':16,'startdate':'2010-06-17'});
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
.on("click", ".action_updateformevent", function(e){
    e.preventDefault();
    var eventfields = [];
    eventfields.name = $("#event_name_update").val();
    eventfields.days = $("#event_length_update").val();
    eventfields.date = $("#event_startdate_update").val();
    eventfields.eventid = $("#event_id_update").val();

    console.log(eventfields);

    timeline.myevents.child(eventfields.eventid).update({ 'name': eventfields.name, 'startdate': eventfields.date, 'length': eventfields.days });
})
.on("click", ".editable", function(){
    if(!$(this).hasClass("editing")){
        var text = $(this).text();
        if(text.indexOf("+ Add") == 0){
            text = '';
        }
        $(this).html('<input value="'+text+'">').addClass("editing");
        $(this).find("input").focus();
    }
    return false;
})
.on("blur", ".editable input", function(){
    var $this = $(this);
    var id = $this.parents(".source").attr("id").split("_")[1];
    var fbobj = timeline.firebase.child(id);
    var newvalue = $this.val();
    var oldvalue = '';

    fbobj.once('value', function(snapshot){
        oldvalue = snapshot.child('name').val();
    });

    if(newvalue.toLowerCase() !== oldvalue.toLowerCase()){
        fbobj.update({ name: newvalue });
    }

    setTimeout(function(){ $this.parent().html(newvalue).removeClass("editing"); }, 500);
})
.on("click", ".event", function(){
    //Load Data Into Box Below.
    var updateform = $("#form_addevent").html();
    $("#datapool").html("<h2>Update Event</h2><div>"+$(this).find("span").html()+"</div><div>"+$(this).data("length")+"</div><div>"+$(this).data("startdate")+"</div>");
})
.on("click", ".dialog-button", function(){
    var $this = $(this);
    var id = $this.parents(".source").attr("id").split("_")[1];
    var fbobj = timeline.myevents.child(id);

    $(".dialog").dialog();

    fbobj.once("value", function(snapshot){
        $("input[name='name']").val(snapshot.child('name').val());
        $("input[name='startdate']").val(snapshot.child('startdate').val());
        $("input[name='length']").val(snapshot.child('length').val());
        $("input[name='eventid']").val(id);
    });
})
;