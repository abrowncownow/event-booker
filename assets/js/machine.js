//setting time and date
$("#top-date").text(moment().format("MMM Do YYYY"));
$("#top-time").text(moment().format("LT"));

//reloading time and date every second
setInterval(function () {
    $("#top-date").text(moment().format("MMM Do YYYY"));
    $("#top-time").text(moment().format("LT"));
}, 1000);

//declare variables
const OWAPIKey = "f64ce8261e64b0aec0696a661e821205";
var city;
var lat;
var lon;
var events = [];
var eventSelected;
var rooms;
var roomLocation;
var checkin;
var checkout;
var prevViewed = [];
var storedPrev = [];
//declare variables

//scripting for mobile menu
const bergerIcon = document.querySelector("#burger");
const navBarMenu = document.querySelector("#navbarBasicExample");
bergerIcon.addEventListener("click", () => {
    navBarMenu.classList.toggle("is-active");
});

//declare functions
function convert() {
    var geocodeURL =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        ",usa&appid=" +
        OWAPIKey;
    fetch(geocodeURL)
        .then((response) => response.json())
        .then((data) => {
            geocode = data[0];
            lat = geocode.lat;
            lon = geocode.lon;
            console.log(lat);
            console.log(lon);
            getEvents();
        })
        .catch((error) =>
            alert("Enter a valid City, State" + "\nError: " + error)
        );
}

function getEvents() {
    var sgURL =
        "https://api.seatgeek.com/2/events?per_page=25&lat=" +
        lat +
        "&lon=" +
        lon +
        "&client_id=Mjc4Nzg3fDE2NjM5MDUwMDUuOTI1ODIzNQ";

    fetch(sgURL)
        .then((response) => response.json())
        .then((data) => {
            events = data.events;
            console.log(events);
            displayEvents();
        })
        .catch((error) => alert(error));
}

function getroomLocation() {
    var address = eventSelected.venue.address;
    var displayLoc = eventSelected.venue.display_location;
    var airBNBURL =
        "https://airbnb19.p.rapidapi.com/api/v1/searchDestination?query=" +
        address +
        displayLoc;
    const getLocationOptions = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "2368c73193msh6744a705232e88ap13e1bfjsndb3ae68e75b2",
            "X-RapidAPI-Host": "airbnb19.p.rapidapi.com",
        },
    };

    fetch(airBNBURL, getLocationOptions)
        .then((response) => response.json())
        .then((response) => {
            roomLocation = response.data[0];
            console.log(roomLocation);
            function delay(time) {
                return new Promise((resolve) => setTimeout(resolve, time));
            }
            delay(1000).then(() => getRooms());
        })
        .catch((err) => console.error(err));
}

function getRooms() {
    checkin = moment.utc(eventSelected.datetime_local).format("YYYY-MM-DD");
    checkout = moment
        .utc(eventSelected.datetime_local)
        .add(1, "d")
        .format("YYYY-MM-DD");

    const getRoomOptions = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "2368c73193msh6744a705232e88ap13e1bfjsndb3ae68e75b2",
            "X-RapidAPI-Host": "airbnb19.p.rapidapi.com",
        },
    };
    var roomsURL =
        "https://airbnb19.p.rapidapi.com/api/v1/searchPropertyByPlace?id=" +
        roomLocation.id +
        "&display_name=" +
        roomLocation.display_name +
        "&totalRecords=25&currency=USD&adults=1&checkin=" +
        checkin +
        "&checkout=" +
        checkout;

    fetch(roomsURL, getRoomOptions)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            rooms = response.data;
            console.log(rooms);
            displayRooms();
        })
        .catch((err) => console.error(err));
}

function displayRooms() {
    for (i = 0; i < 24; i++) {
        $("#img" + i).attr("src", rooms[i].images[0]);
        $("#title" + i).text(rooms[i].listingName);
        $("#venue" + i).text("Star Rating: " + rooms[i].avgRating);
        $("#subtitle" + i).text(rooms[i].roomType);
        $("#price" + i).text("Price: " + rooms[i].accessibilityLabel);
        $("#availability" + i).text("");
        $("#" + i).text("Book Room");
        $("#" + i).attr("onclick", "bookRoom(" + i + ")");
    }
}
function bookRoom(i) {
    window.location.href =
        "https://www.airbnb.com/rooms/plus/" +
        rooms[i].id +
        "?adults=1&check_in=" +
        checkin +
        "&check_out=" +
        checkout;
}

function displayEvents() {
    for (i = 0; i < 24; i++) {
        $("#img" + i).attr("src", events[i].performers[0].image);
        $("#title" + i).text(events[i].short_title);
        $("#venue" + i).text(events[i].venue.name);
        $("#subtitle" + i).text(
            moment.utc(events[i].datetime_local).format("ddd LT M/D")
        );
        //check for price available
        $("#price" + i).text("Average Price: Check Site");
        if (events[i].stats.average_price > 1) {
            $("#price" + i).text(
                "Average Price: $" + events[i].stats.average_price
            );
        }
        //check for remaining seats
        if (events[i].stats.visible_listing_count > 1) {
            $("#availability" + i).text(
                "Seats Left: " + events[i].stats.visible_listing_count
            );
        } else if (events[i].stats.visible_listing_count == 1) {
            $("#availability" + i).text(
                `Seats Left: Some seats may still be available. Click select event, then click "buy tickets" to see availability`
            );
        } else {
            $("#availability" + i).text(
                "Seats Left: Sold Out or Starting Soon!!"
            );
        }
        $("#" + i).text("Select Event");
    }
    $(".is-ancestor").show();
}

function selectEvent(data) {
    eventSelected = events[data];
    console.log(eventSelected);
    showHero();
    window.location.hash = "hero-section";
}

function getTickets() {
    console.log(eventSelected);
    if (eventSelected.stats.visible_listing_count > 1) {location.href = eventSelected.url;}
    else{location.href = eventSelected.venue.url;}
}

function showHero() {
    $("#hero-img").attr("src", eventSelected.performers[0].image);
    $("#hero-title").text(eventSelected.short_title);
    $("#hero-date").text(
        moment.utc(eventSelected.datetime_local).format("dddd LT M/D")
    );
    $("#hero-venue").text(eventSelected.venue.name);
    $("#hero-price").text("Average Price: Click Buy Tickets to check");
    if (eventSelected.stats.average_price > 1) {
        $("#hero-price").text(
            "Average Price: $" + eventSelected.stats.average_price
        );
    }
    if (eventSelected.stats.visible_listing_count > 1) {
        $("#hero-seats").text(
            "Seats Left: " + eventSelected.stats.visible_listing_count
        );
    } else if (eventSelected.stats.visible_listing_count == 1) {
        $("#hero-seats").text(
            `Seats Left: Some seats may still be available. Click select event, then click "buy tickets" to see availability`
        );
    } else {
        $("#hero-seats").text("Seats Left: Sold Out or Starting Soon!!");
    }
    $(".hero").show();

    getroomLocation();
}
function showModal() {
    $(".hero").hide();
    $(".main").hide();
    $(".modal").addClass("is-active");
}
function changeEvent() {
    $(".hero").hide();
    displayEvents();
}
function init() {
    storedPrev = JSON.parse(localStorage.getItem("prevViewed"));
    if (storedPrev){
        prevViewed = storedPrev;
        for (i=0; i<storedPrev.length;i++){
            $("#prev-viewed").append(
                `<li class="navbar-item" data="` + storedPrev[i] + `">` + storedPrev[i] + `</li>`
            );
        }
    }
    $(".hero").hide();
    $(".main").hide();
}

function setEvent(){
    $(".modal").removeClass("is-active");
    $(".main").show();
    $("#prev-viewed").append(
        `<li class="navbar-item" data="` + city + `">` + city + `</li>`
    );
   prevViewed.push(city);
   localStorage.setItem("prevViewed",JSON.stringify(prevViewed));
   convert();
}
//declare functions

//declare listeners
$("#city-btn").click(function (event) {
    event.preventDefault();
    city = $("#city-search").val();
    setEvent();

});
$("#changeEvent").click(function (event) {
    event.preventDefault();
    changeEvent();
});

$("#venue-buy-tickets").click(function () {
    getTickets();
});

$("#prev-viewed").on("click", ".navbar-item", function(event){
    city=$(this).text();
    console.log(city);
    setEvent();

});
//declare listeners

//run
init();

//run
