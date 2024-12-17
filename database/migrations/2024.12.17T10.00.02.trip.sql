-- public.trip definition

-- Drop table

-- DROP TABLE public.trip;

CREATE TABLE public.trip (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	is_completed bool DEFAULT false NOT NULL,
	lat_to varchar NOT NULL,
	lat_from varchar NOT NULL,
	lng_to varchar NOT NULL,
	lng_from varchar NOT NULL,
	created_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	updated_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	driver_id int4 NULL,
	passenger_id int4 NULL,
	CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY (id)
);


-- public.trip foreign keys

ALTER TABLE public.trip ADD CONSTRAINT "FK_3d9a53e115529549f9e8d974b52" FOREIGN KEY (passenger_id) REFERENCES public.passenger(id);
ALTER TABLE public.trip ADD CONSTRAINT "FK_f314f86bf8e02aff0cc32b5e271" FOREIGN KEY (driver_id) REFERENCES public.driver(id);