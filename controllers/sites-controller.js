import { Site } from '../models/SiteModel.js';
import HttpError from '../models/http-error.js';
import pool from '../DB/db-connect.js';
import {
  dateFormater,
  dateFormaterToSql,
  calculateNextExpiration,
} from '../utils/functions.js';

const getSites = async (req, res, next) => {
  const sql = 'SELECT * FROM sites';
  try {
    const [rows, _] = await pool.execute(sql);
    console.log(`Fetched ${rows.length} sites`);

    const correctDateRows = rows.map((row) => ({
      ...row,
      hosting_exp_date: dateFormater(row.hosting_exp_date),
      domain_exp_date: dateFormater(row.domain_exp_date),
    }));

    res.status(200).json({ sites: correctDateRows });
  } catch (err) {
    const error = new HttpError('Fetching sites failed on BE again', 500);
    return next(error);
  }
};

const addSite = async (req, res, next) => {
  const sql = `INSERT INTO sites (
    name, 
    hosting_address, 
    hosting_login, 
    hosting_pass, 
    hosting_exp_date, 
    domain_address, 
    domain_login, 
    domain_pass, 
    domain_exp_date, 
    comments) 
    VALUES (
     '${req.body.name}',
     '${req.body.hosting_address}',
     '${req.body.hosting_login}',
     '${req.body.hosting_pass}',
     '${req.body.hosting_exp_date}',
     '${req.body.domain_address}',
     '${req.body.domain_login}',
     '${req.body.domain_pass}',
     '${req.body.domain_exp_date}',
     '${req.body.comments}'
    )`;
  try {
    const [rows, _] = await pool.execute(sql);

    console.log(
      `Added site with id ${rows.insertId} and name: ${req.body.name}`
    );
    res.status(200).json({ sites: rows });
  } catch (err) {
    const error = new HttpError(
      `Adding site failed on BE with error: ${err}`,
      500
    );
    return next(error);
  }
};

const deleteSite = async (req, res, next) => {
  const sql = `DELETE FROM sites WHERE id = ${req.params.siteId}`;
  try {
    const [rows, _] = await pool.execute(sql);

    console.log(`Deleted site with id ${req.params.siteId}`);
    res.status(200).json({ sites: rows });
  } catch (err) {
    const error = new HttpError(
      `Deleting site failed on BE with error: ${err}`,
      500
    );
    return next(error);
  }
};

const editSite = async (req, res, next) => {
  const {
    name,
    hosting_address,
    hosting_login,
    hosting_pass,
    hosting_exp_date,
    domain_address,
    domain_login,
    domain_pass,
    domain_exp_date,
    comments,
  } = req.body;

  const sql = `UPDATE sites SET
    name = ?, 
    hosting_address = ?, 
    hosting_login = ?, 
    hosting_pass = ?, 
    hosting_exp_date = ?, 
    domain_address = ?, 
    domain_login = ?, 
    domain_pass = ?, 
    domain_exp_date = ?, 
    comments = ? 
    WHERE id = ?`;

  const values = [
    name,
    hosting_address,
    hosting_login,
    hosting_pass,
    dateFormaterToSql(hosting_exp_date),
    domain_address,
    domain_login,
    domain_pass,
    dateFormaterToSql(domain_exp_date),
    comments,
    req.params.siteId,
  ];

  try {
    const [rows, _] = await pool.execute(sql, values);

    console.log(
      `Edited site with id ${req.params.siteId} and name: ${req.body.name}`
    );
    res.status(200).json({ sites: rows });
  } catch (err) {
    const error = new HttpError(
      `Editing site failed on BE with error: ${err}`,
      500
    );
    return next(error);
  }
};

const getNextExpiration = async (req, res, next) => {
  const sql = `SELECT name, hosting_exp_date, domain_exp_date FROM sites`;
  try {
    const [rows, _] = await pool.execute(sql);

    const result = calculateNextExpiration(rows);
    console.log('GET NEXT - result', result);

    res.status(200).json({ nextExpiration: result });
  } catch (err) {
    const error = new HttpError('Fetching expiration info failed on BE', 500);
    return next(error);
  }
};

export { getSites, addSite, deleteSite, editSite, getNextExpiration };
