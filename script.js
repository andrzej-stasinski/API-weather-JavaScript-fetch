function getResultEmpty() {
	var result = document.querySelector('#result');
	var html = `
        <h3><p>Pogoda dla:  </p><em>Brak takiego miasta</em></h3>
           `;
    result.innerHTML = html;
}

function getResult(dane) {
	
	var {city, lat, lon, date, temp, wind, sunrise, sunset, pressure} = dane;
    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
    const sunsetTime  = new Date(sunset * 1000).toLocaleTimeString();
    
    // temp - temperatura - color
    // temp = 0;    
    const kolor = temp > 0 ? 'kolor1' : 'kolor2';

	var result = document.querySelector('#result');
	var html = `
        <h3><p>Pogoda dla:  </p><em>${city}</em></h3>
        <h4><p>Koordynaty:  </p><em>${lat}, ${lon}</em></h4>         
        <h4><p>Data:        </p><em>${date}</em></h4>        
        <h4><p>Temperatura: </p><em class=${kolor}>${temp} &#176;C</em></h4>
        <h4><p>Wiatr:       </p><em>${wind} m/s</em></h4>            
        <h4><p>Wschód:      </p><em>${sunriseTime}</em></h4>        
        <h4><p>Zachód:      </p><em>${sunsetTime}</em></h4>
        <h4><p>Ciśnienie:   </p><em>${pressure} hPa</em></h4>        
        `;
    result.innerHTML = html;
}


function ajax(miasto) {

	// Klucz do API
	const APIkey = 'your API key';
	const API = `https://api.openweathermap.org/data/2.5/weather?q=${miasto}&APPID=${APIkey}&units=metric`;

	if(APIkey === 'your API key') {
		document.getElementById('result').innerText = 'before using it, you need to enter API key in the file - script.js, info in README';
		return;
	}

	fetch(API)
	.then(res => {
			return res.json();
		}, err => {
			throw Error('Nie pobrano...')
		})
	.then(data => {
		if(data.cod == 404) {
			// nie znaleziono miasta
			console.log('Brak miasta');
			getResultEmpty();
		} else if(data.cod == 400) {
			// brak podanego miasta do geocode
			// console.log('Brak miasta - pusty INPUT');
			var result = document.querySelector('#result');
			result.innerHTML = "";
		}
		else {
			// znaleziono miasto
			// console.log('Jest takie miasto');
			var dataJSON = {};

			// dataJSON z danymi pogodowymi z data - JSON
			var time = new Date().toLocaleString();
			dataJSON.date     = time;
	        dataJSON.sunrise  = data.sys.sunrise;
	        dataJSON.sunset   = data.sys.sunset;
	        dataJSON.temp     = data.main.temp;
	        dataJSON.pressure = data.main.pressure;
	        dataJSON.wind     = data.wind.speed;
	        dataJSON.lon      = data.coord.lon;
	        dataJSON.lat      = data.coord.lat;
	        dataJSON.city     = miasto[0].toUpperCase() + miasto.substring(1);               // Kraków 
	        dataJSON.city     = miasto[0].toUpperCase() + miasto.toLowerCase().substring(1); // Kraków nawet gdy wpiszemy KRAKÓW

			getResult(dataJSON);			
		}

	})
	.catch(err => {
		console.error(err);
	});

}

function init() {
	var input = document.getElementById('input');
	input.onkeyup = function() {
		var miasto = input.value;
		ajax(miasto);
	}
}

window.onload = init;		