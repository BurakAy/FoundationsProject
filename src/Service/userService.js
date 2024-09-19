const { userLogin, createAccount } = require("../DAO/UserDAO");

async function login(userCred) {
  const userName = userCred.userName;
  const userPass = userCred.password;

  if (userName && userPass) {
    const loggedIn = await userLogin(userName, userPass);
    return loggedIn > 0
      ? { status: 200, message: "Login successful" }
      : { status: 401, message: "Login failed, check user credentials" };
  }

  return { status: 401, message: "Login failed, missing credentials" };
}

async function register(userCred) {
  const userName = userCred.userName;
  const userPass = userCred.password;

  if (userName && userPass) {
    const registered = await createAccount(userName, userPass);
    return registered
      ? { status: 200, message: "Registration successful" }
      : { status: 409, message: "Username already exists" };
  }

  return { status: 400, message: "Registration failed, missing credentials" };
}

module.exports = { login, register };
