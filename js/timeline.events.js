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
        $(this).html('<input value="'+text+'">').addClass("editing");
        $(this).find("input").focus();
    }
    return false;
})
.on("blur", ".editable input", function(){
    var thisevent = $(this);
    var thisid = thisevent.parents(".source").attr("id").split("_");
    var newvalue = thisevent.val();
    var thistype = thisevent.parent().attr("rel");
    //console.log(thisid[0]+' '+thisid[1]+' '+newvalue+' '+thistype);
    if(newvalue.length == 0){
        newvalue = thisevent.parent().data('default');
    }
    if(newvalue.indexOf("+ Add") == -1 && newvalue.indexOf("+ YouTube") == -1){
        // $.post("ajax_services.php", {"do":"update","type":thisid[0],"target":thistype,"id":thisid[1],"value":newvalue});

        event = timeline.firebase.child();

        console.log(event);


        // timeline.firebase.once('value', function(snapshot){
            
        //     console.log(snapshot.val());

        //     // var loadedData = snapshot.val();
        //     // for (var i in loadedData){
        //     //     if(i == thisid[1]){
        //     //         loadedData[i].name = newvalue;                    
        //     //     }
        //     // };
        // })
    }
    setTimeout(function(){ thisevent.parent().html(newvalue).removeClass("editing"); }, 500);
})
;