import pool from '../config/db.js';

class User {
  static async create(userData) {
    const {
      email,
      password,
      role = 'user'
    } = userData;
    const query = `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role
    `;
    const values = [email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, role, avatar_uri FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(id, updateData) {
    const {
      email,
      avatar_uri
    } = updateData;
    const query = `
      UPDATE users 
      SET email = COALESCE($1, email),
          avatar_uri = COALESCE($2, avatar_uri)
      WHERE id = $3
      RETURNING id, email, role, avatar_uri
    `;
    const values = [email, avatar_uri, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users 
      SET password = $1
      WHERE id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }
}

export default User;