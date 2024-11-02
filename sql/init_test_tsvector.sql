CREATE TABLE test_search_vectors (
                                     id bigserial PRIMARY KEY,
                                     test_id bigint REFERENCES tests(id) ON DELETE CASCADE,
                                     search_vector tsvector,
                                     language varchar(50)
);

INSERT INTO test_search_vectors (test_id, search_vector, language)
SELECT
    id,
    to_tsvector(coalesce(file_name, '') || ' ' || coalesce(title, '')),
    language
FROM tests;

CREATE OR REPLACE FUNCTION update_test_search_vector()
    RETURNS TRIGGER AS $$
BEGIN
DELETE FROM test_search_vectors WHERE test_id = NEW.id;

INSERT INTO test_search_vectors (test_id, search_vector, language)
VALUES (
           NEW.id,
           to_tsvector(
                   COALESCE(NULLIF(NEW.file_name, ''), '') || ' ' || COALESCE(NULLIF(NEW.title, ''), '')
           ),
           NEW.language
       );

RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS update_test_search_vector_trigger ON tests;

CREATE TRIGGER update_test_search_vector_trigger
    AFTER INSERT OR UPDATE ON tests
                        FOR EACH ROW EXECUTE FUNCTION update_test_search_vector();