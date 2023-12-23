const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

const app = express();
const port = 3000;

const registeredUsers = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { login, password } = req.body;

  const user = registeredUsers[login];

  if (user && user.password === password) {
    const { password: userPassword, ...userInfo } = user;
    res.json(userInfo);
  } else {
    res.status(401).json({ message: 'Доступ заборонено' });
  }
});

app.post('/register', (req, res) => {
  const { login, password, pib, variant, phone, faculty, address, role } = req.body;

  if (registeredUsers[login]) {
    return res.status(400).json({ message: 'Користувач з таким ім\'ям вже існує' });
  }

  const newUser = {
    id: uuid.v4(),
    login,
    password,
    pib,
    variant,
    phone,
    faculty,
    address,
    role
  };

  registeredUsers[login] = newUser;

  const { password: userPassword, ...userInfo } = newUser;
  res.json(userInfo);
});

app.get('/allUsers', (req, res) => {
  try {
    const users = Object.values(registeredUsers);
    res.json(users);
  } catch (error) {
    console.error('Помилка при отриманні списку користувачів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

app.put('/editUser/:login', (req, res) => {
  try {
    const oldLogin = req.params.login;
    const newLogin = req.body.newLogin;

    if (registeredUsers[oldLogin]) {
      // Оновлюємо логін у користувача, залишаючи інші дані незмінними
      registeredUsers[newLogin] = registeredUsers[oldLogin];
      registeredUsers[oldLogin].login = newLogin;
      delete registeredUsers[oldLogin];



      res.json({ message: 'Користувача відредаговано', newLogin });
    } else {
      res.status(404).json({ message: 'Користувача не знайдено' });
    }
  } catch (error) {
    console.error('Помилка при редагуванні користувача:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});



app.delete('/deleteUser/:login', (req, res) => {
  try {
    const login = req.params.login;

    if (registeredUsers[login]) {
      delete registeredUsers[login];

      res.json({ message: 'Користувач видалений' });
    } else {
      res.status(404).json({ message: 'Користувача не знайдено' });
    }
  } catch (error) {
    console.error('Помилка при видаленні користувача:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});
  
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
