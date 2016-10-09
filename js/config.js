// Your Google Drive Spreadsheet URL
var sheetID = "1x5k30BR1z8nVY8iUqvZa-YiZMVtRbvs71FcWjFDiL28";
var sheetURL = "https://spreadsheets.google.com/feeds/cells/"+sheetID+"/od6/public/values?alt=json";

// Name of column and what element classname to insert the data into.
var dataKeys = {
  "Status" : "approval", // Must be set to 'Approved'
  "Joined On" : "joined-date", // Shown in main listing
  "Recommended By" : "rec-name",
  "Your Twitter Handle (Optional)" : "rec-twitter",
  "Speaker Name" : "speaker-name", // Shown in main listing
  "Speaker Email" : "speaker-email", // DELETE
  "City" : "city",
  "State" : "state",
  "Country" : "country", // Shown in main listing
  "Event Location" : "event-location",
  "Number of Lectures" : "n-lectures", // Shown in main listing
  "Cover Photo" : "speaker-photo",
  "Subspecialty" : "event-creations",
  "Specialty" : "speaker-specialty",
  "Links to Previous Talks (Optional)" : "speaker-links-lectures",
  "Links to Professional Pages (Optional)" : "speaker-links-prof",
  "Links to Data/Code (Optional)" : "speaker-links-code",
  "Links to Social Media (Optional)" : "speaker-links-social",
  "role_models" : 'role_models',
  "Feedback from Attendees" : "attendee-feedback",
  "Your Recommendation" : "rec-feedback"
}
