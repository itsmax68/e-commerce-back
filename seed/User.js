const User = require("../models/User");

const users = [
  {
    _id: "65b8e564ea5ce114184ccb96",
    name: "demo user",
    email: "demo@gmail.com",
    password:'$2a$10$GH8p5cAsGFEdYsLaSfTQ3e1eUs7KbLmVBltjbX4DDCj2eyO2KW/Ze',
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },
  {
    _id: "65d000000000000000000001",
    name: "demo admin",
    email: "admin@gmail.com",
    // Uses the same password as `demo@gmail.com` from the existing seed.
    // See root `readme.md` for the plain-text demo password.
    password: '$2a$10$GH8p5cAsGFEdYsLaSfTQ3e1eUs7KbLmVBltjbX4DDCj2eyO2KW/Ze',
    isVerified: true,
    isAdmin: true,
    __v: 0,
  },
];

exports.seedUser = async () => {
  try {
    // Avoid failing seeding when re-running (unique email constraint).
    for (const user of users) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) await User.create(user);
    }
    console.log("User seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
