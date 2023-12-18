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
  const { login, password, pib, variant, phone, faculty, address } = req.body;

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
    address
  };

  registeredUsers[login] = newUser;

  const { password: userPassword, ...userInfo } = newUser;
  res.json(userInfo);
});
  
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
