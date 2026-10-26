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

async function listUsers() {
  return await prisma.user.findMany();
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
