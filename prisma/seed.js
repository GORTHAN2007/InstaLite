const prisma = require("../src/db");
const { users, posts } = require("./seed-data");

async function main() {
  try {
    // 3. Deletes all posts, then deletes all users
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // 4. Creates all 12 users in one query
    const createdUsers = await prisma.user.createMany({
      data: users,
    });

    // 5. Creates all 24 posts in one query
    const createdPosts = await prisma.post.createMany({
      data: posts,
    });

    // 6. Prints seeded count from query result
    console.log(`🌱 Seeded ${createdUsers.count} users and ${createdPosts.count} posts`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    // 7. Disconnects Prisma client whether succeeded or failed
    await prisma.$disconnect();
  }
}

main();
