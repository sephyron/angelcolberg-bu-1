/*
$.ajax({
  url: "https://api.appfigures.com/v1.1/reviews/474025452/",
  cache: false
}).done(function( html ) {
  $("#appfiguresapi-results").append(html);
});
*/

//var user = "angelcolberg";
//var wikipedia = "http://en.wikipedia.org/w/api.php?action=query&ucuser="
    			//+ user + "&list=usercontribs&ucdir=older&format=json";
var appfigures = "https://api.appfigures.com/v1.1/reviews/474025452/";
var itunes = "http://itunes.apple.com/rss/customerreviews/id=474025452/limit=300/json";
var itunesSearch = "http://itunes.apple.com/lookup?id=474025452";


$.ajax({
	type: 'GET',
	url: itunes,
	async: false,
	jsonpCallback: 'jsonCallback',
	contentType: "application/json",
	dataType: 'jsonp',
	success: function(data)
	{
		$('#appfiguresapi-results').html(JSON.stringify(data));
		console.log(json);
	},
	error: function(e)
	{
	   alert(e.message);
	}
});


