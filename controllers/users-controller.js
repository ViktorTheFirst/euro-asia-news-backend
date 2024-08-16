const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const { pool } = require('../DB/db-connect');
const User = require('../models/UserModel');

const getAllUsers = async (req, res, next) => {
  const sql = 'SELECT username, email, create_time FROM user';
  try {
    pool.execute(sql, function (err, result) {
      if (err) throw err;

      res.status(200).json({ users: result });
    });
  } catch (err) {
    console.log('err', err);
    const error = new HttpError('Fetching users failed on BE', 500);
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  const id = req.params.userId;
  console.log('GET USER with id', id);
  const sql = `SELECT username, email, create_time, role FROM user WHERE id = ${id}`;
  try {
    pool.execute(sql, function (err, result) {
      if (err) throw err;

      res.status(200).json({ user: result });
    });
  } catch (err) {
    const error = new HttpError('Fetching user failed on BE', 500);
    return next(error);
  }
};

const editUser = async (req, res, next) => {
  /* console.log('EDIT USER', req.body);

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

  res.json({ user: user.toObject() }); */
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log('SIGNUP', { name, email, password });

  //const sql_insert = `INSERT INTO user(username, email, password, create_time, role ) VALUES(${name}, ${email}, ${password}, ${new Date.now()} ,' user' )`;
  const sql_get_one = `SELECT * FROM user WHERE email = '${email}'`;
  let existingUser;
  try {
    pool.execute(sql_get_one, function (err, result) {
      if (err) throw err;

      existingUser = result;
    });
  } catch (err) {
    const error = new HttpError('Signing up failed on BE', 500);
    return next(error);
  }
  console.log('existingUser', existingUser);
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
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  try {
    const createdUser = await newUser.save();
    console.log('createdUser', createdUser);
  } catch (err) {
    const error = new HttpError('Creating user failed ' + err, 500);
    return next(error);
  }

  //return created user
  res.status(201).json({
    name,
    email,
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

  res.json({
    name: existingUser.name,
    email: existingUser.email,
  });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.getUser = getUser;
exports.editUser = editUser;
