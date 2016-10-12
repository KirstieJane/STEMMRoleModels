// Your Google Drive Spreadsheet URL
//OLD var sheetID = "147nwbdx3D4kGywszzghfODm8SoOisASisjr9sU39Dr8";
// NEW
var sheetID = "1x5k30BR1z8nVY8iUqvZa-YiZMVtRbvs71FcWjFDiL28";
var sheetURL = "https://spreadsheets.google.com/feeds/cells/"+sheetID+"/od6/public/values?alt=json";

// Name of column and what element classname to insert the data into.
var dataKeys = {
  "approval" : "approval", // Must be set to 'Approved'
  "joined_on" : "joined-date", // Shown in main listing
  "recommended_by" : "rec-name",
  "recommender_twitter" : "rec-twitter",
  "title" : "rolemodel-title", // Shown in main listing
  "first_name" : "rolemodel-firstname", // Shown in main listing
  "last_name" : "rolemodel-lastname", // Shown in main listing
  "city" : "city",
  "state" : "state",
  "country" : "country", // Shown in main listing
  "Event Location" : "event-location",
  "Number of Lectures" : "n-lectures", // Shown in main listing
  "Cover Photo" : "speaker-photo",
  "research_area" : "research_area",
  "sub_specialities" : "subspecialities",
  "Links to Previous Talks (Optional)" : "speaker-links-lectures",
  "Links to Professional Pages (Optional)" : "speaker-links-prof",
  "Links to Data/Code (Optional)" : "speaker-links-code",
  "Links to Social Media (Optional)" : "speaker-links-social",
  "role_models" : 'role_models',
  "Feedback from Attendees" : "attendee-feedback",
  "Your Recommendation" : "rec-feedback"
}
