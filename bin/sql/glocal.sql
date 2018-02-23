
CREATE TABLE engineer(
	engId int  unique PRIMARY KEY NOT NULL,
	department varchar(50) NOT NULL,
	firstName varchar(50) NOT NULL,
	lastName varchar(50) NOT NULL
);

CREATE TABLE vendor(
	principal varchar(50) unique NOT NULL
);

CREATE TABLE client(
	accountName varchar(50) PRIMARY KEY NOT NULL,
	priorityClient boolean NOT NULL, 
	dateExpired date NOT NULL,
	activeContract boolean NOT NULL,
	contactEmail varchar(50),
	contactNumber int,
	noCases int NOT NULL
);

CREATE TABLE products(
	productName varchar(50) PRIMARY KEY NOT NULL,
	productLine varchar(50) unique NOT NULL,	
	vendor varchar(50) references vendor(principal) NOT NULL,
	category varchar(50) NOT NULL
);

CREATE TABLE license(
	product varchar(50) references products(productName) NOT NULL,
	license varchar(200) NOT NULL
);

CREATE TABLE contact_person(
	client varchar(50) references client(accountName) NOT NULL,
	personName varchar(50) unique NOT NULL
);

CREATE TABLE case_monitoring(
	glocalId serial unique PRIMARY KEY NOT NULL,
    vendorCaseId varchar(50),
	dateIdCreated date NOT NULL, 
	dateRaised date NOT NULL,
	caseTitle varchar(50) NOT NULL,
	caseDescription varchar(100) NOT NULL,
	severity int NOT NULL,
	vendor varchar(50) NOT NULL,
	customer varchar(50) references client(accountName) NOT NULL,
	productLine varchar(50) references products(productLine) NOT NULL,
	customerName varchar(50) NOT NULL,
	systemsEngineerLead varchar(50),
	assignedAccountManager varchar(50) NOT NULL,
	assignedSystemsEngineer text[][] NOT NULL
);

CREATE TABLE activities(
	trackingNo int references case_monitoring(glocalId) NOT NULL,
	timeIn timestamp NOT NULL, 
	timeOuts timestamp NOT NULL,
	productCode varchar(50) references products(productLine) NOT NULL,
	client varchar(50) NOT NULL,
	contactCustomer varchar(50) references contact_person(personName) NOT NULL,
	addres varchar(50) NOT NULL, 
	typeOfActivity varchar(50) NOT NULL, 
	purposeOfVisit varchar(50) NOT NULL,
	activityPerformed varchar(250) NOT NULL,
	nextActivity varchar(250) NOT NULL,
	recommendations varchar(250),
	engid int references engineer(engId) NOT NULL,
	engineerName varchar(50),
	score int NOT NULL
);

INSERT INTO engineer(engId, department, firstName, lastName)
VALUES 
(001,'Security','John','Jenkins'),
(002,'Availability','Isaiah','Solomon'),
(003, 'Security','Aaron','Hernandez');

INSERT INTO vendor(principal)
VALUES
('Symmantec'),
('Veritas');

INSERT INTO client(accountName, priorityClient, dateExpired, activeContract, contactEmail, contactNumber, noCases)
VALUES
('Unionbank', TRUE, '03/08/2019', TRUE, 'unionbank@gmail.com',854321, 1),
('BPI',FALSE,'06/25/2018',TRUE, 'bpi@gmail.com',123456, 0);

INSERT INTO products(productName, productLine, vendor, category)
VALUES
('Multi-Cloud','SFVVR','Veritas','Security'),
('Secure Web Gateway','JHTEY','Symmantec','Security');

INSERT INTO license(product, license)
VALUES
('Multi-Cloud','1yr warranty'),
('Secure Web Gateway','3 yrs warranty');

INSERT INTO contact_person(client, personName)
VALUES
('BPI','John Vincent'),
('Unionbank','John Karlo');

INSERT INTO case_monitoring(glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer)
VALUES
(2018-001,'2018-100','01/08/2018','01/07/2018','Attend to failure of backup','troubleshoot',1,'Veritas','Unionbank','SFVVR','John Karlo Tabios','Jefferson','Mei',ARRAY[['John Jenkins'],['Isaiah Solomon']]),
(2018-002,'2018-111','03/08/2018','03/07/2018','Fix server for backup','install updates',1,'Symmantec','BPI','JHTEY','John Vincent Agbayani','Jeffrey','Maan',ARRAY['Aaron Hernandez']);

INSERT INTO activities(trackingNo, timeIn, timeOuts, productCode, client,  contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations, engid, engineerName, score)
VALUES
(2018-001, '2018-01-08 12:24:00', '2018-01-08 15:05:00', 'SFVVR','Unionbank','John Karlo','unionbank','OnSite','troubleshoot','checked if modules are up to date','install updates', 'no recommendations',001,'Jenkins', 5),
(2018-002,'2018-03-08 13:32:00','2018-03-08 16:22:00', 'JHTEY','BPI', 'John Vincent', 'BPI','Remote','troubleshooting','check version of software','install updates',' no recommendations',003,'Hernandez',4);













