const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed on BE', 500);
    return next(error);
  }

  res.json({ users });
};

const getUser = async (req, res, next) => {
  console.log('GET USER', req.params.userId);
  const id = req.params.userId;
  let user;
  try {
    user = await User.findById(id, '-password');
  } catch (err) {
    const error = new HttpError('Fetching user failed on BE', 500);
    return next(error);
  }

  res.json({ user: user.toObject() });
};

const editUser = async (req, res, next) => {
  console.log('EDIT USER', req.body);

  const { name, email } = req.body;
  const id = req.params.userId;

  let user;
  try {
    user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        profileImage: req.file.path,
      },
      { new: true }
    );
  } catch (err) {
    const error = new HttpError('Editing user failed on BE', 500);
    return next(error);
  }

  res.json({ user: user.toObject() });
};

const signup = async (req, res, next) => {
  const { name, partnerName, email, partnerEmail, password } = req.body;
  console.log('SIGNUP', { name, partnerName, email, partnerEmail, password });

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signing up failed on BE', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User with that email already exists, please log in',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user ' + err, 500);
    return next(error);
  }
  const id = uuidv4();
  // create user in DB
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    householdId: id,
    profileImage: '',
  });

  const newPartnerUser = new User({
    name: partnerName,
    email: partnerEmail,
    password: hashedPassword,
    householdId: id,
    profileImage: '',
  });

  try {
    await newUser.save();
    await newPartnerUser.save();
  } catch (err) {
    const error = new HttpError('Creating user failed ' + err, 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.SECRET,
      {
        expiresIn: '8h',
      }
    );
  } catch (err) {
    const error = new HttpError('Creating user failed ' + err, 500);
    return next(error);
  }

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.cookie('householdId', id, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.cookie('userId', newUser._id.toString(), {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  //return created user
  res.status(201).json({
    name,
    email,
    partnerEmail,
    partnerName,
    householdId: id,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('LOGIN', { email, password });

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Login failed on BE', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.SECRET,
      {
        expiresIn: '8h',
      }
    );
  } catch (err) {
    const error = new HttpError('Logging user failed ' + err, 500);
    return next(error);
  }

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.cookie('householdId', existingUser.householdId, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.cookie('userId', existingUser._id.toString(), {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.json({
    name: existingUser.name,
    email: existingUser.email,
    householdId: existingUser.householdId,
    token,
  });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.getUser = getUser;
exports.editUser = editUser;
