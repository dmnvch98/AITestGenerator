INSERT INTO users (email, password, role, first_name, last_name)
VALUES ('user1@example.com', 'password1', 'USER', 'firstName', 'lastName'),
       ('user1@example.com', 'password2', 'USER', 'firstName', 'lastName'),
       ('user3@example.com', 'password3', 'USER', 'firstName', 'lastName');
INSERT INTO texts (user_id, content, title)
VALUES (1, 'Text for Chapter 1', 'title'),
       (2, 'Text for Chapter 2', 'title'),
       (3, 'Text for Chapter 3', 'title'),
       (1, 'Text for Chapter 4', 'title'),
       (2, 'Text for Chapter 5', 'title');

INSERT INTO tests (user_id, title, text_id)
VALUES (1, 'Test 1', 1),
       (1, 'Test 2', 2),
       (2, 'Test 1', 3),
       (2, 'Test 2', 4),
       (3, 'Test 1', 5);

