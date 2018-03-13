const yargs = require('yargs')
const axios = require('axios')
const argv = yargs.options({
  a:{
    demand : true,
    alias:'address',
    describe:'Address to fetch weather for ',
    string: true
  }}).help().alias('help','h').argv;
var encodedAddres = encodeURIComponent(argv.address)
var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodedAddres+'&key=AIzaSyCYYeo4bSrgy-8MI4yRUi2ykFz2yhpJo0M'
axios.get(geocodeUrl).then((response)=>{
  if(response.data.status === 'ZERO_RESULTS'){
    throw new Error('Unable to find that address')
  }
  var lat = response.data.results[0].geometry.location.lat
  var lng = response.data.results[0].geometry.location.lng
  var weatherUrl = 'https://api.forecast.io/forecast/6eab6a3975df9a8f23887ba84baa95d1/'+lat+','+lng
  console.log('Address :',response.data.results[0].formatted_address)
  return axios.get(weatherUrl)
}).then((response)=>{
  var temperature = response.data.currently.temperature
  var apparentTemperature = response.data.currently.apparentTemperature
  console.log("It's currently "+temperature+". It feels like "+apparentTemperature)
}).catch((e)=>{
  if(e.response != null && e.response.status ===404){
    console.log('Unable to connect API server')
  }else {
    console.log(e.message)
  }
})
