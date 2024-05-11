CREATE TABLE answer_options (
                                id BIGINT PRIMARY KEY,
                                question_id BIGINT REFERENCES questions(id),
                                option_text TEXT NOT NULL,
                                is_correct BOOLEAN NOT NULL
);

ALTER TABLE answer_options ADD FOREIGN KEY (question_id) REFERENCES questions(id);
