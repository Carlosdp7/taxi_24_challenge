-- public.passenger definition

-- Drop table

-- DROP TABLE public.passenger;

CREATE TABLE public.passenger (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" varchar NOT NULL,
	is_available bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	updated_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY (id)
);