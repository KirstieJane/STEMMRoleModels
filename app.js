// TODO - store the results of the query in a separate object
// Then iterate over it to give it some IDs etc..
// Then we can use those IDs to show the full versions in teh popup. Woop

// PROTOTYPE TODO - localstorage handling, so you dont have to get new data all the time if you dont want to

var dataKeys = {
  "Club Name" : "club-name",
  "Event Description" : "event-description",
  "Event Location" : "event-location",
  "How many people were there?" : "event-attendance",
  "Timestamp" : "event-date"
}

$(document).ready(function(){

  // if(!localStorage.getItem("data")) {
    $.get("https://sheetsu.com/apis/v1.0/ba3cacae").done(function(returnedData) {
      data = returnedData;
      // localStorage.setItem("data",JSON.stringify(data));
      displayEvents();
    });
  // } else {
  //   data = JSON.parse(localStorage.getItem("data"));
  //   displayEvents();
  // }

  $("body").on("click",".event-card",function(){
    var id = $(this).data("id");
    showPop(id);
  });

  $("body").on("click",".event-popup-wrapper .event-nav",function(e){
    if($(this).hasClass("next")){
      navigatePopup("next");
    } else {
      navigatePopup("previous");
    }
    e.stopPropagation();
  });

  $("body").on("click",".event-popup-wrapper .close-pop",function(e){
    hidePop();
    e.stopPropagation();
  });

  // $("body").on("click",".event-popup-wrapper",function(){
  //   hidePop();
  // });

  $(window).on("keydown",function(e){
    if(e.keyCode == 37) {
      navigatePopup("previous");
    }
    if(e.keyCode == 39) {
      navigatePopup("next");
    }
    if(e.keyCode == 27) {
      hidePop();
    }
  });

});

var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var data;

function navigatePopup(direction) {
  if($(".event-popup-wrapper").is(":visible")) {
    var currentId = parseInt($(".event-popup-wrapper").data("id"));

    if(direction == "next") {
      currentId++;
      if(currentId > Object.keys(data).length) {
        currentId = 1;
      }
    } else {
      currentId--;
      if(currentId < 1) {
        currentId = Object.keys(data).length;
      }
    }
    showPop(currentId);
  }
}


function showPop(id){
  var pop = $(".event-popup-wrapper");

  pop.show();

  for(var k in data){
    var item = data[k];

    pop.data("id",id);

    if(item.id == id) {
      for(var j in item){
        if(dataKeys[j]) {
          var className = dataKeys[j];
          var itemData = item[j];

          if(j == "Timestamp") {
            itemData = formatDate(itemData);
          }
          pop.find("." + className + " .value").text(itemData);
        }
      }
    }
  }
}

function hidePop(){
  $(".event-popup-wrapper").hide();
}

function formatDate(dateString) {
  var date = new Date(dateString);
  var dayNum = date.getDay();
  var dayOfWeek = dayNames[dayNum];
  var dayOfMonth = date.getDate();
  var year = date.getFullYear();
  var monthNumber = date.getMonth();
  var monthName = monthNames[monthNumber];
  return monthName + " " + dayNum + ", " + year;
}

function dateSort(a,b){
  var dateA = new Date(a["Timestamp"]);
  var dateB = new Date(b["Timestamp"]);
  if(dateA > dateB) {
    return 1;
  } else {
    return -1;
  }
}

function displayEvents(){
  data = data.sort(dateSort);

  $(".throbber").addClass("goodbye");
  $(".month").show();

  var eventCount = Object.keys(data).length;
  $(".event-count").text(eventCount);

  var participants = 0;
  var id = 1;

  for(var k in data){
    var itemEl = $(".event-card.template").clone();
    var item = data[k];
    item.id = id;
    itemEl.data("id",id);
    id++;

    //Date
    var dateString = formatDate(item.Timestamp);
    itemEl.find(".event-date .value").text(dateString);

    //Club Name
    var clubName = item["Club Name"];
    itemEl.find(".event-club .value").text(clubName);

    //Club Attendance
    var attendance = item["How many people were there?"];
    itemEl.find(".event-attendance .value").text(numberWithCommas(attendance));

    participants = participants + parseInt(attendance);

    //Club Location
    var location = item["Event Location"];
    itemEl.find(".event-location .value").text(location);

    itemEl.removeClass("template");
    $(".events").append(itemEl);
  }

  $(".participant-count").text(numberWithCommas(participants));

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}