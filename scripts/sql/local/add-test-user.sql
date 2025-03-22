INSERT INTO "users" ("userId", "email", "passwordHash") VALUES (1, 'test@test.com', '$2b$10$NEbLV6w7EZyw08xJUcqvYe9V4gKucChXhL1dslMSsPCItvpJxnqgC'); -- password: test
INSERT INTO "userRoles" ("userId", "roleId") VALUES (1, 1);
INSERT INTO "userRoles" ("userId", "roleId") VALUES (1, 2);
