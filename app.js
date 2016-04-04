$(document).ready(function(){
  $.get("https://sheetsu.com/apis/v1.0/ba3cacae").done(function(data) {
    displayEvents(data);
  });

  $("body").on("click",".event-card",function(){
    showPop();
  });

  $("body").on("click",".event-popup-wrapper",function(){
    hidePop();
  });


});

var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function showPop(){
  $(".event-popup-wrapper").show();
}

function hidePop(){
  $(".event-popup-wrapper").hide();
}


function displayEvents(data){

  $(".throbber").addClass("goodbye");
  $(".month").show();

  var eventCount = Object.keys(data).length;
  $(".event-count").text(eventCount);

  var participants = 0;

  for(var k in data){

    var itemEl = $(".event-card.template").clone();
    var item = data[k];

    //Date
    var date = new Date(item.Timestamp);
    var dayNum = date.getDay();
    var dayOfWeek = dayNames[dayNum];
    var dayOfMonth = date.getDate();
    var monthNumber = date.getMonth();
    var monthName = monthNames[monthNumber];
    itemEl.find(".event-date .value").text(monthName + " " + dayNum);

    //Club Name
    var clubName = item["Club Name"];
    itemEl.find(".event-club .value").text(clubName);

    //Club Attendance
    var attendance = item["How many people were there?"];
    itemEl.find(".event-attendance .value").text(attendance);

    participants = participants + parseInt(attendance);

    //Club Location
    var location = item["Event Location"];
    itemEl.find(".event-location .value").text(location);

    itemEl.removeClass("template");
    $(".events").append(itemEl);
  }

  $(".participant-count").text(participants);

}