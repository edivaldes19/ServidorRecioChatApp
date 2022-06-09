/**********USERS**********/
CREATE TABLE users(
	id BIGINT PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	notification_token VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	id_socket VARCHAR(255) NULL,
	online BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

SELECT
	id,
	email,
	name,
	lastname,
	phone,
	image,
	session_token,
	notification_token
FROM
	users
WHERE
	id != $ 1;

SELECT
	id,
	email,
	name,
	lastname,
	image,
	phone,
	password,
	session_token
FROM
	users
WHERE
	id = $ 1;

SELECT
	U.id,
	U.email,
	U.name,
	U.lastname,
	U.image,
	U.phone,
	U.password,
	U.session_token
FROM
	users AS U
WHERE
	U.email = $ 1
GROUP BY
	U.id;

INSERT INTO
	users(
		email,
		name,
		lastname,
		phone,
		image,
		password,
		created_at,
		updated_at
	)
VALUES
	($ 1, $ 2, $ 3, $ 4, $ 5, $ 6, $ 7, $ 8) RETURNING id;

SELECT
	online,
	id_socket
FROM
	users
WHERE
	id = $ 1;

UPDATE
	users
SET
	name = $ 2,
	lastname = $ 3,
	phone = $ 4,
	image = $ 5,
	updated_at = $ 6
WHERE
	id = $ 1;

UPDATE
	users
SET
	notification_token = $ 2
WHERE
	id = $ 1;

UPDATE
	users
SET
	online = $ 2
WHERE
	id = $ 1;

UPDATE
	users
SET
	online = $ 2
WHERE
	id_socket = $ 1;

UPDATE
	users
SET
	id_socket = $ 2
WHERE
	id = $ 1;

/**********CHATS**********/
CREATE TABLE chats(
	id BIGINT PRIMARY KEY,
	id_user1 BIGINT NOT NULL,
	id_user2 BIGINT NOT NULL,
	timestamp BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user1) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(id_user2) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT
	C.id AS id,
	C.id_user1,
	C.id_user2,
	C.timestamp,
	U1.name AS name_user1,
	U1.lastname AS lastname_user1,
	U1.email AS email_user1,
	U1.image AS image_user1,
	U1.phone AS phone_user1,
	U1.notification_token AS notification_token_user1,
	U2.name AS name_user2,
	U2.lastname AS lastname_user2,
	U2.email AS email_user2,
	U2.image AS image_user2,
	U2.phone AS phone_user2,
	U2.notification_token AS notification_token_user2,
	(
		SELECT
			message
		FROM
			messages AS M
		WHERE
			M.id_chat = C.id
		ORDER BY
			M.timestamp DESC
		LIMIT
			1
	) AS last_message,
	(
		SELECT
			COUNT(*)
		FROM
			messages AS M
		WHERE
			M.id_chat = C.id
			AND (
				(
					M.status = 'ENVIADO'
					OR M.status = 'RECIBIDO'
				)
				AND M.id_receiver = $ 1
			)
	) AS unread_message,
	(
		SELECT
			timestamp
		FROM
			messages AS M
		WHERE
			M.id_chat = C.id
		ORDER BY
			M.timestamp DESC
		LIMIT
			1
	) AS last_message_timestamp
FROM
	chats AS C
	INNER JOIN users AS U1 ON U1.id = C.id_user1
	INNER JOIN users AS U2 ON U2.id = C.id_user2
WHERE
	(
		id_user1 = $ 1
		OR id_user2 = $ 1
	)
	AND (
		SELECT
			COUNT(*)
		FROM
			messages AS M
		WHERE
			M.id_chat = C.id
	) > 0
ORDER BY
	last_message_timestamp DESC;

SELECT
	id,
	id_user1,
	id_user2,
	timestamp
FROM
	chats
WHERE
	(
		id_user1 = $ 1
		AND id_user2 = $ 2
	)
	OR (
		id_user1 = $ 2
		AND id_user2 = $ 1
	);

INSERT INTO
	chats(
		id_user1,
		id_user2,
		timestamp,
		created_at,
		updated_at
	)
VALUES
	($ 1, $ 2, $ 3, $ 4, $ 5) RETURNING id;

UPDATE
	chats
SET
	id = $ 1,
	id_user1 = $ 2,
	id_user2 = $ 3,
	timestamp = $ 4,
	updated_at = $ 5
WHERE
	id = $ 1;

/**********MESSAGES**********/
CREATE TABLE messages(
	id BIGINT PRIMARY KEY,
	message TEXT NOT NULL,
	url VARCHAR(255) NULL,
	is_image BOOLEAN DEFAULT FALSE,
	is_video BOOLEAN DEFAULT FALSE,
	id_sender BIGINT NOT NULL,
	id_receiver BIGINT NOT NULL,
	id_chat BIGINT NOT NULL,
	status VARCHAR(50) NOT NULL,
	timestamp BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_sender) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(id_receiver) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(id_chat) REFERENCES chats(id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT
	id,
	message,
	id_sender,
	id_receiver,
	id_chat,
	timestamp,
	status,
	is_image,
	is_video,
	url
FROM
	messages
WHERE
	id_chat = $ 1
ORDER BY
	timestamp DESC;

INSERT INTO
	messages(
		message,
		id_sender,
		id_receiver,
		id_chat,
		status,
		url,
		is_image,
		is_video,
		timestamp,
		created_at,
		updated_at
	)
VALUES
	(
		$ 1,
		$ 2,
		$ 3,
		$ 4,
		$ 5,
		$ 6,
		$ 7,
		$ 8,
		$ 9,
		$ 10,
		$ 11
	) RETURNING id;

UPDATE
	messages
SET
	status = 'VISTO',
	updated_at = $ 2
WHERE
	id = $ 1;