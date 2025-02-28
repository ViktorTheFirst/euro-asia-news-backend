import pool from '../DB/db-connect.js';

class Site {
  constructor(props = {}) {
    this.name = props.name;
  }

  async fetch() {
    // TODO add try catch here to log sql errors
    const sql = `SELECT * FROM test_sites`;
    const [result, _] = await pool.execute(sql);

    console.log('result in Sites', result);
    return result;
  }
}

export { Site };
