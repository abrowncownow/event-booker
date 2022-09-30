
//setting time and date
$('#top-date').text(moment().format("MMM Do YYYY"))
$('#top-time').text(moment().format('LT'))

//reloading time and date every second
setInterval(function( ){
$('#top-date').text(moment().format("MMM Do YYYY"))
$('#top-time').text(moment().format('LT'))
}, 1000)
 




var data; 

function getRooms() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '56b5d84706msh7f79130b8941c56p1de34bjsnfb1d6ed41190',
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
        }
    };



var grURL = ('https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby?latitude=51.509865&currency=USD&longitude=-0.118092&checkout_date=2022-10-27&sort_order=DISTANCE_FROM_LANDMARK&checkin_date=2022-10-26&adults_number=1&locale=en_US', options)

   fetch(grURL)
    .then(response => response.json())
    .then(response => {
         data = response.searchResults.results
         console.log(data) 
         document.getElementById('getRooms')});
    
    //.catch(err => console.error(err));
    
 }
function showRooms(){
    for (i=0; i<9; i++){
        $("#img"+i)
        $("#title"+i)
        $("#price"+i)
    }

}
  

