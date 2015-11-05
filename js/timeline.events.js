$(document).ready(function () {
    //alert('hi');
    
    timeline.start = new Date(2010, 5, 14, 7, 34, 0, 0);
    timeline.run();
    timeline.init();
    
    $("#time").append('<div style="width:205px; height:30px; background-color:red; position:absolute; top:170px; left:205px;"></div>');
})
.on("click", ".action_addevent", function(e){
    e.preventDefault();
    timeline.firebase.push({'name':'Sample Event','length':7,'startdate':'2010-6-25'});
})
.on("click", ".action_addformevent", function(e){
    e.preventDefault();
    $("#datapool").html($(".addeventfield").serialize());
    //timeline.firebase.push({'name':'Sample Event','length':7,'startdate':'2010-6-25'});
})
;