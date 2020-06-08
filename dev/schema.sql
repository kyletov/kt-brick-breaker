drop table appuser cascade;
drop table userprofile cascade;
drop table gamestats cascade;

create table appuser (
	userid varchar(50) primary key,
	password varchar
);

create table userprofile (
	userid varchar(50) primary key,
	password varchar,
	fname varchar(50),
	lname varchar(50),
	gender varchar(50),
	age integer,
	bio varchar(250),
	foreign key(userid) references appuser(userid)
);

create table gamestats (
	userid varchar(50),
	score integer,
	foreign key(userid) references userprofile(userid)
);

insert into appuser values('auser', 'apassword');
