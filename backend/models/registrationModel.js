const { sql } = require("../dbConnection");

class Registration {
  static async create({ userId, appointmentDateId }) {
    const [registration] = await sql`
      INSERT INTO "AppointmentRegistrations" (user_id, appointment_date_id, status)
      VALUES (${userId}, ${appointmentDateId}, 'pending')
      RETURNING *
    `;
    return registration;
  }

  static async getAll() {
    return sql`
      SELECT ar.*, u.name, u.email
      FROM "AppointmentRegistrations" ar
      JOIN users u ON ar.user_id = u.id
    `;
  }

  static async getByAppointmentId(appointmentId) {
    return sql`
      SELECT ar.*, u.name, u.email, ad.date
      FROM "AppointmentRegistrations" ar
      JOIN "AppointmentDates" ad ON ar.appointment_date_id = ad.id
      JOIN users u ON ar.user_id = u.id
      WHERE ad.appointment_id = ${appointmentId}
    `;
  }

  static async getByUserId(userId) {
    return sql`
      SELECT 
        ar.id, 
        ar.user_id, 
        ar.appointment_date_id, 
        ar.status, 
        ar.registered_at, 
        a.title, 
        a.category, 
        a.price, 
        a.duration_minutes, 
        ad.date
      FROM "AppointmentRegistrations" ar
      JOIN "AppointmentDates" ad ON ar.appointment_date_id = ad.id
      JOIN "Appointments" a ON ad.appointment_id = a.id
      WHERE ar.user_id = ${userId}
      ORDER BY ad.date ASC
    `;
  }

  static async updateStatus(registrationId, status) {
    const [registration] = await sql`
      UPDATE "AppointmentRegistrations"
      SET status = ${status}
      WHERE id = ${registrationId}
      RETURNING *
    `;
    return registration;
  }

  static async updateDate(registrationId, appointmentDateId) {
    const [registration] = await sql`
      UPDATE "AppointmentRegistrations"
      SET appointment_date_id = ${appointmentDateId}, status = 'pending'
      WHERE id = ${registrationId}
      RETURNING *
    `;
    return registration;
  }

  static async delete(registrationId) {
    await sql`DELETE FROM "AppointmentRegistrations" WHERE id = ${registrationId}`;
  }

  static async getById(registrationId) {
    const [registration] = await sql`
      SELECT * FROM "AppointmentRegistrations" WHERE id = ${registrationId}
    `;
    return registration;
  }
}

module.exports = Registration;
