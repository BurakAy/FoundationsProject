const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const logger = require("../util/logger");
const fs = require("fs");
dotenv.config({ path: "./.env" });

const { userLogin, createAccount } = require("../DAO/userDAO");

async function login(userCred) {
  const secretKey = process.env.SECRET_KEY;
  const userName = userCred.userName;
  const userPass = userCred.password;
  const response = {};

  if (userName && userPass) {
    const loggedIn = await userLogin(userName, userPass);

    if (loggedIn.Count > 0) {
      const token = jwt.sign(
        {
          userName: loggedIn.Items[0].userName.S,
          role: loggedIn.Items[0].role.S
        },
        secretKey,
        {
          expiresIn: "30m"
        }
      );
      response.token = token;

      fs.writeFile("src/Controller/token.txt", token, (err) => {
        logger.info("jwt token created and written to file");
        if (err) {
          logger.error(err);
        }
      });

      response.status = 200;
      response.message = `Login successful for: ${loggedIn.Items[0].userName.S}`;
    } else {
      response.status = 401;
      response.message = "Login failed, check user credentials";
    }

    return response;
  }

  response.status = 401;
  response.message = "Login failed, missing credentials";
  return response;
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
