CREATE TABLE chapters (
                          id SERIAL PRIMARY KEY,
                          user_id INT REFERENCES users(id),
                          title VARCHAR(255) NOT NULL,
                          text_id  INT REFERENCES texts(id)
);
ALTER TABLE chapters ADD FOREIGN KEY (text_id) REFERENCES texts(id);
