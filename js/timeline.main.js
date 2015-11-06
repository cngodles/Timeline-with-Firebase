var timeline = {
    start: '',
    steps: 0,
    year: 0,
    month: '',
    width: 41,
    firebase: false,
    projectbase:false,
    events: [],
    projects:[],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    init: function () {
        var thisobj = this;
        this.firebase = new Firebase('https://ralena.firebaseio.com/timeline/events');
        this.firebase.on('value', function (snapshot) {
            var loadedData = snapshot.val();
            timeline.events = [];   
            for (var i in loadedData) {
                if (loadedData.hasOwnProperty(i)) {
                    timeline.events.push({'id':i,'name':loadedData[i].name,'length':loadedData[i].length,'startdate':loadedData[i].startdate});
                }
            }

            thisobj.addEvents();
        });
        this.projectbase = new Firebase('https://ralena.firebaseio.com/timeline/projects');
        this.projectbase.on('value', function (snapshot) {
            var loadedProjectData = snapshot.val();
            timeline.projects = [];   
            for (var i in loadedProjectData) {
                if (loadedProjectData.hasOwnProperty(i)) {
                    timeline.projects.push({'name':loadedData[i].name,'length':loadedData[i].length,'startdate':loadedData[i].startdate});
                }
            }

            thisobj.addEvents();
        });
    },
    addEvents: function () {
        //Loops through Firebase events and adds them to the timeline.
        $(".event").remove();
        var eventpostop = 170;
        for (i = 0; i < this.events.length; i++) {
            var startpos = 410;
            var eventStartDate = new Date(this.events[i].startdate);
            
            // Do the math.
            var millisecondsPerDay = 86400000;
            var millisBetween = eventStartDate.getTime() - this.start.getTime();
            var eventdays = Math.ceil(millisBetween / millisecondsPerDay) + 1;
            //Not sure why I had to add 1 to get them positioned correctly, but that is where we are.
            console.log("Start Day Seperation: "+eventdays);
            $("#time").append('<div class="event" id="event_'+this.events[i].id+'" style="width:'+(this.events[i].length * 41)+'px; height:30px; background-color:red; position:absolute; color:#fff; top:'+eventpostop+'px; line-height:30px; left:'+(eventdays * 41)+'px;">&nbsp;&nbsp;&nbsp;'+this.events[i].name+'</div>');
            eventpostop += 40;
        }
        this.resizers();
    },
    resizers:function(){
      var thisobj = this;
        $(".event")
          .resizable({
            grid:[41,30],
            minHeight:30,
            maxHeight:30,
            handles:'e,w',
            stop: function( event, ui ) {
                var newlength = (ui.size.width / thisobj.width);
                var thisid = ui.originalElement.attr("id").split('_');
                console.log(thisid[1]);
                thisobj.firebase.child(thisid[1]).update({"length":newlength});
            }
        })
        .draggable({
            axis:'x',
            grid:[41,40],
            stop: function( event, ui ) {
                var newstartdate;
                if(ui.position.left > 0){
                    var slot = ui.position.left / thisobj.width;
                    console.log(slot);
                    var datemili = thisobj.start.getTime() + (86400000 * slot);
                    console.log(datemili);
                    newstartdate = new Date(datemili);
                } else {
                    newstartdate = thisobj.start;
                }
                alert(ui.position.left + ' ' +newstartdate);
            }
      });  
    },
    run: function () {
        //var start = new Date("06/14/2010");
        var end = new Date();
        var start = this.start;


        var push = [];
        push.push('<div style="display:none">');
        push.push('<div style="display:none">');

        while (start < end) {
            //The month is the current month + 1
            var month = start.getMonth() + 1;
            var year = start.getFullYear();


            if (year != this.year) {
                //Push in the HTML for the year.
                push.push('</div></div><div class="year"><h2>' + start.getFullYear() + '</h2>');
                push.push('<div style="display:none">');
                this.year = year;
            }

            if (month != this.month) {
                //Push in the HTML for the month.
                push.push('</div><div class="month"><h3>' + this.monthNames[month - 1] + '</h3>');
                this.month = month;
            }

            //Push in the HTML for the day.
            push.push('<div class="col">' + month + '/' + start.getDate() + '</div>');

            var newDate = start.setDate(start.getDate() + 1);
            start = new Date(newDate);
            this.steps++;

        }
        push.push('</div>');
        push.push('</div>');
        $("#time").html(push.join(''));
        $("#time").css('width', this.steps * this.width);

        $(".month").each(function () {
            var totitems = $(this).find(".col").length;
            $(this).width(totitems * this.width);
        });
        $(".year").each(function () {
            var totitems = $(this).find(".col").length;
            $(this).width(totitems * this.width);
        });
    }

}