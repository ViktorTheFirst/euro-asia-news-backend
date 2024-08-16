const { pool } = require('../DB/db-connect');
const { getTodayDateForSql } = require('../utils/functions');

class User {
  constructor(props) {
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
  }

  async save() {
    const today = getTodayDateForSql();
    console.log('today', today);
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
                )
        `;
    const newUser = pool.execute(sql);
    console.log('newUser', newUser);
    return newUser;
  }

  static findAll() {}
}

module.exports = User;
