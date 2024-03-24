'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const currentDate = new Date();
const month = currentDate.toLocaleString('ja-JP', { month: 'long' });
const day = currentDate.getDate();
console.log(month);

class Location {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  marker(latitude, longitude) {
    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(
        L.popup({
          className: `${inputType.value}-popup`,
          autoClose: false,
          closeOnClick: false,
        }).setContent(
          `${
            inputType.value.at(0).toUpperCase() + inputType.value.slice(1)
          } on ${month}`
        )
      )
      .openPopup();
  }
}

class workout {
  constructor(distance, duration, type) {
    this.distance = distance;
    this.duration = duration;
    this.type = type;
  }
}

class Running extends workout {
  constructor(distance, duration, type, cadence) {
    super(distance, duration, type);
    this.cadence = cadence;
  }

  html(distance, duration, cadence) {
    return `<li class="workout workout--${inputType.value}" data-id="1234567890">
      <h2 class="workout__title">Running on ${month} ${day}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${distance.value}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${duration.value}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${cadence.value}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">178</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`;
  }
}

navigator.geolocation.getCurrentPosition(
  function (position) {
    const latitude = position.coords.latitude;
    const { longitude } = position.coords; // Destructurer
    console.log(position);
    console.log(latitude);
    console.log(longitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const map = L.map('map').setView([35.3119291, 139.5429104], 13);

    const googleStreets = L.tileLayer(
      'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ).addTo(map);

    const popup = L.popup();
    let lat, lng;
    let num = 0;

    function onMapClick(e) {
      // Creat varible de lat et long
      const { lat, lng } = e.latlng;
      console.log(lat, lng);

      // Création d'un objet au clic sur la map
      const user = new Location(lat, lng);
      // Convertir l'objet en JSON
      const locationJSon = JSON.stringify(user);
      // Enregistrement dans le localStorage
      localStorage.setItem('location' + num, locationJSon);
      num++;

      // Display formulaire et vide les inputs
      inputCadence.value = '';
      inputDuration.value = '';
      inputDistance.value = '';
      form.classList.remove('hidden');
      map.off('click');

      // Check if input are enter
      const handleKeyDown = function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();

          if (
            !isNaN(+inputDuration.value) &&
            !isNaN(+inputDistance.value) &&
            !isNaN(+inputCadence.value) &&
            inputDuration.value !== '' &&
            inputDistance.value !== '' &&
            inputCadence.value !== ''
          ) {
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(
                L.popup({
                  className: `${inputType.value}-popup`,
                  autoClose: false,
                  closeOnClick: false,
                }).setContent(
                  `${
                    inputType.value.at(0).toUpperCase() +
                    inputType.value.slice(1)
                  } on ${month}`
                )
              )
              .openPopup();

            form.classList.add('hidden');
            map.on('click', onMapClick);
            const runner = new Running(
              inputDistance.value,
              inputDuration.value,
              inputCadence.value,
              inputType.value
            );
            console.log(runner);

            const html = `<li class="workout workout--${
              inputType.value
            }" data-id="1234567890">
              <h2 class="workout__title">${
                inputType.value.at(0).toUpperCase() + inputType.value.slice(1)
              } on ${month} ${day}</h2>
              <div class="workout__details">
                <span class="workout__icon">${
                  inputType.value === 'running' ? '🏃‍♂️' : '🚴‍♀️'
                }</span>
                <span class="workout__value">${inputDistance.value}</span>
                <span class="workout__unit">km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${inputDuration.value}</span>
                <span class="workout__unit">min</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${inputCadence.value}</span>
                <span class="workout__unit">min/km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">${
                  inputType.value === 'running' ? '🦶🏼' : '⛰'
                }</span>
                <span class="workout__value">178</span>
                <span class="workout__unit">${
                  inputType.value === 'running' ? 'spm' : 'm'
                }</span>
              </div>
            </li>`;

            document
              .querySelector('.workouts')
              .insertAdjacentHTML('afterbegin', html);
            map.on('click');

            window.removeEventListener('keydown', handleKeyDown);
          } else {
            alert('Tu es con');
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
    }

    map.on('click', onMapClick);
  },
  function () {
    console.log('LOL');
  }
);
