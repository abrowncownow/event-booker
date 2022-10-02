
//setting time and date
$('#top-date').text(moment().format("MMM Do YYYY"))
$('#top-time').text(moment().format('LT'))

//reloading time and date every second
setInterval(function( ){
$('#top-date').text(moment().format("MMM Do YYYY"))
$('#top-time').text(moment().format('LT'))
}, 1000)
 


  

