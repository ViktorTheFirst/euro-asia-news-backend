import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error.js';
import pool from '../DB/db-connect.js';
import { User } from '../models/UserModel.js';

const getAllUsers = async (req, res, next) => {
  const sql = 'SELECT username, email, create_time FROM user';
  try {
    const [rows, _] = await pool.execute(sql);
    console.log(`Fetched ${rows.length} users`);
    res.status(200).json({ users: rows });
  } catch (err) {
    const error = new HttpError('Fetching users failed on BE', 500);
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  const id = req.params.userId;
  console.log('Fetched user with id', id);
  const sql = `SELECT username, email, create_time, role FROM user WHERE id = ${id}`;
  try {
    const [rows, _] = await pool.execute(sql);
    res.json({ user: rows[0] });
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
  const { name, email, password, role } = req.body;
  console.log('SIGNUP', { name, email, password, role });

  const sql_get_one = `SELECT * FROM user WHERE email = '${email}'`;
  let existingUser;
  try {
    const [rows, _] = await pool.execute(sql_get_one);
    existingUser = rows[0];
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
  // ------------------create password-------------------------
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user ' + err, 500);
    return next(error);
  }

  // ------------------create user-------------------------
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  let isUserCreated;
  try {
    isUserCreated = await newUser.save();
  } catch (err) {
    const error = new HttpError('Creating user failed ' + err, 500);
    return next(error);
  }

  // ------------------create token-------------------------
  let token = null;
  try {
    token = jwt.sign(
      { userName: newUser.username, email: newUser.email },
      process.env.SECRET,
      {
        expiresIn: '8h',
      }
    );
  } catch (err) {
    const error = new HttpError('Creating user token failed ' + err, 500);
    return next(error);
  }

  if (isUserCreated && token) {
    res.cookie('userId', newUser.id.toString(), {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('userRole', newUser.role, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(201).json({
      id,
      name,
      email,
      role,
    });
    return;
  }
  const error = new HttpError('Creating user failed', 409);
  return next(error);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('LOGIN', { email, password });

  const sql_get_one = `SELECT * FROM user WHERE email = '${email}'`;
  let existingUser;
  try {
    const [rows, _] = await pool.execute(sql_get_one);
    existingUser = rows[0];
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
      { userName: existingUser.username, email: existingUser.email },
      process.env.SECRET,
      {
        expiresIn: '8h',
      }
    );
  } catch (err) {
    const error = new HttpError('Creating user token failed ' + err, 500);
    return next(error);
  }

  res.cookie('userId', existingUser.id.toString(), {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.cookie('userRole', existingUser.role, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  console.log('TOKEN CREATED', token);

  res.json({
    id: existingUser.id,
    name: existingUser.username,
    email: existingUser.email,
    role: existingUser.role,
  });
};

export { getAllUsers, signup, login, getUser, editUser };
