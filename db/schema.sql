### Schema

CREATE DATABASE secure;

USE secure;

CREATE TABLE users
(
	id int(11) AUTO_INCREMENT NOT NULL,
	username VARCHAR(15) NOT NULL UNIQUE,
	email VARCHAR(50 ) NOT NULL UNIQUE,
	passcode BINARY(20) NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	PRIMARY KEY (id) 
);

CREATE TABLE Posts
(
	id int NOT NULL AUTO_INCREMENT,
	email varchar(255) NOT NULL,
	title varchar(50) NOT NULL,
	body text(50) NOT NULL,
	blogPost varchar(255) NOT NULL,
	categoty varchar(20),
	createdAt CHAR(10),
	updatedAt CHAR(10)
);
