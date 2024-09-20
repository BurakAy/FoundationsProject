const { login, register } = require("../src/Service/UserService");
const { userLogin, createAccount } = require("../src/DAO/UserDAO");

jest.mock("../src/DAO/UserService", () => ({
  userLogin: jest.fn(),
  createAccount: jest.fn()
}));

describe("User account login functionality tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a message with login successful", () => {});

  test("should fail to login due to wrong credentials", () => {});

  test("should fail to login due to missing credentials", () => {});
});
