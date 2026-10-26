const usersService = require("../services/users.service");

function parsePositiveInt(val) {
  if (val === undefined) return null;
  if (!/^\d+$/.test(val)) return NaN;
  const num = parseInt(val, 10);
  return num > 0 ? num : NaN;
}

async function create(req, res) {
  const { username, email, fullname, bio } = req.body;

  if (!username || !email || !fullname) {
    return res
      .status(400)
      .json({ error: "username, email and fullname are required" });
  }

  try {
    const user = await usersService.createUser({ username, email, fullname, bio });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function list(req, res) {
  let page = 1;
  let limit = 10;

  if (req.query.page !== undefined) {
    const parsedPage = parsePositiveInt(req.query.page);
    if (!parsedPage || isNaN(parsedPage)) {
      return res.status(400).json({ error: "page and limit must be positive integers" });
    }
    page = parsedPage;
  }

  if (req.query.limit !== undefined) {
    const parsedLimit = parsePositiveInt(req.query.limit);
    if (!parsedLimit || isNaN(parsedLimit)) {
      return res.status(400).json({ error: "page and limit must be positive integers" });
    }
    limit = Math.min(parsedLimit, 50);
  }

  try {
    const result = await usersService.listUsers({ page, limit });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getOne(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const user = await usersService.getUserById(id);
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

  try {
    const updatedUser = await usersService.updateUser(id, {
      fullname,
      bio,
      isPrivate,
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
    await usersService.deleteUser(id);
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
