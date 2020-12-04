let map, infoWindow;
var markers = [];

// initializes and creates the map 
function initMap() {

  // map options
  var options = {
    zoom: 4.2,
    center: { lat: 39.8283, lng: -98.5795 },
    minZoom: 2
  }

  //new map
  map = new google.maps.Map(document.getElementById('map'), options);

  //creates a button inside map to get user loction
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    locationButton
  );

  //pans to user's geolocation when locationButton is clicked.  
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) { 
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


  google.maps.event.addListener(markers, 'click', (function () {
    calcRoute();
    infowindow.open(map, markers);
}));

}
//shows description
function showText(id, desc){
  document.getElementById(id).innerHTML = desc;
}
//handles user loction errors
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

var usaIDs = [28,29,143,149,25,31,11,12,21,27];
var rusIDs = [146,6,30,18,5];
var chnIDs = [148,16,8,19,17];
var jpnIDs = [24,26,32];
var itaIDs = [151];
var nzlIDs = [10];
var gufIDs = [13];
var fraIDs = [147];
var mhlIDs = [142];
var irnIDs = [2,145];
var ausIDs = [152];
var prkIDs = [153,7];
var korIDs = [9];
var kazIDs = [15];
var indIDs = [14];
var braIDs = [150];
var isrIDs = [4];
var unkIDs = [20,22,3];

var countryLocations = [usaIDs, rusIDs, chnIDs, jpnIDs, itaIDs, nzlIDs, gufIDs, fraIDs, mhlIDs, irnIDs, ausIDs, prkIDs, korIDs, kazIDs, indIDs, braIDs, isrIDs, unkIDs];



function getAPICall() {
  const app = document.getElementById('launch');

  var labelNum = 1;

  $('#col1').empty(); //Remove previously displayed launches
  $('#col2').empty(); //Remove previously displayed launches
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];

  const container = document.createElement('div');
  container.setAttribute('class', 'container');
  container.setAttribute('id', 'launchcontainer')

  app.appendChild(container);
  var request = new XMLHttpRequest();

  var numLaunches = document.getElementById('numLaunchesToDisplay').value;

  var startDate = document.getElementById('beginDate').value;
  var endDate = document.getElementById('endDate').value;
  if(startDate > endDate) {
    var temp = startDate;
    startDate = endDate;
    endDate = temp;
  }
  console.log(startDate, endDate);
  
  var radios = document.getElementsByName('launchWindow');

 var requestString = 'https://lldev.thespacedevs.com/2.1.0/launch/';

  for(var i = 0, length = radios.length; i < length; i++) {
    if(radios[i].checked) {
      if(radios[i].value == 'Upcoming') {
        //request.open('GET', 'https://launchlibrary.net/1.4/launch/next/' + numLaunches, true);
        console.log("Requesting upcoming launches");
        requestString += 'upcoming/?mode=detailed&limit=' + numLaunches;
        //request.open('GET', 'https://lldev.thespacedevs.com/2.1.0/launch/upcoming/?&hide_recent_previous=true&location__ids=' + chnIDs.join(',') + '&limit=' + numLaunches, true);
      }
      else {
        console.log("Requesting historical launches launches");
        requestString += '?mode=detailed&net__gte=' + startDate + 'T00:00:00Z&net__lte=' + endDate + 'T00:00:00Z&limit=' + numLaunches;
      }
    }
  }

  if(document.getElementById('searchCountry').checked) {
    //console.log(document.getElementById('countryDropdown').value);
    //console.log(countryLocations[document.getElementById('countryDropdown').value]);
    requestString += '&location__ids=' + countryLocations[document.getElementById('countryDropdown').value].join(',');
  }

  console.log(requestString);
  //make request
  request.open('GET', requestString, true);

  request.onload = function getLaunchInfo () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    
    console.log(request.status)
    if (request.status >= 200 && request.status < 400) {
      if(data.count == 0) {
        const bigcard = document.createElement('div');
        bigcard.setAttribute('class', 'card');
        container.appendChild(bigcard);

        const noResult = document.createElement('h1');
        noResult.setAttribute('class', 'card');
        noResult.textContent = "Could not find any launches";
        bigcard.appendChild(noResult);

        const searchAgain = document.createElement('p');
        searchAgain.setAttribute('class','card');
        searchAgain.textContent = "Please try different search paramaters.";
        bigcard.appendChild(searchAgain);
      }
      console.log(data.results);

      //put launch results on page on separate cards
      data = data.results;
      var datalength = data.length;
      var count = 0;
      data.forEach(launch => {

        var missionName = "";
        if(launch.mission == undefined || launch.mission.name == undefined) {
          missionName= launch.name.split('|')[1];
        }
        else {
          missionName = launch.mission.name;
        }
        var missionDesc = "None";
        if(launch.mission != undefined && launch.mission.description != undefined) {
          missionDesc = "<b>Mission Description:</b> " + launch.mission.description;  
        }
        var provider = "";
        if(launch.launch_service_provider.name == undefined) {
          provider = "Launch provider unknown";
        }
        else {
          provider = launch.launch_service_provider.name;
        }
        
        var launchPad = "";
        var launchSite = "";
        if(launch.pad == undefined) {
          launchPad = "Launch pad unknown";
          launchSite = "Launch site unknown";
        }
        else {
          launchSite = launch.pad.location.name;
          
            launchPad = launch.pad.name;
            var latitude = parseFloat(launch.pad.latitude);
            var longitude = parseFloat(launch.pad.longitude);

            var notMarked = true;

            markers.forEach(mark => {
                //console.log(mark.getPosition().lat());
                //console.log({lat: latitude, lng: longitude});
                if(mark.getPosition().lat() == latitude && mark.getPosition().lng() == longitude) {
                    notMarked = false;
                    if(mark.getLabel().indexOf('+') < 0) {
                        mark.setLabel(mark.getLabel() + "+");
                    }
                    mark.setTitle(mark.getTitle() + "\n" + labelNum.toString() + missionName);
                    return;
                }
            })

            if(notMarked) {
                var marker = new google.maps.Marker({
                  position: {lat: latitude, lng: longitude},
                  title: labelNum.toString() + " " + missionName,
                  label: labelNum.toString(),
                  map: map
                  //icon: 'rocket_maker.png'
                })
                markers.push(marker);
            //console.log(latitude, longitude);
            }
        }
        labelNum++;

        var rocketType = "";
        if(launch.rocket.configuration.full_name == undefined) {
          launch.rocket = launch.name.split("|")[0];
          rocketType = launch.rocket;
        }
        else {
          rocketType = launch.rocket.configuration.full_name;
        }

        
        var countdown = "";
        var windowOpen = "";
        if(launch.net == undefined) {
          launch.net = "Launch time unknown";
        }
        else {
          var d = new Date(launch.net);
          windowOpen = d.toLocaleDateString() + " " + d.toLocaleTimeString();
        }
        
        var launchImage = launch.image;

        

        //Need to add a countdown
        //Need to connect weather
            
        var cardLocation = "#col1";
        if(count%2 == 1){
          cardLocation = "#col2";
        }

        //countdown.setAttribute('class','countdown');
        //countdown.setAttribute('id','countdown' + launch.id);

        function showText(){
          document.getElementById("desc" + launch.id).innerHTML = missionDesc;
        }
          //creates card for each news source and appends to body
          $("<div class=\"card border-secondary mb-3\">"
          + "<img class=\"card-img-top\" src=\"" + launchImage + "\"alt=\"Article Image\">"
          + "<div class=\"card-body\">"
          + "<h5 class=\"card-title\"><b>Mission(" + (labelNum - 1) + "): </b>" + missionName + "</h5>"
          + "<p class=\"card-text\"><b>Launch Provider: </b>" + provider + "</p>"
          + "<p class=\"card-text\"><b>Rocket Type: </b>" + rocketType + "</p>"
          + "<p class=\"card-text\"><b>Launch Time: </b>" + windowOpen + "</p>"
          + "<p class=\"card-text\"><b>Launch Site: </b>" + launchSite + "</p>"
          + "<div class=\"row border rounded\" style=\"background-color:#ABA4BA\" id=\"weatherDiv" + launch.id + "\"></div>"
          + "<p class=\"card-text\"><b>Launch Pad: </b>" + launchPad + "</p>"
          //+  "<p class=\"card-text\">" + missionDesc + "</p>"
          //+  "<a href=\"" +  + "\" class=\"btn\">Go To Article</a>"
          + "<button class=\"btn\" id=\"btn" + launch.id + "\">Description▼</button>"
          + "<p class=\"card-text\" id=\"desc" + launch.id + "\">" + missionDesc + "</p>"
          + "<div style=\"card-text\" id=\"webcastDiv" + launch.id +"\"></div>"
          + "</div><div class=\"card-footer\" id=\"countdown" + launch.id + "\"></div>" 
          + "</div>").appendTo(cardLocation);

          //toggle description showing and hiding
          if(missionDesc == "None"){
            $("#btn" + launch.id).hide();
           // $("#desc" + launch.id).innerHTML = "<b>Description: </b>None";
          }
          $("#desc" + launch.id).hide();
          $(document).ready(function(){
            $("#btn" + launch.id).click(function(){
              $("#desc" + launch.id).toggle("fast");
            });
          });
        //add countdown clock
          if(launch.net == undefined) {
            launch.net = "Launch time unknown";
          }
          else {
              var d = new Date(launch.net);
              windowOpen = d.toLocaleDateString() + " " + d.toLocaleTimeString();
  
              var x = setInterval(function() {
  
                // Get today's date and time
                var now = new Date().getTime();
  
                // Find the distance between now and the count down date
                var distance = d - now;
  
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
                // Display the result in the element with id="demo"
                countdown = "Launch in " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
                document.getElementById("countdown" + launch.id).innerHTML = countdown;
                // If the count down is finished, write some text
                if (distance < 0) {
                  clearInterval(x);
                  //countdown = launch.status.name;
                  document.getElementById("countdown" + launch.id).innerHTML = launch.status.name;
                }
              }, 1000);
          }

          //Gets video URLs and embeds the at the bottom of the card
        var vidURl = "";
        if(launch.vidURLs != undefined && Object.keys(launch.vidURLs).length != 0) {
          var urlFound = false;
          launch.vidURLs.forEach(url => {
            //console.log(url.priority);
            if(url.url.includes('watch?v=') && !urlFound) {
              //console.log("Added url with priority " + url.priority);
              urlFound = true;
              if(launch.webcast_live && launch.net >= Date.now()) {
                //webcastEmbed.setAttribute('src', launch.vidURLs[0].url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1')
                $("<div class=\"embed-responsive embed-responsive-16by9\">" 
                   + "<iframe class=\"embed-responsive-item\" src=\"" + url.url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1' + "\" allowfullscreen=\"allowfullscreen\">"
                   + "</div>").appendTo("#webcastDiv" + launch.id);
              }
              else {
                $("<div class=\"embed-responsive embed-responsive-16by9\" style=\"margin-top:2%\">" 
                  + "<iframe class=\"embed-responsive-item\" src=\"" + url.url.replace('watch?v=', 'embed/') + "\" allowfullscreen=\"allowfullscreen\">"
                  + "</div>").appendTo("#webcastDiv" + launch.id);
              }
            }
          })

          if(urlFound == false) {
            $("<a class=\"card-link\" target=\"_blank\" href=\"" + launch.vidURLs[0].url + "\"><b>Launch Video</b></a>").appendTo("#webcastDiv" + launch.id);
          }
        }

        // Add weather info
        if(latitude != undefined && longitude != undefined) {
          $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&APPID=11d8bb8df8f974f1a8818af4e34759fd", function(data){
            console.log(data);

            var icon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
            var weather = data.weather[0].main;
            //var temp = ((Math.floor(data.main.temp) - 273.15) * 9/5 + 32).toPrecision(2);
            var temp = data.main.temp.toPrecision(2);
            var tempC = ((temp-32)*(5/9)).toPrecision(2);

            $("<div class=\"col col-sm-4 text-center my-auto\" id=\"icon" + launch.id + "\">"
              + "<img class=\"center-block\" src=\"" + icon + "\">"
              + "</div>"
              + "<div class=\"col col-sm-4 my-auto\" id=\"weatherType" + launch.id + "\">"
              + "<p class=\"card-text text-center align-middle\">" + weather + "</p>"
              + "</div>"
              + "<div class=\"col col-sm-4 my-auto\" id=\"temp" + launch.id + "\">"
              + "<p class=\"card-text text-center align-middle\">" + temp + "°F / " + tempC + "°C</p>"
              + "</div>").appendTo("#weatherDiv" + launch.id);
          });

          
        }

        count++;
      });
    } else {
      const errorMessage = document.createElement('marquee');
      errorMessage.textContent = `Too many requests sent`;
      app.appendChild(errorMessage);
    }

  }
  console.log("Sending request");
  request.send();
}

