//declaire variables
const OWAPIKey = "f64ce8261e64b0aec0696a661e821205";
var city;
var lat;
var lon;
var events = [];
var eventSelected;
var rooms;
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

function getHotels(){
    lat = eventSelected.venue.location.lat;
    lon = eventSelected.venue.location.lon;
    var checkin = "2022-09-30" //moment.utc(events[i].datetime_local).format("YYYY-MM-DD");
    var checkout = "2022-10-01";//moment.utc(events[i].datetime_local).add(1, 'days');
    console.log(checkin);
    console.log(checkout);
     var hotelURL = "https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby?latitude=" + lat + "&currency=USD&longitude=" + lon + "&checkout_date=" + checkout + "&sort_order=DISTANCE_FROM_LANDMARK" +  "&checkin_date=" + checkin + "&page_number=2&adults_number=1&locale=en_US";
    // var hotelURL = "https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby?latitude=" + lat + "&currency=USD&longitude=" + lon + "&checkout_date=2022-10-30"+ "&sort_order=DISTANCE_FROM_LANDMARK" +  "&checkin_date=2022-10-29"+"&page_number=2&adults_number=1&locale=en_US";
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2368c73193msh6744a705232e88ap13e1bfjsndb3ae68e75b2',
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
        }
    };
    
    fetch(hotelURL, options)
        .then(response => response.json())
        .then((response) =>{ 
            rooms = response.searchResults;
            console.log(rooms)})
        .catch(err => console.error(err));
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

    getHotels()
}
function showModal(){
    init();
    $(".modal").addClass("is-active");
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

function testBooking(){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2368c73193msh6744a705232e88ap13e1bfjsndb3ae68e75b2',
            'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
        }
    };
    
    fetch('https://apidojo-booking-v1.p.rapidapi.com/filters/list?room_qty=1&departure_date=2022-09-30&dest_ids=null&guest_qty=1&arrival_date=2022-09-29&search_type=latlong&languagecode=en-us&longitude=-122.688&price_filter_currencycode=USD&latitude=45.5264', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}
//declare listeners

//run
init();
testBooking();
//run