-- Create table User

CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(20),
    role VARCHAR(20),
    PRIMARY KEY (id),
    UNIQUE (email)
);

-- Create User Admin

INSERT INTO user (name, contact_number, email, password, status, role) VALUES (
    'Admin',
    '1234567890',
    'admin@admin.com',
    'admin',
    'true',
    'admin'
);