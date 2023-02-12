/*
La API es https://open-meteo.com/en/docs

Primero debemos hacer una petición para extraer la latitud, longitud y zona horaria de la ciudad que queremos buscar

var city = ...
var CITY_API_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

Con esa información, haremos una segunda petición que nos devolverá la predicción

var lat = ...
var lon = ...
var timezone = ...
var WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max`;
*/



function infoCiudad() {
    console.log("--- obteniendo informacion de la ciudad");

    var city = '';
    city = document.getElementById("inputCiudad").value;
    var CITY_API_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    fetch(CITY_API_URL)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log("aqui estan los datos" + data);
            imprimirCiudad(data);
        })
        .catch(function(error) {
            console.log(error);
            mostrarError();
        });

    document.getElementById("inputCiudad").value = null

}

function imprimirCiudad(ciudad){

    var ciudadNombre = ciudad.results[0].name;
    var ciudadPais = ciudad.results[0].country;
    var ciudadLatitud = ciudad.results[0].latitude;
    var ciudadLongitud = ciudad.results[0].longitude;
    var ciudadZona = ciudad.results[0].timezone;
    
    var WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${ciudadLatitud}&longitude=${ciudadLongitud}&timezone=${ciudadZona}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max`;

    console.log(ciudadNombre);
    console.log(ciudadLatitud);
    console.log(ciudadLongitud);
    console.log(ciudadZona);

    fetch(WEATHER_API_URL)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log("Datos de tiempo obtenidos");
            mostrarTiempo(data);
        })
        .catch(function(error) {
            console.log(error);
        });

        document.getElementById("infoCiudad1").style.display = "flex";
        document.getElementById("infoCiudad2").style.display = "flex";
        document.getElementById("resultados").style.display = "flex";
        document.getElementById("mensajeError").style.display = "none";

        document.getElementById("cajaCiudadNombre").innerHTML = ciudadNombre;
        document.getElementById("cajaCiudadPais").innerHTML = ciudadPais;

}

function mostrarTiempo(tiempo){
    console.log(tiempo.daily.time[0])

    var dia = '';
    var codigoClima = '';
    var tempMin = 0.0;
    var tempMax = 0.0;
    var lluvia = 0.0;
    var viento = 0.0;

    var iconoNubes = '<img class="iconoTiempo" src="images/clouds.png"/>';
    var iconoLluvia = '<img class="iconoTiempo" src="images/rain.png"/>';
    var iconoNieve = '<img class="iconoTiempo" src="images/snow.png"/>';
    var iconoSol = '<img class="iconoTiempo" src="images/sun.png"/>';
    var iconoTormenta = '<img class="iconoTiempo" src="images/thunderstorm.png"/>';

    var HTML = ''
    var iconoUsar = '';

    for (let index = 0; index < tiempo.daily.time.length; index++) {
        dia = tiempo.daily.time[index];
        codigoClima = tiempo.daily.weathercode[index];
        tempMin = tiempo.daily.temperature_2m_min[index];
        tempMax = tiempo.daily.temperature_2m_max[index];
        lluvia = tiempo.daily.rain_sum[index];
        viento = tiempo.daily.windspeed_10m_max[index];

        if (codigoClima > 90){
            iconoUsar = iconoTormenta;
        } else if (codigoClima > 80){
            iconoUsar = iconoLluvia;
        } else if (codigoClima > 70){
            iconoUsar = iconoNieve;
        }else if (codigoClima > 60){
            iconoUsar = iconoLluvia;
        }else if (codigoClima > 50){
            iconoUsar = iconoLluvia;
        }else if (codigoClima > 1){
            iconoUsar = iconoNubes;
        }else if (codigoClima = 0){
            iconoUsar = iconoSol;
        }

        console.log(dia);
        console.log(codigoClima);
        console.log(tempMin);
        console.log(tempMax);
        console.log(lluvia);
        console.log(viento);



        HTML += `
            <div class="cajaResultados">
                <div class="fecha">${dia}</div>
                <div class="icono">${iconoUsar}</div>
                <div class="temperatura">
                    <div class="temperaturaMin">${tempMin}</div>
                    <span>/</span>
                    <div class="temperaturaMax">${tempMax}</div>
                </div>
                <div class="lluvia">Lluvia: ${lluvia}mm</div>
                <div class="viento">Viento: ${viento}km/h</div>
            </div>
        `
    }

    document.getElementById("resultados").innerHTML = HTML;

    var HTML = ''
}

function mostrarError(){

    document.getElementById("infoCiudad1").style.display = "none";
    document.getElementById("infoCiudad2").style.display = "none";
    document.getElementById("resultados").style.display = "none";

    document.getElementById("mensajeError").style.display = "block";
}
