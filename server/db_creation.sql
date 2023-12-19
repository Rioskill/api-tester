create table TestGroup (
	id integer unique generated always as identity,
	name varchar
);

create table Test (
	id integer unique generated always as identity,
	group_id integer references TestGroup(id) on delete cascade,
	name varchar,
	method varchar,
	target_url varchar,
	request_body varchar,
	expected_response_body varchar,
	expected_status integer
);

create table TestParam (
	id integer unique generated always as identity,
	test_id integer references Test(id),
	name varchar,
	value varchar
);

create table TestReport (
	id integer unique generated always as identity,
	test_id integer not null references Test(id),
	created_at timestamp default now(),
	response_body varchar,
	status integer
);

insert into Test 
(name, method, target_url, request_body, expected_response_body, expected_status)
values
('test_2', 'GET', 'locahost:3001/calc2', '', '', 404)
returning id

truncate table test cascade

select * from Test

insert into TestParam
(test_id, name, value)
values
(2, 'a', '1'),
(2, 'b', '3')

select name, value from testparam where test_id = 2

select * from testparam

select * from test

insert into testparam
(test_id, name, value)
values

update test
set
	name = 'test_3',
	method = 'GET',
	target_url = 'locahost:3001/calc',
	request_body = 'a',
	expected_response_body = '{sum:4}',
	expected_status = 201,
	group_id = null
where id = 2

select name, value from testparam where test_id = 2


select * from testgroup

insert into testgroup (name) values ('group 1') returning id

select * from testreport

insert into testreport
(test_id, response_body, status)
values
(2, '{sum:4}', 200)







