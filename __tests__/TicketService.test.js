const fs = require("fs");
const jwt = require("jsonwebtoken");
const {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets,
  userAuthentication
} = require("../src/Service/TicketService");
const {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
} = require("../src/DAO/TicketDAO");

jest.mock("fs");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn()
}));

jest.mock("../src/DAO/TicketDAO", () => ({
  updateTicket: jest.fn(),
  createTicket: jest.fn(),
  pendingTickets: jest.fn(),
  employeeTickets: jest.fn()
}));

describe("Ticket submission functionality tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully submit a ticket", async () => {
    const ticket = {
      userName: "burak",
      amount: 1234.56,
      description: "plane ticket"
    };
    createTicket.mockResolvedValue(200);

    const response = await submitTicket(ticket);

    expect(response).toEqual({
      status: 200,
      message: "Ticket successfully submitted"
    });
    expect(createTicket).toHaveBeenCalledWith(ticket);
  });

  test("should fail to submit a ticket due to missing attributes", async () => {
    const ticket = {
      userName: "burak",
      description: "plane ticket"
    };

    const response = await submitTicket(ticket);

    expect(response).toEqual({
      status: 400,
      message: "Tickets must have an amount, description, and username"
    });
    expect(createTicket).not.toHaveBeenCalled();
  });

  test("should fail to submit a ticket when createTicket fails", async () => {
    const ticket = {
      userName: "burak",
      amount: 1234.56,
      description: "plane ticket"
    };
    createTicket.mockResolvedValue(400);

    const response = await submitTicket(ticket);

    expect(response).toEqual({
      status: 400,
      message: "Failed to submit ticket"
    });
    expect(createTicket).toHaveBeenCalledWith(ticket);
  });
});

describe("Ticket approval/denial functionality tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process the ticket successfully", async () => {
    const ticket = { ticketId: "123", status: "approved" };
    const mockResponse = {
      $metadata: { httpStatusCode: 200 },
      Attributes: { ticketId: "123", status: "approved" }
    };

    updateTicket.mockResolvedValue(mockResponse);
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "manager" });

    const response = await processTicket(ticket);

    expect(response).toEqual({
      status: 200,
      message: "Ticket successfully processed",
      updatedTicket: mockResponse.Attributes
    });
    expect(updateTicket).toHaveBeenCalledWith(ticket);
  });

  test("should not process the ticket if already approved/denied", async () => {
    const ticket = { ticketId: "123", status: "denied" };

    updateTicket.mockResolvedValue(false);
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "manager" });

    const response = await processTicket(ticket);

    expect(response).toEqual({
      status: 409,
      message: "Cannot process tickets that have already been approved/denied"
    });
    expect(updateTicket).toHaveBeenCalledWith(ticket);
  });

  test("should return an error if ticketId is missing", async () => {
    const ticket = { status: "approved" };

    const response = await processTicket(ticket);

    expect(response).toEqual({
      status: 400,
      message: "ticketId needed to process ticket"
    });
    expect(updateTicket).not.toHaveBeenCalled();
  });

  test("should fail due to unauthorized access", async () => {
    const ticket = { ticketId: "12345", status: "denied" };
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "employee" });

    const response = await processTicket(ticket);

    expect(response).toEqual({
      status: 401,
      message: "Unauthorized access"
    });
  });
});

describe("Pending tickets retrieval functionality tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a message with 0 pending tickets", async () => {
    pendingTickets.mockResolvedValue({ Count: 0, Items: [] });

    const result = await ticketsPending();
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "manager" });

    expect(result).toEqual({ message: "0 pending" });
  });

  test("should return a message with pending tickets", async () => {
    const mockTickets = {
      Count: 2,
      Items: [
        { id: { S: "1" }, status: { S: "pending" } },
        { id: { S: "2" }, status: { S: "pending" } }
      ]
    };
    pendingTickets.mockResolvedValue(mockTickets);
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "manager" });

    const result = await ticketsPending();

    expect(result).toEqual({
      message: "2 pending",
      pending: [
        { id: "1", status: "pending" },
        { id: "2", status: "pending" }
      ],
      status: 200
    });
  });

  // test("should handle errors from pendingTickets", async () => {
  //   pendingTickets.mockRejectedValue(new Error("Database error"));

  //   const result = await ticketsPending();

  //   expect(result).toEqual({ message: "0 pending" });
  // });
});

describe("Employee ticket history retrieval functionality tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a message with 0 tickets", async () => {
    employeeTickets.mockResolvedValue({ Count: 0, Items: [] });
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "employee" });

    const mockUserName = "burak";
    const result = await previousTickets(mockUserName);

    expect(result).toEqual({ message: "0 tickets", status: 200 });
  });

  test("should return a message with previously submitted tickets", async () => {
    const mockUserName = "burak";
    const mockTickets = {
      Count: 2,
      Items: [
        { id: { S: "1" }, status: { S: "pending" } },
        { id: { S: "2" }, status: { S: "approved" } }
      ]
    };
    employeeTickets.mockResolvedValue(mockTickets);
    fs.readFileSync.mockReturnValue("valid.jwt.token");
    jwt.verify.mockReturnValue({ userName: "burak", role: "employee" });

    const result = await previousTickets(mockUserName);

    expect(result).toEqual({
      message: "2 tickets",
      submitted: [
        { id: "1", status: "pending" },
        { id: "2", status: "approved" }
      ],
      status: 200
    });
  });
});
