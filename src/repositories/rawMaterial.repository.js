const findAll = async () => {
  return RawMaterial.find().sort({ createdAt: -1 });
};