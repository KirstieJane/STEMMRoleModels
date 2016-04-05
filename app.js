// TODO - store the results of the query in a separate object
// Then iterate over it to give it some IDs etc..
// Then we can use those IDs to show the full versions in teh popup. Woop

// PROTOTYPE TODO - localstorage handling, so you dont have to get new data all the time if you dont want to
// TODO - should probably add the ID in the cleanupData method... not when it's displayed

var dataKeys = {
  "Timestamp" : "event-date",
  "Your Name" : "club-organizer",
  "Club Name" : "club-name",
  "Club Link" : "club-link",
  "City" : "event-city",
  "Country" : "club-country",
  "Event Location" : "event-location",
  "Attendance" : "event-attendance",
  "Event Description" : "event-description",
  "Event Creations" : "event-creations",
  "Web Literacy Skills" : "event-skills",
  "Links to Curriculum" : "event-links-curriculum",
  "Links to Photos (Optional)" : "event-links-photos",
  "Links to Blogpost (Optional)" : "event-links-blogpost",
  "Links to Video (Optional)" : "event-links-video",
  "Feedback from Attendees" : "event-feedback-attendees",
  "Your Feedback" : "event-feedback-organizer"
}

function cleanupData(){
  for(var i = 0; i < data.length; i++){
    var item = data[i];
    for(var k in item) {
      var itemData = JSON.stringify(item[k]);
      var newKey = dataKeys[k];
      delete item[k];
      item[newKey] = JSON.parse(itemData);
    }
  }
}

function filterEvents(term){

  var matchingIDs = [];

  for(var i = 0; i < data.length; i++){
    var item = data[i];

    for(var k in item){
      var value = item[k];
      if(typeof value ==  "string"){
        value = value.toLowerCase();
        if(value.indexOf(term) > -1){
          matchingIDs.push(item.id);
        }
      }
    }
  }


  $(".event-card").each(function(){
    $(this).hide();
    var thisId = parseInt($(this).data("id"));
    if(matchingIDs.indexOf(thisId) > -1) {
      $(this).show();
    }
  })


}

$(document).ready(function(){

  // if(!localStorage.getItem("data")) {
    $.get("https://sheetsu.com/apis/v1.0/ba3cacae").done(function(returnedData) {
      data = returnedData;
      cleanupData();
      localStorage.setItem("data",JSON.stringify(data));
      displayEvents();
    });
  // } else {
  //   data = JSON.parse(localStorage.getItem("data"));
  //   displayEvents();
  // }

  $("body").on("keyup",".filter-events",function(){
    var term = $(this).val();
    term = term.toLowerCase();
    filterEvents(term);

  });

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
  var popupEl = $(".event-popup-wrapper .event-popup");

  if($(".event-popup-wrapper").is(":visible")) {
    var currentId = parseInt($(".event-popup-wrapper").data("id"));

    popupEl.removeClass("shakeright").removeClass("shakeleft");
    popupEl.width(popupEl.width());

    if(direction == "next") {
      currentId++;
      if(currentId > Object.keys(data).length) {
        currentId = 1;
      }
      popupEl.addClass("shakeright");
    } else {
      currentId--;
      if(currentId < 1) {
        currentId = Object.keys(data).length;
      }
      popupEl.addClass("shakeleft");
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

      if(pop.find("." + j).length > 0){
        var value = item[j];
        if(j == "event-date"){
          value = formatDate(value);
        }
        if(j == "event-attendance"){
          value = numberWithCommas(value);
        }
        pop.find("." + j + " .value").text(value);
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
  var dayNum = date.getDay(); //Number of the day of the week
  var dayOfWeek = dayNames[dayNum];
  var dayOfMonth = date.getDate();
  var year = date.getFullYear();
  var monthNumber = date.getMonth();
  var monthName = monthNames[monthNumber];
  return monthName + " " + dayOfMonth + ", " + year;
}

function dateSort(a,b){
  var dateA = new Date(a["event-date"]);
  var dateB = new Date(b["event-date"]);
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



    for(var j in item){
      if(itemEl.find("." + j).length > 0){
        var value = item[j];

        if(j == "event-date"){
          value = formatDate(value);
        }
        if(j == "event-attendance"){
          participants = participants + parseInt(value);
        }
        if(j == "event-attendance"){
          value = numberWithCommas(value);
        }
        itemEl.find("." + j + " .value").text(value);
      }
    }

    itemEl.removeClass("template");
    $(".events").append(itemEl);
  }

  $(".participant-count").text(numberWithCommas(participants));

}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}