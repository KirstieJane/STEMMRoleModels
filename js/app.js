// Mozilla Clubs Events v1.0

var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var rawData;
var data = []; // THIS STORES IT ALLLLLLLLL muahawhwhwhwhwahaha ALL OF IT.

var touchEnabled = false;

$(document).ready(function(){

  if('ontouchstart' in document.documentElement){
    touchEnabled = true;
  }

  if(touchEnabled){
    var myElement = $(".event-popup")[0];
    var hammertime = new Hammer(myElement, {});
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

  $.get(sheetURL).done(function(returnedData) {

    rawData = parseDriveData(returnedData);

    cleanupData();

    localStorage.setItem("data",JSON.stringify(data));

    if(data.length == 0) {
      $(".no-events").show();
    }

    displayEvents();
    if(eventId){
      showPop(eventId);
    }

  }).fail(function(e){
    $(".error-connecting").show();
    $(".throbber").hide();
  });



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

  $("body").on("click",".event-popup .speaker-photo img",function(e){
    $(".event-popup-wrapper .large-photo").show();
    e.stopPropagation();
  });

  $("body").on("click",".event-popup-wrapper .large-photo",function(e){
    $(".event-popup-wrapper .large-photo").hide();
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

  $("body").on("click",".event-popup-wrapper .expand a",function(e){
    $(this).closest(".speaker-description").removeClass("long");
    return false;
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


function hideLargePhoto(){
  $(".large-photo").hide();
}

// Navigates the event report details popup to either the next
// or previous event chronologically

function navigatePopup(direction) {
  var popupEl = $(".event-popup-wrapper .event-popup");

  hideLargePhoto();

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

      pop.find(".value").addClass("not-specified").text("Not filled in");
      pop.find(".value").parent().addClass("not-specified");
      pop.find(".speaker-photo").hide();

      for(var j in item){
        if(pop.find("." + j).length > 0){
          var value = item[j];

          if(j == "joined-date"){
            if(value == ""){
              value = item["event-timestamp"];
            }
            value = formatDate(value);
          }

          if(j == "speaker-photo") {
            if(value) {
              pop.find(".speaker-photo").show();
              pop.find(".speaker-photo img").attr("src",value);
              pop.find(".large-photo .photo").css("background-image","url(" + value + ")");
            }
          }

          if(j == "n-lectures"){
            value = numberWithCommas(value);
          }

          if(j == "rec-twitter"){
            if(value.length > 0) {
              value = value.replace("@","");
              value = "https://twitter.com/" + value;
            }
          }

          if(value.length > 0){
            pop.find("." + j + " .value").removeClass("not-specified").parent().removeClass("not-specified");
          }

          var valueEl = pop.find("." + j + " .value");
          valueEl.html("");

          var words = value.split(" ");

          for(i = 0; i < words.length; i++) {
            var word = words[i];

            var lastChar = word.charAt(word.length-1);

            var regexp = /,|\./
            var specialChar = false;
            if(regexp.test(lastChar)){
              word = word.slice(0,-1);
              specialChar = true;
            }

            if(validURL(word)) {
              append = "<a href='"+word+"'>" + word + "</a>";
            } else {
              append = word;
            }
            if(specialChar) {
              append = append + lastChar;
            }

            valueEl.html(valueEl.html() + append + " ");
          }
          if(j == "speaker-description"){
            var descriptionHeight = valueEl.parent().height();
            if(descriptionHeight > 150) {
              valueEl.parent().addClass("long");
            } else {
              valueEl.parent().removeClass("long");
            }
          }
        }
      }
    }
  }

  //This will loop through and make the headings fainter that don't have anything on em......

  pop.find("[heading]").each(function(){
    $(this).removeClass("not-specified");
    var heading = $(this).attr("heading");
    var total = pop.find("[heading="+heading+"]").length;
    var unfilled = pop.find("[heading="+heading+"] .not-specified").length;
    if(total == unfilled) {
      pop.find("[id="+heading+"]").addClass("not-specified");
    } else {
      pop.find("[id="+heading+"]").removeClass("not-specified");
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
  hideLargePhoto();
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
  var dateA = new Date(a["joined-date"]);
  var dateB = new Date(b["joined-date"]);
  if(dateA > dateB) {
    return -1;
  } else {
    return 1;
  }
}

// Counts & updates the number of...
// * Countries
// * Events
// * Participants
// ...for all visible events.

function updateCounts(){

  var participants = 0;
  var eventCount = 0;
  var countries = [];

  for(var k in data){
    var item = data[k];
    if(item.visible) {
      var attendance = parseInt(item["n-lectures"]);
      if(!isNaN(attendance)){
        participants = participants + attendance;
      }
      var country = item["speaker-country"];
      if(country != "" && countries.indexOf(country) < 0) {
        countries.push(country);
      }
      eventCount++;
    }
  }

  $(".country-count").text(numberWithCommas(countries.length));
  $(".participant-count").text(numberWithCommas(participants));
  $(".event-count").text(eventCount);
}

// For each event report that is loaded, this adds a little event card to the page
// with some of the event data

function displayEvents(){

  $(".throbber").addClass("goodbye");
  $(".month").show();


  var participants = 0;

  for(var k in data){
    var itemEl = $(".event-card.template").clone();

    //Do the item
    var item = data[k];
    itemEl.data("id",item.id);
    populateElement(itemEl, item);
    itemEl.removeClass("template");
    $(".events").append(itemEl);




    var hasMedia = false;
    var mediaTypes = ["event-creations","speaker-links-prof","speaker-links-code","speaker-links-social"];

    for(var i = 0; i < mediaTypes.length; i++) {
      var mediaType = mediaTypes[i];
      var link = item[mediaType];
      if(link && validURL(link)){
        hasMedia = true;
      }
    }

    if(hasMedia){
      itemEl.find(".media-indicator").addClass("has-media").attr("title","This report has links!");
    } else {
      itemEl.find(".media-indicator").attr("title","This report has no links!");
    }
    // Count total attendance
    for(var j in item){
      var value = item[j];

      if(j == "speaker-photo") {
        if(value) {
          itemEl.find(".top").removeClass("no-photo");
          itemEl.find(".top").css("background-image","url("+value+")");
        }
      }

      if(j == "n-lectures"){
        if(!isNaN(parseInt(value))){
          participants = participants + parseInt(value);
        }
      }
    }
    // $(".participant-count").text(numberWithCommas(participants));
  }

  updateCounts();
}

// Returns numbers with commas, so 1000000 becomes 1,000,000

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// * Replaces the original keys in each item's object with the ones above
// * Adds a row number to each item to match what's in the spreadsheet
// * Sorts the items according to the date (most recent first);
// * If the Event Date is missing (it shouldn't) it uses the form's submitted timestamp
// * Only uses data with "Approved" in the status column

function cleanupData(){
  for(var i = 0; i < rawData.length; i++){
    var item = rawData[i];
    if(item["Status"] == "Approved"){
      var newItem = {};
      for(var k in item) {
        var newKey = dataKeys[k];
        newItem[newKey] = item[k];
      }

      if(newItem["joined-date"] == "") {
        newItem["joined-date"] = newItem["event-timestamp"];
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

  term = term.trim();

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

  updateCounts();
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
  var regexp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  return regexp.test(str);
}

// Populates the element "el" with data from the item Object

function populateElement(el, item){
  for(var j in item){
    if(el.find("." + j).length > 0){
      var value = item[j];
      if(j == "joined-date"){
        if(value == ""){
          value = item["event-timestamp"];
        }
        value = formatDate(value);
      }
      if(j == "n-lectures"){
        value = numberWithCommas(value);
      }
      if(value.length == 0){
        value = "Unknown";
      }
      el.find("." + j + " .value").text(value);
    }
  }
}

// Formats JSON data returned from Google Spreadsheet and formats it into
// an array with a series of objects with key value pairs like "column-name":"value"

function parseDriveData(driveData){
  var headings = {};
  var newData = {};
  var finalData = [];
  var entries = driveData.feed.entry;

  for(var i = 0; i < entries.length; i++){
    var entry = entries[i];
    var row = parseInt(entry.gs$cell.row);
    var col = parseInt(entry.gs$cell.col);
    var value = entry.content.$t;

    if(row == 1) {
      headings[col] = value;
    }

    if(row > 1) {
      if(!newData[row]) {
        newData[row] = {};
      }
      newData[row][headings[col]] = value;
    }
  }

  for(var k in newData){
    finalData.push(newData[k]);
  }

  return finalData;
}
