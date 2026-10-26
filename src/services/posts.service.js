const prisma = require("../db");

async function createPost(data) {
  const { imageUrl, caption, location } = data;
  return await prisma.post.create({
    data: {
      imageUrl,
      caption: caption ?? null,
      location: location ?? null,
    },
  });
}

async function listPosts() {
  return await prisma.post.findMany();
}

async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id },
  });
}

async function updatePost(id, data) {
  const { caption, location } = data;
  const updateData = {};
  if (caption !== undefined) updateData.caption = caption;
  if (location !== undefined) updateData.location = location;

  return await prisma.post.update({
    where: { id },
    data: updateData,
  });
}

async function deletePost(id) {
  return await prisma.post.delete({
    where: { id },
  });
}

module.exports = {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
};
