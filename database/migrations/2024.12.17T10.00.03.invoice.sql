-- public.invoice definition

-- Drop table

-- DROP TABLE public.invoice;

CREATE TABLE public.invoice (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	amount varchar NOT NULL,
	created_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	updated_at timestamp DEFAULT 'now'::text::timestamp(6) with time zone NOT NULL,
	trip_id int4 NULL,
	CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY (id),
	CONSTRAINT "REL_b86ac4c109848bc8807d91b8af" UNIQUE (trip_id)
);


-- public.invoice foreign keys

ALTER TABLE public.invoice ADD CONSTRAINT "FK_b86ac4c109848bc8807d91b8afd" FOREIGN KEY (trip_id) REFERENCES public.trip(id);