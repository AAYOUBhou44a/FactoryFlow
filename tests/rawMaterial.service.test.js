jest.mock("mongoose", () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn((value) => /^[0-9a-f]{24}$/i.test(value)),
    },
  },
  startSession: jest.fn(),
}));

jest.mock("../src/repositories/product.repository", () => ({
  isMaterialUsed: jest.fn(),
}));

jest.mock("../src/repositories/rawMaterial.repository", () => ({
  findById: jest.fn(),
  updateById: jest.fn(),
}));

jest.mock("../src/repositories/stockMovement.repository", () => ({
  create: jest.fn(),
}));

const mongoose = require("mongoose");
const rawMaterialRepository = require("../src/repositories/rawMaterial.repository");
const stockMovementRepository = require("../src/repositories/stockMovement.repository");
const rawMaterialService = require("../src/services/rawMaterial.service");

const materialId = "507f1f77bcf86cd799439011";
const userId = "507f191e810c19729de860ea";

describe("raw material stock entry", () => {
  let session;

  beforeEach(() => {
    jest.clearAllMocks();
    session = {
      withTransaction: jest.fn(async (callback) => callback()),
      endSession: jest.fn(),
    };
    mongoose.startSession.mockResolvedValue(session);
    rawMaterialRepository.findById.mockResolvedValue({ quantity: 10 });
    rawMaterialRepository.updateById.mockResolvedValue({ quantity: 15 });
  });

  it("updates stock and records its movement in one transaction", async () => {
    const updatedMaterial = await rawMaterialService.addStock(materialId, 5, userId);

    expect(updatedMaterial).toEqual({ quantity: 15 });
    expect(session.withTransaction).toHaveBeenCalledTimes(1);
    expect(rawMaterialRepository.updateById).toHaveBeenCalledWith(
      materialId,
      { quantity: 15 },
      session
    );
    expect(stockMovementRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        rawMaterial: materialId,
        type: "ENTRY",
        quantity: 5,
        stockBefore: 10,
        stockAfter: 15,
        performedBy: userId,
      }),
      session
    );
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid quantities before opening a transaction", async () => {
    await expect(rawMaterialService.addStock(materialId, 0, userId)).rejects.toMatchObject({
      statusCode: 400,
    });

    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  it("ends the transaction session when the material does not exist", async () => {
    rawMaterialRepository.findById.mockResolvedValue(null);

    await expect(rawMaterialService.addStock(materialId, 5, userId)).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(session.endSession).toHaveBeenCalledTimes(1);
    expect(stockMovementRepository.create).not.toHaveBeenCalled();
  });
});
