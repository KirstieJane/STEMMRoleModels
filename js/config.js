// Your Google Drive Spreadsheet URL
var sheetID = "1QHl2bjBhMslyFzR5XXPzMLdzzx7oeSKTbgR5PM8qp64";
var sheetURL = "https://spreadsheets.google.com/feeds/cells/"+sheetID+"/ohaibtm/public/values?alt=json";

// Name of column and what element classname to insert the data into.
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
  "Event Cover Photo" : "event-photo",
  "Event Creations" : "event-creations",
  "Web Literacy Skills" : "event-skills",
  "Links to Curriculum (Optional)" : "event-links-curriculum",
  "Links to Photos (Optional)" : "event-links-photos",
  "Links to Blogpost (Optional)" : "event-links-blogpost",
  "Links to Video (Optional)" : "event-links-video",
  "Feedback from Attendees" : "event-feedback-attendees",
  "Your Feedback" : "event-feedback-organizer"
}
