// TODO - store the results of the query in a separate object
// Then iterate over it to give it some IDs etc..
// Then we can use those IDs to show the full versions in teh popup. Woop

// PROTOTYPE TODO - localstorage handling, so you dont have to get new data all the time if you dont want to

// TODO when you've filtered some results, and pop one up, you can still go side to sdie through ALL ofm, should just be the filtered ones.

var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var data;

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

$(document).ready(function(){

  var eventId = parseInt(getUrlParameter("event"));

  // if(!localStorage.getItem("data")) {
    $.get("https://sheetsu.com/apis/v1.0/ba3cacae").done(function(returnedData) {
      data = returnedData;
      cleanupData();
      localStorage.setItem("data",JSON.stringify(data));
      displayEvents();

      if(eventId){
        showPop(eventId);
      }
    });
  // } else {
  //   data = JSON.parse(localStorage.getItem("data"));
  //   displayEvents();
  // }

  // Search & Filter stuff

  $(".filter-events").val();
  $("body").on("click",".filter-events-wrapper .clear-search",function(){
    $(".filter-events").val("");
    $(".clear-search").hide();
    filterEvents("");
  });

  $("body").on("keyup",".filter-events",function(){
    var term = $(this).val();
    term = term.toLowerCase();
    if(term.length == 0){
      $(".clear-search").hide();
    } else {
      $(".clear-search").show();
    }
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

// Navigates the event report details popup to either the next
// or previous event chronologically

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

// Displays a larger popup when an event card is clicked
// Also changes the browser history, so you can share a link...

function showPop(id){
  var pop = $(".event-popup-wrapper");
  pop.show();

  for(var k in data){
    var item = data[k];
    pop.data("id",id);

    if(item.id == id) {

      history.replaceState({}, "Mozilla Clubs Event Report " + item.id, "?event=" + item.id);

      pop.find(".not-specified").removeClass("not-specified");

      for(var j in item){
        if(pop.find("." + j).length > 0){
          var value = item[j];

          if(j == "event-date"){
            value = formatDate(value);
          }

          if(j == "event-attendance"){
            value = numberWithCommas(value);
          }

          if(value.length == 0){
            value = "Not specified";
            pop.find("." + j + " .value").addClass("not-specified");
          }

          pop.find("." + j + " .value").html("");

          if(validURL(value)){
            pop.find("." + j + " .value").append("<a href="+value+">" + value + "</a>");
          } else {
            pop.find("." + j + " .value").text(value);
          }

        }
      }
    }
  }

  //This will loop through and make the headings fainter that don't have anything on em......
  pop.find("[heading]").each(function(){
    var heading = $(this).attr("heading");

    var total = pop.find("[heading="+heading+"]").length;
    var unfilled = pop.find("[heading="+heading+"] .not-specified").length;
    if(total == unfilled) {
      pop.find("[id="+heading+"]").addClass("not-specified");
    }

  });



}

function hidePop(){
  var clean_uri = location.protocol + "//" + location.host + location.pathname;
  window.history.replaceState({}, document.title, clean_uri);
  $(".event-popup-wrapper").hide();
}

// Formats the date from a Date objects to a string like April 2, 2016

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

// Sorts event report objects by date

function dateSort(a,b){
  var dateA = new Date(a["event-date"]);
  var dateB = new Date(b["event-date"]);
  if(dateA > dateB) {
    return -1;
  } else {
    return 1;
  }
}

// For each event report that is loaded, this adds a little event card to the page
// with some of the event data

function displayEvents(){

  $(".throbber").addClass("goodbye");
  $(".month").show();

  var eventCount = Object.keys(data).length;
  $(".event-count").text(eventCount);

  var participants = 0;

  for(var k in data){
    var itemEl = $(".event-card.template").clone();

    var item = data[k];

    itemEl.data("id",item.id);

    for(var j in item){
      if(itemEl.find("." + j).length > 0){
        var value = item[j];

        if(j == "event-date"){
          value = formatDate(value);
        }

        if(j == "event-attendance"){
          if(!isNaN(parseInt(value))){
            participants = participants + parseInt(value);
          }
        }

        if(j == "event-attendance"){
          value = numberWithCommas(value);
        }
        if(value.length == 0){
          value = "Unknown";
        }

        itemEl.find("." + j + " .value").text(value);
      }
    }

    itemEl.removeClass("template");
    $(".events").append(itemEl);
  }

  $(".participant-count").text(numberWithCommas(participants));
}

// Returns numbers with commas, so 1000000 becomes 1,000,000

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// * Replaces the original keys in each item's object with the ones above
// * Adds a row number to each item to match what's in the spreadsheet
// * Sorts the items according to the date (most recent first);

function cleanupData(){
  for(var i = 0; i < data.length; i++){
    var item = data[i];
    for(var k in item) {
      var itemData = JSON.stringify(item[k]);
      var newKey = dataKeys[k];
      delete item[k];
      item[newKey] = JSON.parse(itemData);
    }
    item.id = i + 2;
  }
  data = data.sort(dateSort);
}

// Hides elements on the page whose details don't contain
// any matches from the provided search term.

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
  });

  if($(".event-card:visible").length == 0){
    $(".no-results").show();
  } else {
    $(".no-results").hide();
  }

}


// Return parameters from the URL, so for example ?id=200 will return 200

function getUrlParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam)
    {
      return sParameterName[1];
    }
  }
}

// Checks if something is a valid URL

function validURL(str) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(str);
}