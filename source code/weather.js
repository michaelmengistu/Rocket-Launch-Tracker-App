var city = "Houston";

$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&uniyd=imperial&APPID=11d8bb8df8f974f1a8818af4e34759fd", function(data){
	console.log(data);

	var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
	var weather = data.weather[0].main;
	var temp = ((Math.floor(data.main.temp) - 273.15) * 9/5 + 32).toPrecision(2);

	$('.icon').attr('src', icon);
	$('.weather').append(weather);
	$('.temp').append(temp);
	$('.temp').append('°F');

});