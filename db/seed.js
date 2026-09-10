import { Client } from "pg";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { getDatabaseConfiguration } from "./config.js";

const names = [
  "Bonita Santana",
  "Lucia Massey",
  "Hung Bird",
  "Judith Duarte",
  "Rodger Yoder",
  "Georgette Bartlett",
  "Carrie Brock",
  "Hollie Mullins",
  "Keri Donovan",
  "Kelvin Guerra",
  "Alana Hodge",
  "Pamela Jacobson",
  "Bernie Norman",
  "Tamera Schaefer",
  "Adrian Davis",
  "Alberto Stout",
  "Randall Deleon",
  "Dino Branch",
  "Angelia Nelson",
  "Clair Yang",
  "Allie Randolph",
  "Harry Reid",
  "Josiah Snyder",
  "Lela Jimenez",
  "Helene Decker",
];

const usersPassword = crypto.randomBytes(12).toString("hex");

console.log("Generating users...");
const users = await (async () => {
  const list = [];
  for (let i = 0; i < names.length; i++) {
    list.push({
      full_name: names[i],
      email: names[i].toLowerCase().replace(" ", "") + "@clubhouse.com",
      avatar_url:
        "https://api.dicebear.com/10.x/critters/svg?seed=" +
        encodeURI(names[i]),
      password_hash: await bcrypt.hash(usersPassword, 12),
    });
  }
  return list;
})();

const post_contents = [
  "A Georgia teacher who bought a $400 travel insurance policy was rewarded $10,000 because she read the fine print of the contract.",
  "When a person gets a kidney transplant, they usually just leave the original kidneys in their body and put the 3rd kidney in the lower abdomen.",
  "The longest boxing match went 110 rounds and over 7 hours.",
  "On average, the closest planet to Earth is Mercury. On average, the closest planet to Pluto is also Mercury.",
  "If a Lone Star Tick bites you, you may become allergic to red meat.",
  "The smallest park in the world is a circle in a street 2 feet across.",
  "Most of the visible stars you see in the night sky are binary stars - two stars orbiting each other.",
  "A giraffe and a human have the same number of bones in their necks.",
  "Canada's forests make up nearly 9% of the world’s total forest area.",
  "If you could fold a piece of paper in half 42 times, it would reach the moon.",
  "Due to their fur, the polar bear is relatively “invisible” to an infrared camera.",
  "Cosmic Latte is the average color of the universe.",
  "The first can opener wasn't invented until almost 50 years after the invention of the can.",
  "Orcas are a natural predator to moose.",
  "In 1919, a wave a molasses rushed through the streets of Boston killing 21 people and injuring 150.",
  "Soft-shelled turtles urinate through their mouth.",
  "It's suspected that on Neptune and Uranus, it rains diamonds.",
  "German Chocolate Cake has nothing to do with Germany. It was named after English-American Samuel German who developed a formulation of dark baking chocolate that came to be used in the cake recipe.",
  "In 1961 two hydrogen bombs were accidentally dropped over North Carolina. A glitch prevented them from detonating.",
  "NASA mistakenly erased the original tape of the first steps on the moon.",
  "Cows have best friends and they get stressed when they are separated.",
  "It took Erno Rubik, the creator of the Rubik’s Cube, about one month to solve the cube after he created it.",
  "Oxford University is older than the Aztec Empire.",
  "There are some spiders that keep tiny frogs as pets to stop pests that try to eat the spider's eggs.",
  "Tommy Fitzpatrick stole a small plane in 1956 from New Jersey on a bet and then landed it on the narrow street in front of the bar where he had been drinking in Manhattan. Two years later, he did it again after someone didn't believe he had done it the first time.",
];

const post_authors = (() => {
  const nums = Array.from({ length: users.length }, (_, i) => i);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[j], nums[i]] = [nums[i], nums[j]];
  }
  return nums.slice(0, 6);
})();

const posts = post_contents.map((content) => ({
  content,
  author_id: post_authors[Math.floor(Math.random() * 6)],
}));

const reactions = (() => {
  const list = [];
  for (let post_id = 1; post_id <= posts.length; post_id++) {
    for (let author_id = 1; author_id <= users.length; author_id++) {
      if (Math.random() < 0.5) continue;

      list.push({
        post_id,
        author_id,
        vote: Math.random() > 0.2 ? 1 : -1,
      });
    }
  }
  return list;
})();

const client = new Client(getDatabaseConfiguration(process.argv[2]));
try {
  await client.connect();

  console.log();
  try {
    console.log("Seeding users...");
    await client.query(
      "INSERT INTO users (full_name, email, avatar_url, password_hash)" +
        "\nVALUES\n  " +
        users
          .map(
            (user) =>
              `('${user.full_name}', '${user.email}', '${user.avatar_url}', '${user.password_hash}')`,
          )
          .join(",\n  ") +
        ";",
    );

    console.log("Seeding posts...");
    await client.query(
      "INSERT INTO posts (content, author_id)" +
        "\nVALUES\n  " +
        posts
          .map(
            (post) =>
              `('${post.content.replace("'", "''")}', ${post.author_id})`,
          )
          .join(",\n  ") +
        ";",
    );

    console.log("Seeding reactions...");
    await client.query(
      "INSERT INTO reactions (post_id, user_id, vote)" +
        "\nVALUES\n  " +
        reactions
          .map(
            (reaction) =>
              `(${reaction.post_id}, ${reaction.author_id}, ${reaction.vote})`,
          )
          .join(",\n  ") +
        ";",
    );

    console.log("\nSeeding completed successfully!");
    console.log(`\nUsers Password: ${usersPassword}`);
  } catch (error) {
    throw error;
  }
} finally {
  client.end();
}
