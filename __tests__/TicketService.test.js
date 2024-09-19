const {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets
} = require("../src/Service/TicketService");
const {
  createTicket,
  updateTicket,
  pendingTickets
} = require("../src/DAO/TicketDAO");

jest.mock("../src/DAO/TicketDAO", () => ({
  updateTicket: jest.fn(),
  createTicket: jest.fn(),
  pendingTickets: jest.fn()
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

    const response = await processTicket(ticket);

    expect(response).toEqual({
      status: 409,
      message: "Cannot process tickets that have already been approved/denied",
      updatedTicket: null
    });
    expect(updateTicket).toHaveBeenCalledWith(ticket);
  });

  test("should return an error if ticketId is missing", async () => {
    const ticket = { status: "approved" };

    const response = await processTicket(ticket);

    expect(response).toEqual({
      status: 400,
      message: "ticketId needed to process ticket",
      updatedTicket: null
    });
    expect(updateTicket).not.toHaveBeenCalled();
  });
});

describe("Pending tickets retrieval functionality tests", () => {
  test("should return a message with 0 pending tickets", async () => {
    pendingTickets.mockResolvedValue({ Count: 0, Items: [] });

    const result = await ticketsPending();

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

    const result = await ticketsPending();

    expect(result).toEqual({
      message: "2 pending",
      pending: [
        { id: "1", status: "pending" },
        { id: "2", status: "pending" }
      ]
    });
  });

  // test("should handle errors from pendingTickets", async () => {
  //   pendingTickets.mockRejectedValue(new Error("Database error"));

  //   const result = await ticketsPending();

  //   expect(result).toEqual({ message: "0 pending" });
  // });
});
