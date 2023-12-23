

async function performLogin() {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    if (response.ok) {
      const userInfo = await response.json();
      localStorage.setItem('user', JSON.stringify(userInfo));
      window.location.href = 'information.html';
    } else {
      displayErrorMessage('Неправильний логін або пароль. Спробуйте ще раз.');
    }
  } catch (error) {
    console.error('Помилка під час авторизації:', error);
    displayErrorMessage('Помилка під час авторизації. Спробуйте ще раз.');
  }
}


function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById('errorMessage');
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = 'red';
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const togglePasswordIcon = document.getElementById('togglePassword');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordIcon.textContent = '👁️';
  } else {
    passwordInput.type = 'password';
    togglePasswordIcon.textContent = '👁️';
  }
}

async function register() {
  if (!validateForm()) {
    return;
  }

  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const pib = document.getElementById('pib').value;
  const variant = document.getElementById('variant').value;
  const phone = document.getElementById('phone').value;
  const faculty = document.getElementById('faculty').value;
  const address = document.getElementById('address').value;
  const role = document.getElementById('role').value; 

  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password, pib, variant, phone, faculty, address, role }),
  });

  if (response.ok) {
    const userInfo = await response.json();
    localStorage.setItem('user', JSON.stringify(userInfo));
    window.location.href = 'information.html';
  } else {
    const errorData = await response.json();
    displayErrorMessage(errorData.message);
  }
}

function goToLogin() {
  window.location.href = 'login.html';
}

function handleResponse(response) {
  if (response.ok) {
    window.location.href = 'information.html';
  } else {
    displayErrorMessage('Помилка реєстрації');
  }
}

function validateForm() {
  var pibPattern = /^[А-ЩЬЮЯЇІЄҐґ'][а-щьюяїієґ']*\s[А-ЩЬЮЯЇІЄҐґ]\.\s?[А-ЩЬЮЯЇІЄҐґ']\.$/;
  var variantPattern = /^\d{2}$/;
  var phonePattern = /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
  var facultyPattern = /^[А-ЩЬЮЯЇІЄҐґ]{2,10}$/;
  var addressPattern = /^м\.\s[А-ЩЬЮЯЇІЄҐґ][а-щьюяїієґ]{1,19}$/;
  var loginPattern = /^[a-zA-Z0-9_-]{3,16}$/;
  var passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  var pib = document.getElementById('pib');
  var variant = document.getElementById('variant');
  var phone = document.getElementById('phone');
  var faculty = document.getElementById('faculty');
  var address = document.getElementById('address');
  var login = document.getElementById('login');
  var password = document.getElementById('password');

  var isValid = true;

  if (!loginPattern.test(login.value)) {
    setInvalidStyle(login);
    displayErrorMessage('Логін повинен містити від 3 до 16 символів, включаючи букви, цифри, тире та підкреслення.');
    isValid = false;
  } else {
    removeInvalidStyle(login);
  }
  
  if (!passwordPattern.test(password.value)) {
    setInvalidStyle(password);
    displayErrorMessage('Пароль повинен містити від 6 до 20 символів, включаючи хоча б одну цифру, одну маленьку та одну велику літеру.');
    isValid = false;
  } else {
    removeInvalidStyle(password);
  }
  
  
  if (!pibPattern.test(pib.value)) {
    setInvalidStyle(pib);
    isValid = false;
  } else {
      removeInvalidStyle(pib);
  }

  if (!variantPattern.test(variant.value)) {
      setInvalidStyle(variant);
      isValid = false;
  } else {
      removeInvalidStyle(variant);
  }

  if (!phonePattern.test(phone.value)) {
      setInvalidStyle(phone);
      isValid = false;
  } else {
      removeInvalidStyle(phone);
  }

  if (!facultyPattern.test(faculty.value)) {
      setInvalidStyle(faculty);
      isValid = false;
  } else {
      removeInvalidStyle(faculty);
  }

  if (!addressPattern.test(address.value)) {
      setInvalidStyle(address);
      isValid = false;
  } else {
      removeInvalidStyle(address);
  }

  return isValid;
}

function formatPhoneNumber() {
  var input = document.getElementById('phone');
  var value = input.value.replace(/\D/g, '');

  if (value.length > 0) {
      value = '(' + value.substring(0, 3) + ')-' + value.substring(3, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 10);
  }

  input.value = value;
}

function addCityPrefix() {
  var input = document.getElementById('address');
  var value = input.value.trim();

  if (value.length >= 2 && value.length <= 20) {
      if (!value.startsWith('м.')) {
          input.value = 'м. ' + value;
      }
  }
}

function setInvalidStyle(element) {
  element.style.borderColor = 'red';
}

function removeInvalidStyle(element) {
  element.style.borderColor = '';
}

function displayUserInfo(userInfo) {
  const userInfoElement = document.getElementById('userInfo');

  const userInfoHTML = `
    <p><strong>ПІБ:</strong> ${userInfo.pib}</p>
    <p><strong>Варіант:</strong> ${userInfo.variant}</p>
    <p><strong>Телефон:</strong> ${userInfo.phone}</p>
    <p><strong>Факультет:</strong> ${userInfo.faculty}</p>
    <p><strong>Адреса:</strong> ${userInfo.address}</p>
  `;

  userInfoElement.innerHTML = userInfoHTML;
}

async function loadAllUsers() {
  try {
    const response = await fetch('http://localhost:3000/allUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',  // Додайте цей заголовок
      },
    });

    if (response.ok) {
      const allUsers = await response.json();
      displayAllUsers(allUsers);
    } else {
      console.error('Помилка при завантаженні всіх користувачів');
    }
  } catch (error) {
    console.error('Помилка при завантаженні всіх користувачів:', error);
  }
}


function displayAllUsers(users) {
  const allUsersElement = document.getElementById('allUsers');

  if (users.length > 0) {
    let usersHTML = '<h4>Список усіх користувачів:</h4>';
    users.forEach(user => {
      usersHTML += `
        <div class="user-card">
          <p><strong>Логін:</strong> ${user.login}</p>
          <p><strong>Роль:</strong> ${user.role}</p>
          <button onclick="editUser('${user.login}')">Редагувати</button>
          <button onclick="deleteUser('${user.login}')">Видалити</button>
        </div>
      `;
    });
    allUsersElement.innerHTML = usersHTML;
  } else {
    allUsersElement.innerHTML = '<p>Немає користувачів</p>';
  }
}

async function editUser(login) {
  const newLogin = prompt('Введіть новий логін для користувача:');
  if (newLogin) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(`http://localhost:3000/editUser/${login}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldLogin: userInfo.login, newLogin }),
      });

      if (response.ok) {
        console.log('Користувача відредаговано');

        // Оновлюємо логін в localStorage
        userInfo.login = newLogin;
        localStorage.setItem('user', JSON.stringify(userInfo));

        // Оновлюємо інформацію про користувача на сторінці
        document.getElementById('userInfo').innerText = newLogin;

        displayUserInfo(userInfo);

        if (userInfo.role === 'admin') {
          loadAllUsers();
        }
      } else {
        console.error('Помилка при редагуванні користувача');
      }
    } catch (error) {
      console.error('Помилка при редагуванні користувача:', error);
    }
  }
}



async function deleteUser(login) {
  const confirmation = confirm(`Ви впевнені, що хочете видалити користувача ${login}?`);
  if (confirmation) {
    try {
      const response = await fetch(`http://localhost:3000/deleteUser/${login}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Користувача видалено');
        loadAllUsers();
      } else {
        console.error('Помилка при видаленні користувача');
      }
    } catch (error) {
      console.error('Помилка при видаленні користувача:', error);
    }
  }
}
