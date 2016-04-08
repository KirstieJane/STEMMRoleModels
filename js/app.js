// Mozilla Clubs Events v1.0

var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var rawData;
var data = []; // THIS STORES IT ALLLLLLLLL muahawhwhwhwhwahaha ALL OF IT.

var dataKeys = {
  "Status" : "report-status",
  "Timestamp" : "event-timestamp",
  "Date of Event" : "event-date",
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
  "Links to Curriculum (Optional)" : "event-links-curriculum",
  "Links to Photos (Optional)" : "event-links-photos",
  "Links to Blogpost (Optional)" : "event-links-blogpost",
  "Links to Video (Optional)" : "event-links-video",
  "Feedback from Attendees" : "event-feedback-attendees",
  "Your Feedback" : "event-feedback-organizer"
}

var touchEnabled = false;

$(document).ready(function(){

  if('ontouchstart' in document.documentElement){
    touchEnabled = true;
  }

  var myElement = $(".event-popup")[0];
  var hammertime = new Hammer(myElement, {});
  if(touchEnabled){
    hammertime.on('swipe', function(ev) {
      var delta = ev.deltaX;
      if(Math.abs(delta) > 100) {
        if(delta > 0) {
          navigatePopup("next");
        } else {
          navigatePopup("previous");
        }
      }
    });
  }

  var eventId = parseInt(getUrlParameter("event"));

  // For development, I'm just keeping the data in localstorage once it's loaded...

  // if(!localStorage.getItem("data")) {
    $.get("https://sheetsu.com/apis/v1.0/ba3cacae").done(function(returnedData) {
      rawData = returnedData;
      cleanupData();
      localStorage.setItem("data",JSON.stringify(data));
      displayEvents();
      if(eventId){
        showPop(eventId);
      }
    }).fail(function(e){
      console.log(e);
    });
  // } else {
  //   data = JSON.parse(localStorage.getItem("data"));
  //   displayEvents();
  //   if(eventId){
  //     showPop(eventId);
  //   }
  // }

  // Search & Filter stuff

  $(".filter-events").val();
  $("body").on("click",".filter-events-wrapper .clear-search",function(){
    $(".filter-events").val("");
    $(".clear-search").hide();
    filterEvents("");
  });

  $("body").on("keyup",".filter-events",function(e){
    var term = $(this).val();
    term = term.toLowerCase();
    if(term.length == 0){
      $(".clear-search").hide();
    } else {
      $(".clear-search").show();
    }
    if(e.keyCode == 13){
      $(this).blur();
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

    var visibleIDs = [];

    for(var k in data){
      var item = data[k];
      if(item.visible) {
        visibleIDs.push(item.id);
      }
    }

    var currentIndex = visibleIDs.indexOf(currentId);

    if(direction == "next") {
      currentIndex++;
      if(currentIndex >= visibleIDs.length) {
        currentIndex = 0;
      }
      popupEl.addClass("shakeright");
    } else {
      currentIndex--;
      if(currentIndex < 0) {
        currentIndex = visibleIDs.length - 1;
      }
      popupEl.addClass("shakeleft");
    }
    currentId = visibleIDs[currentIndex];

    showPop(currentId);
  }
}

// Displays a larger popup when an event card is clicked
// Also changes the browser history, so you can share a link...

function showPop(id){

  var found = false;

  var pop = $(".event-popup-wrapper");

  pop.find(".event-popup").scrollTop("0");

  for(var k in data){

    var item = data[k];
    pop.data("id",id);

    if(item.id == id) {

      found = true;
      pop.show();

      history.replaceState({}, "Mozilla Clubs Event Report " + item.id, "?event=" + item.id);

      pop.find(".not-specified").removeClass("not-specified");

      for(var j in item){
        if(pop.find("." + j).length > 0){
          var value = item[j];

          if(j == "event-date"){
            if(value == ""){
              value = item["event-timestamp"];
            }
            value = formatDate(value);
          }

          if(j == "event-attendance"){
            value = numberWithCommas(value);
          }

          if(value.length == 0){
            value = "Not filled in";
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

  if(!found) {
    hidePop();
  }

}

function hidePop(){
  var clean_uri = location.protocol + "//" + location.host + location.pathname;
  window.history.replaceState({}, document.title, clean_uri);
  $(".event-popup-wrapper").hide();
}

// Formats the date from a Date objects to a string like April 2, 2016

function formatDate(dateString) {
  var date = new Date(dateString);
  if(date == "Invalid Date") {
    return "Date Unknown";
  }
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
          if(value == ""){
            value = item["event-timestamp"];
          }
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

  //Should just junk out the stuff that's not approved....?

  for(var i = 0; i < rawData.length; i++){
    var item = rawData[i];
    if(item["Status"] == "Approved"){
      var newItem = {};
      for(var k in item) {
        // var itemData = JSON.stringify(item[k]);
        var newKey = dataKeys[k];
        newItem[newKey] = item[k];
      }
      newItem.id = i + 2;
      newItem.visible = true; //visible by default - this is important for the Popup
      data.push(newItem);
    }
  }
  data = data.sort(dateSort);
}

// Hides elements on the page whose details don't contain
// any matches from the provided search term.

function filterEvents(term){

  var matchingIDs = [];

  for(var i = 0; i < data.length; i++){
    var item = data[i];
    item.visible = false;
    for(var k in item){
      var value = item[k];
      if(typeof value ==  "string"){
        value = value.toLowerCase();
        if(value.indexOf(term) > -1){
          matchingIDs.push(item.id);
          item.visible = true;
          break;
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