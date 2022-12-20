const apiURL = 'https://randomuser.me/api/?results=12&nat=us&exc=gender,login,registered,phone,nat';
const gallery = document.querySelector('#gallery');
let employees;

// FETCH 12 RANDOM USERS
const getUsers = async () => {
  await fetch(apiURL)
    .then(response => response.json())
    .then(data => employees = data.results)
    .catch((err) => console.log(err));
  console.log(employees); // ERASE WHEN DONE! ~~~~~~~~~~~~~~~~~~~~~~
  displayEmployees();
};

// INITIALIZE ON PAGE LOAD
getUsers();

// DISPLAY EMPLOYEE CARDS
const displayEmployees = () => {
  employees.forEach(employee => {
    const fullName = `${employee.name.first} ${employee.name.last}`;
    let html = `
      <div class="card">
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
