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

CREATE TABLE category(
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE product(
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price int NOT NULL,
    thumbnail VARCHAR(255),
    code VARCHAR(255) NOT NULL,
    stock int NOT NULL,
    status VARCHAR(20) NOT NULL,
    category_id int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(category_id) REFERENCES category(id)
);

CREATE TABLE bill (
    id int NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(200) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total int NOT NULL,
    product_details JSON DEFAULT NULL,
    created_by VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);