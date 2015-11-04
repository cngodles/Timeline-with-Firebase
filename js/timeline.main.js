var timeline = {
    start: '',
    steps: 0,
    year: 0,
    month: '',
    width: 41,
    firebase: false,
    events: [],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    init: function () {
        var thisobj = this;
        var loadedData;
        thisobj.firebase = new Firebase('https://ralena.firebaseio.com/timeline/events');
        thisobj.firebase.on('value', function (snapshot) {
            loadedData = snapshot.val();
            //console.log('Objects Loaded: '+loadedData);
            
            
            for (var i in loadedData) {
                if (loadedData.hasOwnProperty(i)) {
                    timeline.events.push({'name':loadedData[i].name,'length':loadedData[i].length,'startdate':loadedData[i].startdate});
                }
            }
            
            
            /*
            for (i = 0; i < loadedData.length; i++) {
                thisobj.events.push(loadedData[i]);
            }
            */
            //thisobj.events = snapshot.val();
            thisobj.addEvents();
        });
    },
    addEvents: function () {

        $("#time .event").remove();
        for (i = 0; i < this.events.length; i++) {
            var startpos = 410;
            var eventStartDate = new Date(this.events[i].startdate);
            
            // Do the math.
            var millisecondsPerDay = 86400000;
            var millisBetween = eventStartDate.getTime() - this.start.getTime();
            var eventdays = Math.floor(millisBetween / millisecondsPerDay);
            
            $("#time").append('<div class="event" style="width:'+(this.events[i].length * 41)+'px; height:30px; background-color:red; position:absolute; top:170px; left:'+(eventdays * 41)+'px;">'+this.events[i].name+'</div>');
        }
    },
    run: function () {
        var start = new Date("06/14/2010");
        var end = new Date();
        this.start = start;


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