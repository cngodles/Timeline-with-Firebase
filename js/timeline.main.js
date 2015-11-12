var timeline = {
    start: '',
    steps: 0,
    year: 0,
    month: '',
    width: 41,
    height:30,
    firebase: false,
    myevents:false,
	projectbase:false,
    FBauthdata:null,
	events: [],
    projects:[],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    init: function () {
        var thisobj = this;
        this.firebase = new Firebase('https://ralena.firebaseio.com/timeline/events');
        this.FBauthdata = this.firebase.getAuth();
		if (this.FBauthdata) {
			thisobj.myevents = thisobj.firebase.child(thisobj.FBauthdata.uid);
			thisobj.grabEvents();
		} else {
			this.firebase.authWithOAuthPopup("facebook", function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					console.log("Authenticated successfully with payload:", authData);
					thisobj.myevents = thisobj.firebase.child(thisobj.FBauthdata.uid);
					thisobj.grabEvents();
				}
			});
		}
		

		/*
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
        */
    },
	grabEvents:function(){
		var thisobj = this;
		this.firebase.on('value', function (snapshot) {
			var loadedData = snapshot.val();
			thisobj.events = [];   
			for (var i in loadedData) {
				if (loadedData.hasOwnProperty(i)) {
					thisobj.events.push({'id':i,'color':loadedData[i].color,'name':loadedData[i].name,'length':loadedData[i].length,'startdate':loadedData[i].startdate});
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
            //var startpos = 410;
            var eventStartDate = new Date(this.events[i].startdate);
            
            // Do the math.
            var millisecondsPerDay = 86400000;
            var millisBetween = eventStartDate.getTime() - this.start.getTime();
            var eventdays = Math.ceil(millisBetween / millisecondsPerDay) + 1;
            //Not sure why I had to add 1 to get them positioned correctly, but that is where we are.
            console.log("Start Day Seperation: "+eventdays);
            $("#time").append('<div class="event source '+this.events[i].color+'" data-startdate="'+this.events[i].startdate+'" data-length="'+this.events[i].length+'" id="event_'+this.events[i].id+'" style="position:absolute; width:'+(this.events[i].length * this.width)+'px; height:'+this.height+'px; line-height:'+this.height+'px; top:'+eventpostop+'px; left:'+(eventdays * this.width)+'px;"><span class="editable">'+this.events[i].name+'</span></div>');
            eventpostop += 40;
        }
        this.resizers();
    },
    resizers:function(){
      var thisobj = this;
        $(".event")
          .resizable({
            grid:[thisobj.width,30],
            minWidth:thisobj.width,
            minHeight:30,
            maxHeight:30,
            handles:'e,w',
            stop: function( event, ui ) {
                //Going to need to adjust based on new position as well in case of left side resize.
                var thisid = ui.originalElement.attr("id").split('_');
				console.log(thisid[1]);
				var newlength = (ui.size.width / thisobj.width);
				if(ui.position.left != ui.originalPosition.left){
                    //If the left side position has changed due to a resize event.
					var daystosubtract;;
                    if(ui.position.left < ui.originalPosition.left){
                        //subtraction days.
                        daystosubtract = (((ui.originalPosition.left - ui.position.left) / thisobj.width) - 1) * -1;
                    } else {
                        //addition days.
                        daystosubtract = ((ui.position.left - ui.originalPosition.left) / thisobj.width) + 1;
                    }
                    console.log(daystosubtract);
                    var originalstartdate = new Date(ui.originalElement.data('startdate'));
					var finalnewleftdate = ($.datepicker.formatDate("yy-mm-dd", new Date(originalstartdate.getTime() + (86400000 * daystosubtract))));
					thisobj.firebase.child(thisid[1]).update({'length':newlength,'startdate':finalnewleftdate});
                } else {
					thisobj.firebase.child(thisid[1]).update({'length':newlength});
				}
            }
        })
        .draggable({
            axis:'x',
            grid:[thisobj.width,40],
            stop: function( event, ui ) {
                //console.log(ui.helper.attr("id"));
                var thisid = ui.helper.attr("id").split('_');
                var newstartdate;
                if(ui.position.left > 0){
                    var slot = (ui.position.left / thisobj.width) - 1;
                    var datemili = thisobj.start.getTime() + (86400000 * slot);
                    newstartdate = $.datepicker.formatDate("yy-mm-dd", new Date(datemili));
                } else {
                    newstartdate = $.datepicker.formatDate("yy-mm-dd", thisobj.start);
                }
                thisobj.firebase.child(thisid[1]).update({'startdate':newstartdate});
                console.log(newstartdate);
            }
      });  
    },
	auth:function(){
		var ref = new Firebase("https://ralena.firebaseio.com");
		ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
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