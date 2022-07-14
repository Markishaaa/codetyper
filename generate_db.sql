create table user
(
    username      varchar(50) not null primary key,
    email         varchar(50) not null primary key,
    role          enum('ADMIN', 'USER') not null,
    password_hash tinytext    not null,
    created_at    datetime    not null
);