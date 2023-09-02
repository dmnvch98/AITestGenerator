CREATE TABLE tests (
                       id SERIAL PRIMARY KEY,
                       user_id INT REFERENCES users(id),
                       title VARCHAR(255) NOT NULL
);
CREATE TABLE chapters (
                          id SERIAL PRIMARY KEY,
                          user_id INT REFERENCES users(id),
                          title VARCHAR(255) NOT NULL,
                          text_id  INT REFERENCES texts(id)
);

ALTER TABLE tests ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE chapters ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE chapters ADD FOREIGN KEY (text_id) REFERENCES texts(id);


ALTER TABLE tests ADD COLUMN chapter_id int references chapters(id);
ALTER TABLE tests ADD FOREIGN KEY (chapter_id) REFERENCES chapters(id);

ALTER TABLE chapters ADD COLUMN test_id int references tests(id);
ALTER TABLE chapters ADD FOREIGN KEY (test_id) REFERENCES tests(id);





