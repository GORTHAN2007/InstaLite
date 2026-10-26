const prisma = require("../db");

async function create(req, res) {
  const { username, email, fullname, bio } = req.body;

  if (!username || !email || !fullname) {
    return res
      .status(400)
      .json({ error: "username, email and fullname are required" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        fullname,
        bio: bio ?? null,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function list(req, res) {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getOne(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function update(req, res) {
  const id = parseInt(req.params.id, 10);
  const { fullname, bio, isPrivate } = req.body;

  const updateData = {};
  if (fullname !== undefined) updateData.fullname = fullname;
  if (bio !== undefined) updateData.bio = bio;
  if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function remove(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
};
