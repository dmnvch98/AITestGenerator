CREATE TABLE test_results
(
    id               BIGINT PRIMARY KEY DEFAULT nextval('test_results_id_seq'),
    user_id          BIGINT    NOT NULL,
    test_id          BIGINT    NOT NULL,
    data             JSONB     NOT NULL,
    test_passed_time timestamp NOT NULL,
    test             TEXT      NOT NULL
);
ALTER TABLE test_results
    ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE test_results
    ADD FOREIGN KEY (test_id) REFERENCES tests (id);
