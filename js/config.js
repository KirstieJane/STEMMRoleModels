// Your Sheetsu URL
var sheetsuURL = "https://sheetsu.com/apis/v1.0/ba3cacae";

// Column Names
//
// Create an entry here for each Colum Name you have in your spreadsheet.
// Give it an alternate name, which will connect it to the markup.
//
// For example..
//
// "Time of Event" : "time-of-event" will look for the following markup:
// <span class="time-of-event"><span class="value"></span></span>
// ...and place the value into the .value span.

var dataKeys = {
  "Status" : "report-status",
  "Timestamp" : "event-timestamp",
  "Date of Event" : "event-date",
  "Your Name" : "club-organizer",
  "Your Twitter Handle (Optional)" : "club-contact-details",
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
