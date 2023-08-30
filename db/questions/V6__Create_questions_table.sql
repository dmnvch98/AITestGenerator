CREATE TABLE questions (
                           id SERIAL PRIMARY KEY,
                           test_id INT REFERENCES tests(id),
                           question_text TEXT NOT NULL
);
ALTER TABLE questions ADD FOREIGN KEY (test_id) REFERENCES tests(id);
