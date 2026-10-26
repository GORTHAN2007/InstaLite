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

module.exports = {
  createPost,
  listPosts,
};
