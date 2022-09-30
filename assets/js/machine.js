//declaire variables
const OWAPIKey = "f64ce8261e64b0aec0696a661e821205";
var city;
var lat;
var lon;
var events = [];
var eventSelected;
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
    for (i=0; i<9; i++){
        $("#img"+i).attr("src",events[i].performers[0].image);
        $("#title"+i).text(events[i].short_title);
        $("#venue"+i).text(events[i].venue.name);
        $("#subtitle"+i).text(moment.utc(events[i].datetime_local).format("ddd LT M/D"));
        //check for price available
        $("#price"+i).text("Average Price: Check Site");
        if(events[i].stats.average_price > 1){
            $("#price"+i).text("Average Price: $" + events[i].stats.average_price);
        } 
        //check for remaining seats
        if (events[i].stats.visible_listing_count > 1){
            $("#availability"+i).text("Seats Left: " + events[i].stats.visible_listing_count);}
        else if(events[i].stats.visible_listing_count == 1){
            $("#availability"+i).text(`Seats Left: Some seats may still be available. Click select event, then click "buy tickets" to see availability`)}
        else{$("#availability"+i).text("Seats Left: Sold Out or Starting Soon!!");}
    }
    $(".is-ancestor").show();
}

function selectEvent(data){
    eventSelected = events[data];
    console.log(eventSelected);
    showHero();
}

function showHero(){
    $("#hero-img").attr("src",eventSelected.performers[0].image);
    $("#hero-title").text(eventSelected.short_title);
    $("#hero-date").text(moment.utc(eventSelected.datetime_local).format("dddd LT M/D"));
    $("#hero-venue").text(eventSelected.venue.name);
    $("#hero-price").text("Average Price: Click Buy Tickets to check");
        if(eventSelected.stats.average_price > 1){
            $("#hero-price").text("Average Price: $" + eventSelected.stats.average_price);
        } 
    if (eventSelected.stats.visible_listing_count > 1){
        $("#hero-seats").text("Seats Left: " + eventSelected.stats.visible_listing_count);}
    else if(eventSelected.stats.visible_listing_count == 1){
        $("#hero-seats").text(`Seats Left: Some seats may still be available. Click select event, then click "buy tickets" to see availability`)}
    else{$("#hero-seats").text("Seats Left: Sold Out or Starting Soon!!");}
    $(".hero").show();
}

function init(){
    $(".hero").hide();
    $(".main").hide();
 }
//declare functions


//declare listeners
$("#city-btn").click(function(event){
    event.preventDefault();
    city=$("#city-search").val();
    $(".modal").removeClass("is-active");
    $(".main").show();
    $("#prev-viewed").append("<li data=" + city + ">" + city + "</li>")
    convert();
});
//declare listeners

//run
init();
//run