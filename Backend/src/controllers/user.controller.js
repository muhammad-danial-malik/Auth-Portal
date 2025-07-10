import { asyncHandler } from "../utils/asyncHandler.js";
import UserAccount from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const cookiesOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserAccount.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens", error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  console.log("email", email);

  // if (fullName === "" || email === "" || username === "" || password === "") {
  //   return apiError(400, "All fields are required");
  // }

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await UserAccount.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "UserAccount already exists with this email or username"
    );
  }

  const user = await UserAccount.create({
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await UserAccount.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "UserAccount registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await UserAccount.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "UserAccount does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await UserAccount.findById(user._Id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "UserAccount logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await UserAccount.findByIdAndUpdate(
    req.user._Id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("refreshToken", cookiesOptions)
    .clearCookie("accessToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "UserAccount logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
