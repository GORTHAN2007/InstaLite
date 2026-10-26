const postsService = require("../services/posts.service");

async function create(req, res) {
  const { imageUrl, caption, location } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  try {
    const post = await postsService.createPost({ imageUrl, caption, location });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function list(req, res) {
  try {
    const posts = await postsService.listPosts();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getOne(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const post = await postsService.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function update(req, res) {
  const id = parseInt(req.params.id, 10);
  const { caption, location } = req.body;

  try {
    const updatedPost = await postsService.updatePost(id, {
      caption,
      location,
    });
    return res.status(200).json(updatedPost);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function remove(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    await postsService.deletePost(id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
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
