const apiURL = 'https://randomuser.me/api/?results=12&nat=us&exc=gender,login,registered,phone,nat,id';
const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');
const gallery = document.querySelector('#gallery');
let employees;

// FETCH 12 RANDOM USERS
const getUsers = async () => {
  await fetch(apiURL)
    .then(response => response.json())
    .then(data => employees = data.results)
    .catch((err) => console.log(err));
  displayEmployees(employees);
};

// INITIALIZE ON PAGE LOAD
getUsers();

// APPEND SEARCH BAR
const searchBarHtml = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;

searchContainer.insertAdjacentHTML('afterbegin', searchBarHtml);

// DISPLAY EMPLOYEE CARDS
const displayEmployees = (array) => {
  gallery.innerHTML = '';
  array.forEach((employee, index) => {
    const fullName = `${employee.name.first} ${employee.name.last}`;
    const html = `
      <div class="card" data-index="${index}">
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.large}" alt="photo of ${fullName}">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${fullName}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        </div>
      </div>
    `;
    gallery.insertAdjacentHTML('beforeend', html);
  });
};

// CLEAN DOB
const cleanDOB = (dateStr) => {
  const month = dateStr.substring(5, 7);
  const day = dateStr.substring(8, 10);
  const year = dateStr.substring(0, 4);
  const dob = `${month}/${day}/${year}`;
  return dob;
}; 

// CREATE MODAL
const displayModal = (index) => {
  const employee = employees[index];
  const fullName = `${employee.name.first} ${employee.name.last}`;
  const dob = cleanDOB(employee.dob.date);
  const html = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
          <img class="modal-img" src="${employee.picture.large}" alt="Photo of ${fullName}">
          <h3 id="name" class="modal-name cap">${fullName}</h3>
          <p class="modal-text">${employee.email}</p>
          <p class="modal-text cap">${employee.location.city}</p>
          <hr>
          <p class="modal-text">${employee.cell}</p>
          <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
          <p class="modal-text">Birthday: ${dob}</p>
        </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>
  `;
  body.insertAdjacentHTML('beforeend', html);

  // LISTEN ON OPEN MODAL
  const modal = document.querySelector('.modal-container');
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close-btn') || e.target.tagName === 'STRONG') {
      body.removeChild(body.lastElementChild);
    } else if (e.target.classList.contains('modal-prev')) {
      modalSwitch(index, 'prev');
    } else if (e.target.classList.contains('modal-next')) {
      modalSwitch(index, 'next');
    };
  });
};

// SWITCH MODALS
const modalSwitch = (index, direction) => {
  body.removeChild(body.lastElementChild);
  if (direction === 'prev') {
    if (index === 0) {
      index = employees.length - 1;
    } else {
      index--;
    };
  } else {
    if (index === employees.length - 1) {
      index = 0;
    } else {
      index++;
    };
  };
  displayModal(index);
};

// LISTEN TO OPEN MODALS
gallery.addEventListener('click', (e) => {
  if (e.target.closest('.card')) {
    const card = e.target.closest('.card');
    const index = card.getAttribute(['data-index']);
    displayModal(index);
  };
});

// LISTEN TO SEARCH
const searchBar = document.querySelector('#search-input');
searchBar.addEventListener('keyup', () => {
  const input = searchBar.value.toLowerCase();
  let filteredEmployees = [];
  employees.forEach(employee => {
    const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`;
    if (fullName.includes(input)) {
      filteredEmployees.push(employee);
    };
  });
  if (input === '') {
    displayEmployees(employees);
  };
  if (input && filteredEmployees.length > 0) {
    displayEmployees(filteredEmployees);
  } else if (input && filteredEmployees.length <= 0) {
    gallery.innerHTML = `<h2>No Results Found`;
  }
});