INSERT INTO todo (title, completed, created_at, updated_at)
SELECT 'Pregledati danasnje zadatke', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM todo WHERE title = 'Pregledati danasnje zadatke');

INSERT INTO todo (title, completed, created_at, updated_at)
SELECT 'Dodati prvi pravi zadatak', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM todo WHERE title = 'Dodati prvi pravi zadatak');

INSERT INTO todo (title, completed, created_at, updated_at)
SELECT 'Isprobati filtere', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM todo WHERE title = 'Isprobati filtere');
