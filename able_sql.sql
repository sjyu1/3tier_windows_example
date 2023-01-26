-- create database
CREATE DATABASE able_db;

-- create table
create table member2
(
idx int IDENTITY(1,1) primary key,
userid varchar(255) not null,
password varchar(255) not null,
email text null,
salt varchar(255) null
);