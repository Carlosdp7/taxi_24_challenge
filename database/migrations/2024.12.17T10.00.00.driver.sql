-- public.driver definition

-- Drop table

-- DROP TABLE public.driver;

CREATE TABLE public.driver (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" varchar NOT NULL,
	car_brand varchar NOT NULL,
	car_color varchar NOT NULL,
	car_plate varchar NOT NULL,
	is_available bool DEFAULT true NOT NULL,
	latitude varchar NOT NULL,
	longitude varchar NOT NULL,
	created_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	updated_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY (id)
);