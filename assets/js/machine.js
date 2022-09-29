//declaire variables
const OWAPIKey = "f64ce8261e64b0aec0696a661e821205"
var city = window.prompt("Input City, State");
var lat;
var lon;
var events = [];
//declare variables


//declare functions
function convert(){
    var geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",usa&appid=" + OWAPIKey;
    fetch(geocodeURL)
        .then((response)=>response.json())
        .then((data)=>{
            geocode=data[0];
            lat = geocode.lat;
            lon = geocode.lon;
            console.log(lat);
            console.log(lon);
            getEvents();
        })
        .catch((error)=>alert("Enter a valid City, State" + "\nError: " + error));
}

function getEvents(){
    var sgURL = "https://api.seatgeek.com/2/events?per_page=25&lat=" + lat + "&lon=" + lon + "&client_id=Mjc4Nzg3fDE2NjM5MDUwMDUuOTI1ODIzNQ";

    fetch(sgURL)
        .then((response)=>response.json())
        .then((data)=>{
            events=data.events;
            console.log(events);
            displayEvents();
        })
        .catch((error)=>alert(error));
}

function displayEvents(){
    for (i=0; i<3; i++){
        $("#img"+i).attr("src",events[i].performers[0].image);
        $("#title"+i).text(events[i].short_title);
        $("#subtitle"+i).text(events[i].datetime_local);
        $("#price"+i).text("Average Price: $" + events[i].stats.average_price);
        //check for remaining seats
        if (events[i].stats.visible_listing_count > 1){
            $("#availability"+i).text("Seats Left: " + events[i].stats.visible_listing_count);}
        else if(events[i].stats.visible_listing_count == 1){
            $("#availability"+i).text(`Seats Left: Some seats may still be available. Click select event, then click "buy tickets" to see availability`)}
        else{$("#availability"+i).text("Seats Left: Sold Out!!!");}
    }

}

function init(){
    $(".hero").hide();
//     $(".is-ancestor").hide();
 }
//declare functions


//run
init();
convert();