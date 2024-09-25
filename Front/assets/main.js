
// Initialisation des années, mois et de la date
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let currDay = date.getDay();
let currTime = date.getTime();

// Wrappers et containers
const wrapperDays = document.querySelector(".calendar-dates");
const currentMonthAndDate = document.querySelector(".current-month-year");
let prenexIcons = document.querySelectorAll(".calendar-navigation span");
const backendHours = "http://localhost:1234";
const containerCalendrierHours = document.querySelector('.hours-container');
const wrapperCalendrierJours = document.querySelector('.calendar-container');
containerCalendrierHours.innerHTML = "";

// Tableau des mois
const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Fonction pour formater la date en YYYY-MM-DD sans le décalage de fuseau horaire
function formatDate(date) {
  let day = String(date.getDate()).padStart(2, "0"); // Ajouter zéro pour les jours < 10
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Mois de 0 à 11 donc +1
  let year = date.getFullYear();
  return `${year}-${month}-${day}`; // Format YYYY-MM-DD
}

// Fonction pour générer le calendrier
const generateCalendar = () => {
  let firstDayOfTheMonth = new Date(year, month, 1).getDay();
  let lastDateOfTheMonth = new Date(year, month + 1, 0).getDate();
  let lastDayOfTheMonth = new Date(year, month, lastDateOfTheMonth).getDay();
  let lastDateOfPreviousMonth = new Date(year, month, 0).getDate();

  let calendar = "";

  // Jours du mois précédent (inactifs)
  for (let i = firstDayOfTheMonth; i > 0; i--) {
    let prevMonthDate = new Date(
      year,
      month - 1,
      lastDateOfPreviousMonth - i + 1
    );
    let formattedPrevMonthDate = formatDate(prevMonthDate); // Utiliser formatDate
    calendar += `<li class="inactive" data-date="${formattedPrevMonthDate}">${
      lastDateOfPreviousMonth - i + 1
    }</li>`;
  }

  // Jours du mois courant
  for (let i = 1; i <= lastDateOfTheMonth; i++) {
    let currentDate = new Date(year, month, i);
    let formattedCurrentDate = formatDate(currentDate); // Utiliser formatDate

    // On regarde si le jour d'aujourd'hui est actif
    let isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? "active"
        : "";
    calendar += `<li class="${isToday}" data-date="${formattedCurrentDate}">${i}</li>`;
  }

  // Jours du mois suivant (inactifs)
  for (let i = lastDayOfTheMonth; i < 6; i++) {
    let nextMonthDate = new Date(year, month + 1, i - lastDayOfTheMonth + 1);
    let formattedNextMonthDate = formatDate(nextMonthDate); // Utiliser formatDate
    calendar += `<li class="inactive" data-date="${formattedNextMonthDate}">${
      i - lastDayOfTheMonth + 1
    }</li>`;
  }

  // Mise à jour du mois et de la date sélectionnée
  currentMonthAndDate.innerText = `${months[month]} ${year}`;
  wrapperDays.innerHTML = calendar;

  // Réattacher les événements de clic après avoir généré le calendrier
  attachClickEventToDays();
};

// Fonction pour attacher l'événement click sur chaque jour
const attachClickEventToDays = () => {
  let daysCalendar = document.querySelectorAll(".calendar-dates li");
  daysCalendar.forEach((day) => {
    day.addEventListener("click", (event) => {
      let selectedDate = event.target.getAttribute("data-date");
      console.log("Date sélectionnée:", selectedDate);
      generateHoursOfWeek(selectedDate);
    });
  });
};

// Fonction pour gérer l'affichage d'heures (ou autre contenu lié à la date sélectionnée)
function generateHoursOfWeek(date) {
  containerCalendrierHours.classList.toggle('activate-hours');
  wrapperCalendrierJours.classList.toggle('activate-days');
  const splitDate = date.split('-');
  const dateFormatSlash = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
  containerCalendrierHours.innerHTML += `${dateFormatSlash}`;
  getSpecificHours(date);
}

// Initialiser le calendrier
generateCalendar();

// Navigation entre les mois
prenexIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // Vérifier si l'icône est "calendar-prev" ou "calendar-next"
    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

    // Vérifier si le mois est hors des limites (moins de 0 ou plus de 11)
    if (month < 0 || month > 11) {
      // Réinitialiser la date avec le nouveau mois et l'année correspondante
      date = new Date(year, month, new Date().getDate());

      // Mettre à jour l'année et le mois
      year = date.getFullYear();
      month = date.getMonth();
    } else {
      // Réinitialiser à la date courante
      date = new Date();
    }

    // Regénérer le calendrier et réattacher les événements de clic
    generateCalendar();
  });
});

function getSpecificHours(date) {
fetch(backendHours + "/bookings/" + date, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}).then((res) => {
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des données');
    }
    return res.json();
}).then((datas) => {
  let startHour = new Date();
startHour.setHours(9, 0, 0, 0);  // 09:00:00

const hoursWrapper = document.createElement('div');
hoursWrapper.classList.add('hours-wrapper');
containerCalendrierHours.appendChild(hoursWrapper);

for (let n = 0; n < 18; n++) {  // 18 itérations pour 9h00 à 17h30
  let hours = startHour.getHours().toString().padStart(2, '0');
  let minutes = startHour.getMinutes().toString().padStart(2, '0');
  let seconds = "00";  // On garde les secondes à 00

  // Format HH:mm:ss
  let formattedTime = `${hours}:${minutes}:${seconds}`;
  //console.log(formattedTime);
  let classHour = "btn_enabled"
  datas.forEach(data => {
    if(data.hour === formattedTime) {
      classHour = "btn_disabled"
    }
  })
  let formattedTimeToShow = `${hours}:${minutes}`;
  //containerCalendrierHours.innerHTML += `<button class="btn_reservation ${classHour}">${formattedTimeToShow}</button>`
  hoursWrapper.innerHTML += `<button class="btn_reservation ${classHour}" 
  data-date="${date}" 
  data-hour="${formattedTime}"
  data-formatted="${formattedTime}"
  data-formatted-to-show="${formattedTimeToShow}">
  ${formattedTimeToShow}
</button>`
    // Incrémente l'heure de 30 minutes
    startHour.setMinutes(startHour.getMinutes() + 30);
}
document.querySelectorAll('.btn_reservation').forEach(button => {
  button.addEventListener('click', function() {
    const selectedDate = this.getAttribute('data-date');
    const selectedHour = this.getAttribute('data-hour');
    const formattedTime = this.getAttribute('data-formatted');
    const formattedTimeToshow = this.getAttribute('data-formatted-to-show');
    
    // Ouvrir la modal et afficher les informations
    openModal(selectedDate, selectedHour, formattedTime, formattedTimeToshow);
  });
});
}).catch(err => {
    console.log(err);
})
}

function openModal(date, hour, formattedTime, formattedTimeToShow) {
  // Ici, vous pouvez ajouter du code pour manipuler la modal, afficher les informations
  const modal = document.querySelector('.modal-reservation');  // Supposons que vous ayez une div .modal pour la modal
  modal.style.display = "block";  // Afficher la modal

  const splitDate = date.split('-');
  const dateFormatSlash = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`

  // Ajouter les informations dans la modal
  modal.querySelector('.modal-body-reservation').innerHTML = `
    <p>Réservation pour le ${dateFormatSlash} à ${formattedTimeToShow}</p><br>
    <form action="" method="POST" class="form_reservation">
      <input type="hidden" name="hour" value="${formattedTime}">
      <input type="hidden" name="date" value="${date}">
      <div>
        <label for="name">Votre nom :</label>
        <input type="text" name="name" id="name">
      </div>
      <div>
        <label for="email">Votre email :</label>
        <input type="email" name="email" id="email">
      </div>
      <button type="submit" name="sendIntoCalendar">Confirmer la réservation</button>
    </form>
    <p>Cliquez sur confirmer pour finaliser la réservation.</p>
  `;
}

// Fermer la modal lorsque l'utilisateur clique en dehors de celle-ci ou sur un bouton de fermeture
document.querySelector('.modal-close-reservation').addEventListener('click', function() {
  document.querySelector('.modal-reservation').style.display = "none";
});



