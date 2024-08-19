import pool from '../DB/db-connect.js';
import getTodayDateForSql from '../utils/functions.js';

class User {
  constructor(props) {
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
  }
  async save() {
    const today = getTodayDateForSql();
    let sql = `
            INSERT INTO user(
                username,
                email,
                password,
                create_time,
                role
            )
                VALUES(
                 '${this.name}',
                 '${this.email}',
                 '${this.password}',
                 '${today}',
                 '${this.role}'
                );
        `;

    const [result, _] = await pool.execute(sql);

    // if user was inserted return the created id, otherwise undefined
    return result.insertId ?? undefined;
  }

  static findAll() {}
}

export { User };
