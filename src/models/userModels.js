import pool from '../config/database.js';

class User {
  static async create(userData) {
    const {
      name,
      email,
      password
    } = userData;
    const query = `
      INSERT INTO users (email, password, role, avatar_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, password, created_at
    `;
    const values = [email, password, avatar_url];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, avatar_url, created_at, updated_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(id, updateData) {
    const {
      name,
      email,
      profile_picture
    } = updateData;
    const query = `
      UPDATE users 
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          profile_picture = COALESCE($3, profile_picture),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, email, profile_picture, updated_at
    `;
    const values = [name, email, profile_picture, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }
}

export default User;