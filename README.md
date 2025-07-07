# egzas

Kad paleisti programa reikia:
nueiti i backend kataloga:

1. npm i
2. npm start

tuomet pasileidzia backend aplikacija

naudojant ivairius endpointus yra galima:

kaip paprastas USER vartotojas:
prisijunti/atsijungti/prisiregistruoti

uzsiregistruoti arbe atsaukti ivairias proceduras
ivertinti proceduras

kaip ADMIN tipo vartotojas as gali:
matyti visus vartotojus
Ju registracijas su galimybe atsaukti/priimti jas

Gali sukurti/redaguoti/istrinti proceduras

DUOMENU BAZE
------------------------

```sql
-- Users table: Stores user information with roles (user or admin)
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    passwd VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL
);

-- Appointments table: Stores appointment details
CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    img_url VARCHAR(255),
    duration_minutes INTEGER NOT NULL,
    category VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_by INTEGER REFERENCES Users(id)
);

-- AppointmentDates table: Stores available dates for appointments
CREATE TABLE AppointmentDates (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES Appointments(id),
    date DATE NOT NULL
);

-- AppointmentRegistrations table: Tracks user registrations for appointment dates
CREATE TABLE AppointmentRegistrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    appointment_date_id INTEGER REFERENCES AppointmentDates(id),
    status VARCHAR(10) CHECK (status IN ('pending', 'approved')) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
