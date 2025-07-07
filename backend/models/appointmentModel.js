const { sql } = require("../dbConnection");

class Appointment {
  static async getAll() {
    return sql`
      SELECT a.*, 
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM Appointments a
      LEFT JOIN Reviews r ON a.id = r.appointment_id
      GROUP BY a.id
    `;
  }

  static async getById(id) {
    const [appointment] =
      await sql`SELECT * FROM Appointments WHERE id = ${id}`;
    if (appointment) {
      appointment.dates = await sql`
        SELECT id, date FROM AppointmentDates 
        WHERE appointment_id = ${id}
        ORDER BY date ASC
      `;
    }
    return appointment;
  }

  static async create({
    title,
    img_url,
    duration_minutes,
    price,
    category,
    dates,
  }) {
    const [appointment] = await sql`
      INSERT INTO Appointments (title, img_url, duration_minutes, price, category)
      VALUES (${title}, ${img_url}, ${duration_minutes}, ${price}, ${category})
      RETURNING *
    `;

    await Promise.all(
      dates.map(
        (d) =>
          sql`INSERT INTO AppointmentDates (appointment_id, date) VALUES (${appointment.id}, ${d})`
      )
    );

    return appointment;
  }

  static async update(
    id,
    { title, img_url, duration_minutes, price, category, dates }
  ) {
    await sql.begin(async (sql) => {
      const [updatedAppointment] = await sql`
        UPDATE Appointments
        SET 
          title = ${title},
          img_url = ${img_url},
          duration_minutes = ${duration_minutes},
          price = ${price},
          category = ${category}
        WHERE id = ${id}
        RETURNING *;
      `;

      if (!updatedAppointment) throw new Error("Appointment not found");

      if (dates) {
        const newDates = dates.map((d) => new Date(d).toISOString());
        await sql`
          DELETE FROM AppointmentDates 
          WHERE appointment_id = ${id}
          AND date NOT IN ${sql(newDates)}
          AND id NOT IN (
            SELECT appointment_date_id FROM AppointmentRegistrations 
            WHERE appointment_date_id IN (
              SELECT id FROM AppointmentDates WHERE appointment_id = ${id}
            )
          )
        `;

        const existingDates =
          await sql`SELECT date FROM AppointmentDates WHERE appointment_id = ${id}`;
        const existingDateStrings = existingDates.map((d) =>
          d.date.toISOString()
        );
        const datesToInsert = newDates.filter(
          (d) => !existingDateStrings.includes(d)
        );

        for (const date of datesToInsert) {
          await sql`INSERT INTO AppointmentDates (appointment_id, date) VALUES (${id}, ${date})`;
        }
      }

      return updatedAppointment;
    });

    return this.getById(id);
  }

  static async delete(id) {
    await sql`DELETE FROM AppointmentDates WHERE appointment_id = ${id}`;
    const [deleted] =
      await sql`DELETE FROM Appointments WHERE id = ${id} RETURNING *`;
    return deleted;
  }
}

module.exports = Appointment;
