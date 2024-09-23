const fs = require("fs");
const jwt = require("jsonwebtoken");
const { login, register } = require("../src/Service/UserService");
const { userLogin, createAccount } = require("../src/DAO/UserDAO");

jest.mock("fs");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn()
}));

jest.mock("../src/DAO/UserDAO", () => ({
  userLogin: jest.fn(),
  createAccount: jest.fn()
}));

describe("User account creation functionality tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a message with successful account creation", async () => {
    const user = { userName: "burak", password: "abc123" };
    createAccount.mockResolvedValue(200);

    const response = await register(user);
    expect(response).toEqual({
      status: 200,
      message: "Registration successful"
    });
    expect(createAccount).toHaveBeenCalledWith(user.userName, user.password);
  });
});

describe("User account login functionality tests", () => {
  beforeAll(() => {
    process.env.SECRET_KEY = "test_secret_key";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a message with successful login", async () => {
    const user = { userName: "burak", password: "abc123" };
    const mockResponse = {
      Count: 1,
      Items: [{ userName: { S: "burak" }, role: { S: "employee" } }]
    };
    userLogin.mockResolvedValue(mockResponse);
    jwt.sign.mockReturnValue("mockToken");
    fs.writeFile.mockImplementation((path, data, callback) => callback(null));

    const response = await login(user);

    expect(response).toEqual({
      token: "mockToken",
      status: 200,
      message: `Login successful for: ${user.userName}`
    });
    expect(userLogin).toHaveBeenCalledWith(user.userName, user.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userName: "burak", role: "employee" },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      "src/Controller/token.txt",
      "mockToken",
      expect.any(Function)
    );
  });

  test("should fail to login due to wrong credentials", async () => {
    const user = { userName: "burak", password: "wrongpass" };
    userLogin.mockResolvedValue(401);
    const response = await login(user);

    expect(response).toEqual({
      status: 401,
      message: "Login failed, check user credentials"
    });
    expect(userLogin).toHaveBeenCalledWith(user.userName, user.password);
  });

  test("should fail to login due to missing credentials", async () => {
    const user = { userName: "burak" };
    userLogin.mockResolvedValue(401);
    const response = await login(user);

    expect(response).toEqual({
      status: 401,
      message: "Login failed, missing credentials"
    });
    expect(userLogin).not.toHaveBeenCalled();
  });
});
