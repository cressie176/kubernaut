START TRANSACTION;

INSERT INTO registry (id, name, created_on, created_by) VALUES
  ('00000000-0000-0000-0000-000000000000', 'default', now(), '00000000-0000-0000-0000-000000000000')
ON CONFLICT(id) DO NOTHING;

COMMIT;
