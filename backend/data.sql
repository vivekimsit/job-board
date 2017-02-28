
insert into users (id, created_at, name) values
	(1, '2015-01-13 15:30', 'Mark'),
	(2, '2015-01-13 15:30', 'John'),
	(3, '2016-01-01 10:30', 'Melinda'),
	(4, '2016-01-17 23:30', 'Carl'),
	(5, '2016-02-02 16:30', 'Tim'),
	(6, '2016-02-02 16:30', 'Jessica')
;

insert into companies (id, created_at, name) values
	(1, '2015-01-13 15:00', 'Facewall'),
	(2, '2015-01-17 15:00', 'Carl & Co')
;

insert into teams (company_id, user_id, contact_user) values
	(1, 1, TRUE),
	(2, 3, FALSE),
	(2, 4, TRUE)
;

insert into listings (id, created_at, created_by, name, description) values
	(1, '2015-01-15 11:00', 1, 'Join us conquering the world!', 'This is your best chance to be on the right side of the equation...')
;

insert into listings (id, created_at, created_by, name, description) values
	(1, '2015-01-15 11:00', 1, 'Join us conquering the world!', 'This is your best chance to be on the right side of the equation...')
;

insert into listings (id, created_at, created_by, name, description) values
	(2, '2017-01-29 11:00', 1, 'Join us conquering the world!', 'Holla ho')
;

insert into listings (id, created_at, created_by, name, description) values
	(3, '2017-01-15 11:00', 1, 'Join us conquering the world!', 'Hey ya')
;

insert into applications (created_at, user_id, listing_id, cover_letter) values
	('2017-02-23 12:00', 2, 1, 'Hello, ...')
;

INSERT INTO APPLICATIONS (CREATED_AT, USER_ID, LISTING_ID, COVER_LETTER) VALUES
	('2017-02-24 12:00', 2, 2, 'HELLO, ...')
;

INSERT INTO APPLICATIONS (CREATED_AT, USER_ID, LISTING_ID, COVER_LETTER) VALUES
	('2017-02-22 12:00', 2, 2, 'HELLO, ...')
;

INSERT INTO APPLICATIONS (CREATED_AT, USER_ID, LISTING_ID, COVER_LETTER) VALUES
	('2017-02-25 12:00', 3, 1, 'HELLO, ...')
;
