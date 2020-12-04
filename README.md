# Rocket-Launch-Tracker
Team project to make a web-based application that provides easy access to rocket launches relevant information such as launch schedule, locations, weather conditions, travel methods, and passed launches, so users can have a better understanding of rocket launches. 

 ## Veiw and use application: http://people.tamu.edu/~ryanmparker/rocket-launch-tracker/

### About the application
Launch Tracker is a tool to find upcoming rocket launches all over the world and the news associated with those launches. Along with upcoming launches you an search for historical missions simply by entering a date range.

#### Searching for Launches
The form at the top of the page allows you to select between finding upcoming launches or historical launches. If you are searching for historical launches then enter the two dates you wish to search between in the input boxes. Then with either selection select the number of launches you would like to display(max number is 100) using the input box labelled as such. If you wish to search for launch by/from a specific country select the checkbox and a country from the dropdown menu. Once you have your search parameters set hit the search button to find launches.

#### Using the Map
On the map you will see several markers with a number on them. The markers location corresponds to the location that launch is launching from and the number is its postition on the returned list of results. If more than one launch is occuring at a location the marker will display the first number to appear there and then a + to indicate there are more launches. If you hover over the marker a tooltip will apear that details what launches are occuring from this location.

#### Reading the Information
Each launch returned will display the following information if it is available: the mission name, a description of the mission, where it is launching from(pad and launch site), who is providing the launch service, what type of rocket it is launching on, the time it is launching in your local timezone, a countdown to launch, a picture associated with the launch, and an embeded webcast. This webcast will automatically start playing if the cast is live and the launch has not already passed.

## Documentation:
- `Project_Proposal.pdf`: report of the initial proposal and design of the application
- `Final_Report.pdf`: report of on our final product
- `source code`: directory that has all the front-end and back-end code for the Rocket Launch Tracker website

