const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": "2368c73193msh6744a705232e88ap13e1bfjsndb3ae68e75b2",
        "X-RapidAPI-Host": "americanfootballapi.p.rapidapi.com",
    },
};

const matchesApi = `'https://americanfootballapi.p.rapidapi.com/api/american-football/matches/`;
var matchDate = "20/9/2022";
var fetchURL = "";
var fetchData = {};

fetch(
    "https://americanfootballapi.p.rapidapi.com/api/american-football/matches/20/9/2022",
    options
)
    .then((response) => response.json())
    .then(function (response) {
        fetchData = response.events;
        console.log(response.events);
        console.log(fetchData);
        console.log(fetchData[0].awayTeam.name);
        console.log(fetchData[0].homeTeam.name);
    })
    .catch((err) => console.error(err));
