// Your Google Drive Spreadsheet URL
var sheetID = "147nwbdx3D4kGywszzghfODm8SoOisASisjr9sU39Dr8";
var sheetURL = "https://spreadsheets.google.com/feeds/cells/"+sheetID+"/od6/public/values?alt=json";

// Name of column and what element classname to insert the data into.
var dataKeys = {
  "Status" : "report-status", // Must be set to 'Approved'
  "Timestamp" : "event-timestamp",
  "Joined On" : "joined-date", // Shown in main listing
  "Your Name" : "club-organizer",
  "Your Twitter Handle (Optional)" : "club-contact-details",
  "Speaker Name" : "speaker-name", // Shown in main listing
  "Speake Email" : "speaker-email",
  "City" : "speaker-city",
  "Country" : "speaker-country", // Shown in main listing
  "Event Location" : "event-location",
  "Number of Lectures" : "n-lectures", // Shown in main listing
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
