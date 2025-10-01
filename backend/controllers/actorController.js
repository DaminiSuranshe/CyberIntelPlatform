const Actor = require("../models/Actor");

// Create actor
exports.createActor = async (req, res) => {
  try {
    const { name, country, techniques, associatedIoCs, description } = req.body;
    const newActor = new Actor({ name, country, techniques, associatedIoCs, description });
    await newActor.save();
    res.json(newActor);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all actors
exports.getActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single actor
exports.getActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ msg: "Actor not found" });
    res.json(actor);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update actor
exports.updateActor = async (req, res) => {
  try {
    const { name, country, techniques, associatedIoCs, description } = req.body;
    const updated = await Actor.findByIdAndUpdate(
      req.params.id,
      { name, country, techniques, associatedIoCs, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Actor not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete actor
exports.deleteActor = async (req, res) => {
  try {
    const deleted = await Actor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Actor not found" });
    res.json({ msg: "Actor deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
