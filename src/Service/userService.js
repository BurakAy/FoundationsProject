const { userLogin, createAccount } = require("../DAO/UserDAO");

async function login(userCred) {
  const userName = userCred.userName;
  const userPass = userCred.password;

  if (userName && userPass) {
    const loggedIn = await userLogin(userName, userPass);
    return loggedIn.length ? true : false;
  }

  return "Login failed, missing credentials";
}

async function register(userCred) {
  const userName = userCred.userName;
  const userPass = userCred.password;

  if (userName && userPass) {
    const registered = await createAccount(userName, userPass);
    return registered;
  }

  return "Registration failed, missing credentials";
}

module.exports = { login, register };
