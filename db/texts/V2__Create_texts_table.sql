CREATE TABLE texts
(
    id      SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    title   VARCHAR(255) NOT NULL,
    content TEXT         NOT NULL
);
ALTER TABLE texts
    ADD FOREIGN KEY (user_id) REFERENCES users (id);