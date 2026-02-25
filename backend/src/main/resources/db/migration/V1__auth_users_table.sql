CREATE TABLE auth_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,

    role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',

    CONSTRAINT uk_auth_users_email UNIQUE (email),
    CONSTRAINT uk_auth_users_username UNIQUE (username),
    CONSTRAINT uk_auth_users_mobile UNIQUE (mobile_number)
);


