const { z } = require("zod");
const validate = require("../src/middlewares/validate");
const errorMiddleware = require("../src/middlewares/error.middleware");
const swaggerSpec = require("../src/docs/swagger");

describe("route registration", () => {
  it.each(["auth", "installation", "product", "rawMaterial"])(
    "loads the %s route module without invalid handlers",
    (routeName) => {
      expect(() => require(`../src/routes/${routeName}.routes`)).not.toThrow();
    }
  );

  it("loads the Express application", () => {
    expect(() => require("../src/app")).not.toThrow();
  });
});

describe("API error handling and documentation", () => {
  it("preserves client errors from Express body parsing", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorMiddleware({ status: 400, message: "Invalid JSON" }, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid JSON" });
  });

  it("loads the documented raw-material endpoints", () => {
    expect(swaggerSpec.paths).toHaveProperty("/api/raw-materials/{id}/entries");
  });
});

describe("request validation", () => {
  const schema = z.object({ quantity: z.number().positive() });

  it("replaces the request body with validated Zod data", () => {
    const req = { body: { quantity: 2 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(req.body).toEqual({ quantity: 2 });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns validation details for invalid input", () => {
    const req = { body: { quantity: -1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Données invalides.",
      errors: [expect.objectContaining({ field: "quantity" })],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
