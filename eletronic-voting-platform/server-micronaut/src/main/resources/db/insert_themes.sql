-- Certifique-se de habilitar a extensão uuid-ossp antes de usar
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inserir valores com UUIDs aleatórios
INSERT INTO "eletronicVoting".theme (id, theme)
VALUES
    (uuid_generate_v4(), 'Sports'),
    (uuid_generate_v4(), 'Education'),
    (uuid_generate_v4(), 'Politics'),
    (uuid_generate_v4(), 'Environment'),
    (uuid_generate_v4(), 'Technology'),
    (uuid_generate_v4(), 'Healthcare'),
    (uuid_generate_v4(), 'Economy'),
    (uuid_generate_v4(), 'Cultural'),
    (uuid_generate_v4(), 'Science'),
    (uuid_generate_v4(), 'Food'),
    (uuid_generate_v4(), 'Art'),
    (uuid_generate_v4(), 'Movies'),
    (uuid_generate_v4(), 'Music'),
    (uuid_generate_v4(), 'Video Games'),
    (uuid_generate_v4(), 'Others')
;
