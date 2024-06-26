import bycrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../repository/auth.repository.js";
import { generateToken } from "../utils/auth.utils.js";
import { getStudentDetails } from "../repository/students.repository.js";

const SignUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userData = {
    name,
    email,
    password,
    role,
  };

  userData.password = bycrypt.hashSync(password, 10);

  try {
    if (await getUserByEmail(email))
      return res.status(400).json({ message: "User already exists" });

    const user = await createUser(userData);

    res.status(201).json({ message: "User registered sucessfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LogIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let user;
  try {
    user = await getUserByEmail(email);
  } catch (error) {
    console.log("Failed to fetch User:", error);
    return res.status(500).json({ message: error.message });
  }

  if (user === null) {
    return res.status(400).json({ message: "User does not exists" });
  }

  if (!bycrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  } else {
    const token = generateToken({ userId: user.user_id });
    // res.cookie("accessToken", token, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    //   // origin: "localhost",
    //   secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
    //   sameSite: 'None', // Set to None for cross-site cookies
    //   domain: process.env.NODE_ENV === 'production' ? 'sachinbuilds.in' : 'localhost'
    // });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "prod", // Ensure secure cookies in production
      sameSite: "None", // Set to None for cross-site cookies
      domain: process.env.NODE_ENV === "prod" ? "sachinbuilds.in" : "localhost",
    });

    if (user.role === "Student") {
      const student = await getStudentDetails(user.user_id);
      user.password = undefined;
      let newData = { ...user, ...student[0] };
      console.log(student[0]);
      return res
        .status(200)
        .json({ message: "Logged in successfully", user: newData });
    }

    user.password = undefined;
    return res.status(200).json({ message: "Logged in successfully", user });
  }
};

export { LogIn, SignUp };
