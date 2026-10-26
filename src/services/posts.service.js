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

module.exports = {
  createPost,
  listPosts,
  getPostById,
};
