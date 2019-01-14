
CREATE SCHEMA bizzbee;
SET SCHEMA 'bizzbee';


CREATE TABLE _apiculteur (
	id		SERIAL 		PRIMARY KEY,
	login		VARCHAR(30)	NOT NULL,
	mdp		VARCHAR(60)	NOT NULL
);

CREATE TABLE _administrateur (
	id 		INT 		PRIMARY KEY
);

CREATE TABLE _composant (
	id		SERIAL		PRIMARY KEY,
	nom		VARCHAR(50)	NOT NULL,
	date_creation	TIMESTAMP	NOT NULL,
	id_parent	INT,
	id_proprio	INT		NOT NULL
);


CREATE TABLE _permission (
	id_apiculteur	INT,
	id_composant	INT
);



CREATE TABLE _ruche (
	id		INT 		PRIMARY KEY
);

CREATE TABLE _rucher (
	id		INT		PRIMARY KEY
);

CREATE TABLE _temperature (
	id		SERIAL 		PRIMARY KEY,
	val		NUMERIC(5, 2)	NOT NULL,
	date_mesure	TIMESTAMP	NOT NULL,
	id_ruche	INT		NOT NULL
);

CREATE TABLE _poids (
	id		SERIAL		PRIMARY KEY,
	val		NUMERIC(5, 2)	NOT NULL,
	date_mesure	TIMESTAMP	NOT NULL,
	id_ruche	INT		NOT NULL
);

CREATE TABLE _humidite (
	id		SERIAL		PRIMARY KEY,
	val		NUMERIC(5, 2)	NOT NULL,
	date_mesure	TIMESTAMP	NOT NULL,
	id_ruche	INT		NOT NULL
);


CREATE OR REPLACE FUNCTION composant_supp() RETURNS TRIGGER as $$
DECLARE
	child record;
BEGIN
	FOR child IN SELECT * FROM _composant WHERE id_parent = OLD.id LOOP
		DELETE FROM _composant WHERE id = child.id;
	END LOOP;

	RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER supp_composant
AFTER DELETE
ON _composant
FOR EACH ROW
EXECUTE PROCEDURE composant_supp();



ALTER TABLE _humidite ADD CONSTRAINT _humidite_fk1 FOREIGN KEY
	(id_ruche) REFERENCES _ruche(id) ON DELETE CASCADE;
ALTER TABLE _humidite ADD CONSTRAINT _humidite_chk CHECK (val >= 0);
ALTER TABLE _poids ADD CONSTRAINT _poids_fk1 FOREIGN KEY
	(id_ruche) REFERENCES _ruche(id) ON DELETE CASCADE;
ALTER TABLE _poids ADD CONSTRAINT _poids_chk CHECK (val >= 0);
ALTER TABLE _temperature ADD CONSTRAINT _temperature_fk1 FOREIGN KEY
	(id_ruche) REFERENCES _ruche(id) ON DELETE CASCADE;
ALTER TABLE _rucher ADD CONSTRAINT _rucher_fk1 FOREIGN KEY
	(id) REFERENCES _composant(id) ON DELETE CASCADE;
ALTER TABLE _ruche ADD CONSTRAINT _ruche_fk_1 FOREIGN KEY
	(id) REFERENCES _composant(id) ON DELETE CASCADE;
ALTER TABLE _permission  ADD CONSTRAINT _permission_pk PRIMARY KEY (id_apiculteur, id_composant);
	
ALTER TABLE _permission ADD CONSTRAINT _permission_fk1 FOREIGN KEY
		(id_apiculteur) REFERENCES _apiculteur(id) ON DELETE CASCADE;
ALTER TABLE _permission ADD CONSTRAINT _permission_fk2 FOREIGN KEY
		(id_composant) REFERENCES _composant(id) ON DELETE CASCADE;

ALTER TABLE _administrateur ADD CONSTRAINT _administrateur_fk1 FOREIGN KEY
		(id) REFERENCES _apiculteur(id) ON DELETE CASCADE;
ALTER TABLE _composant ADD CONSTRAINT _composant_fk1 FOREIGN KEY
		(id_parent) REFERENCES _rucher(id) ON DELETE CASCADE;
ALTER TABLE _composant ADD CONSTRAINT _composant_fk2 FOREIGN KEY
		(id_proprio) REFERENCES _apiculteur(id) ON DELETE CASCADE;

ALTER TABLE _composant ADD CONSTRAINT _composant_chk CHECK (id <> id_parent);




SELECT * from _administrateur


