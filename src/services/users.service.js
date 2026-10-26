const prisma = require("../db");

async function createUser(data) {
  const { username, email, fullname, bio } = data;
  return await prisma.user.create({
    data: {
      username,
      email,
      fullname,
      bio: bio ?? null,
    },
  });
}

async function listUsers({ page, limit, sortBy = "createdAt", order = "desc", isPrivate, search }) {
  const skip = (page - 1) * limit;

  const where = {};

  if (isPrivate !== undefined) {
    where.isPrivate = isPrivate;
  }

  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { fullname: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

async function updateUser(id, data) {
  const { fullname, bio, isPrivate } = data;
  const updateData = {};
  if (fullname !== undefined) updateData.fullname = fullname;
  if (bio !== undefined) updateData.bio = bio;
  if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
}

async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
