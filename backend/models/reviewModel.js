const { sql } = require("../dbConnection");

class Review {
  static async create({ userId, appointmentId, rating, comment }) {
    const [review] = await sql`
      INSERT INTO Reviews (user_id, appointment_id, rating, comment)
      VALUES (${userId}, ${appointmentId}, ${rating}, ${comment})
      RETURNING *
    `;
    return review;
  }

  static async getAll() {
    return sql`SELECT * FROM Reviews`;
  }

  static async getByAppointmentId(appointmentId) {
    return sql`SELECT * FROM Reviews WHERE appointment_id = ${appointmentId}`;
  }

  static async exists(userId, appointmentId) {
    const [review] = await sql`
      SELECT id FROM Reviews
      WHERE user_id = ${userId} AND appointment_id = ${appointmentId}
    `;
    return !!review;
  }
}

module.exports = Review;
