CREATE SCHEMA app;
ALTER SCHEMA app OWNER TO "admin";
ALTER USER "admin" SET search_path = app, public;

CREATE TABLE app.users(
  user_id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  cpf VARCHAR(11),
  phone_number VARCHAR(9),
  email VARCHAR(50) NOT NULL,
  cep VARCHAR(8),
  "password" VARCHAR(50) NOT NULL,
  active_ind BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

INSERT INTO app.users("name", cpf, DDI, DDD, phone_number, email, cep, "password") 
VALUES ('admin', '12345678901', '55', '11', '123456789', 'admin@admin.com.br', "$2b$10$Qcdjv2.iq2jhNm3LcafX/eXFAl3ecpgBom5yKdMBedJk0ZdA0LQqy");