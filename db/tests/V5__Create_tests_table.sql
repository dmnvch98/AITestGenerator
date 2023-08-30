CREATE TABLE tests (
                       id SERIAL PRIMARY KEY,
                       user_id INT REFERENCES users(id),
                       title VARCHAR(255) NOT NULL
);
ALTER TABLE tests ADD FOREIGN KEY (user_id) REFERENCES users(id);
