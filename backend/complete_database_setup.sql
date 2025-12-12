================================================================================
-- HOSPITAL MANAGEMENT DATABASE - COMPLETE SETUP SCRIPT
-- Tables: Appointments, Doctors, Patients
-- Generated: December 12, 2025
-- This master script combines all database setup and configuration
================================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ========================================================
-- EXTENSIONS
-- ========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

-- ========================================================
-- FUNCTIONS
-- ========================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.appointments_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

ALTER FUNCTION public.appointments_set_updated_at() OWNER TO postgres;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- ========================================================
-- CONFIGURATION TABLE
-- ========================================================

-- Set admin secret key in a simple way (using a single-row config table)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Store the admin secret key hash
INSERT INTO config(key, value) 
VALUES ('admin_secret_hash', crypt('123$', gen_salt('bf')))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ========================================================
-- PATIENTS TABLE
-- ========================================================

CREATE TABLE public.patients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    contact text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.patients OWNER TO postgres;

-- Add constraint
ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);

-- Add index for contact
CREATE INDEX patients_contact_idx ON public.patients USING btree (contact);

-- ========================================================
-- DOCTORS TABLE
-- ========================================================

CREATE TABLE public.doctors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    phone text,
    qualification text,
    specialization text,
    department text,
    experience text,
    bio text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.doctors OWNER TO postgres;

-- Add constraints
ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_email_key UNIQUE (email);

-- Add index for email
CREATE INDEX doctors_email_idx ON public.doctors USING btree (email);

-- ========================================================
-- APPOINTMENTS TABLE
-- ========================================================

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    appointment_code text DEFAULT ('APT-'::text || substring(gen_random_uuid()::text, 1, 8)) NOT NULL,
    patient_id uuid NOT NULL,
    doctor_id uuid,
    problem text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    severity text,
    duration text,
    medical_history text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.appointments OWNER TO postgres;

-- Add constraints
ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_appointment_code_key UNIQUE (appointment_code);

-- Add indexes
CREATE INDEX appointments_patient_idx ON public.appointments USING btree (patient_id);
CREATE INDEX appointments_doctor_idx ON public.appointments USING btree (doctor_id);
CREATE INDEX appointments_code_idx ON public.appointments USING btree (appointment_code);

-- Add foreign keys
ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;

-- Add trigger
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.appointments_set_updated_at();

-- ========================================================
-- SAMPLE DATA - PATIENTS
-- ========================================================

INSERT INTO public.patients (id, name, contact, password_hash, created_at) VALUES
('f2f6401b-92a4-4d17-a133-7c3999a10ca6', 'Sara Rana', '03257192042', '$2b$12$mCrZZd.tXe.SUBPNwCPFNuGwXv.Jq1KYDrBFJKOqzcwUNl13XrIlO', '2025-12-10 20:27:57.394443+05'),
('40ac96af-7f19-41b9-8aab-561c04fab099', 'Muhammad Ahmed', '0300-1234567', '$2a$06$aPmZE.YIqJZrhqy0J.SLm.nu4IPpvWbswrmgicHg0Hu/LVrYuss.u', '2025-12-10 20:27:35.04641+05'),
('b00b0972-1bd4-45e5-a8b2-aa50bed0c7d7', 'Fatima Khan', '0311-2345678', '$2a$06$uPQGY/lxM/nLPU5vVrKMM.5sENLua/65y32NjYtEBBfb9zWCVMQeK', '2025-12-10 20:27:35.04641+05'),
('9da6af49-f265-4eb1-9121-0c28e2e33ea2', 'Zain Malik', '0322-3456789', '$2a$06$wyhOeQ7U7cJz5QAlK1QySO/bnx/72fxqGYXTr3hd96Nw2eNwZsgI6', '2025-12-10 20:27:35.04641+05'),
('707d945f-5527-45fa-966a-d8b2afe7935e', 'Ayesha Siddiqui', '0333-4567890', '$2a$06$dv0WLLI5AbTGNYjForpO9.SPQ2Iss6eQaSDcHb4/bQadTcUEpzH5u', '2025-12-10 20:27:35.04641+05'),
('738f7d0a-b601-4b9a-8b63-a8a324b6220a', 'Haris Rahman', '0344-5678901', '$2a$06$tep/OAckajiIThMDGvpqtejUBxKU0emXrEC4F7EjEX2BVX0Rj4nmi', '2025-12-10 20:27:35.04641+05')
ON CONFLICT DO NOTHING;

-- ========================================================
-- SAMPLE DATA - DOCTORS
-- ========================================================

INSERT INTO public.doctors (id, name, email, password_hash, phone, qualification, specialization, department, experience, bio, created_at) VALUES
('ed226719-18cd-41ec-bae7-9914d3e729bb', 'Ayesha Mehmood', 'amauua587453@gmail.com', '$2b$12$xBCgKUav2PdL3Uzo8JjqFuqOmEgVKxapbg2bHSYFBnE.HWjExaglO', NULL, 'MBBS', NULL, NULL, NULL, NULL, '2025-12-10 20:28:22.977177+05'),
('b0086c4f-1d08-4e8d-8350-54b6ef1b46b3', 'Bilal Hussain', 'bilal.hussain@clinic.com', '$2a$06$IagQHomZLEbvNT2TgWspEeeqkPIiZh58eEDAuP9NZA.DtjGd0Ac/S', '(555) 123-4567', 'MD, PhD', 'Cardiology', 'Cardiovascular Medicine', '15 years', 'Board-certified cardiologist with expertise in interventional procedures and heart failure management.', '2025-12-10 20:27:35.04641+05'),
('e69693ea-9893-41dc-992e-a8c2b918135e', 'Inaya Shah', 'inaya.shah@clinic.com', '$2a$06$HVK0ORK0YmWDYG2oYZXtbeAkoIQpORxDW5VHvYKcv.JejwB2QTR8G', '(555) 987-6543', 'MD', 'Neurology', 'Neurological Sciences', '12 years', 'Specializes in stroke care, epilepsy, and neurodegenerative diseases like Alzheimer''s.', '2025-12-10 20:27:35.04641+05'),
('e72691fc-622b-4386-91f4-4b68442deebe', 'Rayyan Ali', 'rayyan.ali@clinic.com', '$2a$06$n4mI/ixVkS8rvk3Sjhq6qeqhlXHQmMUCna7zODFALq6mHcYXBymI.', '(555) 456-7890', 'MD, MPH', 'Pediatrics', 'Pediatric Care', '10 years', 'Focuses on child development, vaccinations, and adolescent health with a public health background.', '2025-12-10 20:27:35.04641+05'),
('0923f100-d30e-49d0-a26e-fcf5dc73072e', 'Zoya Fatima', 'zoya.fatima@clinic.com', '$2a$06$.wfhPX7tkQPLOLGgHB4cge1nZ.rP8MA4L9giJzpJL5nj4bXeTWHHO', '(555) 321-0987', 'DO', 'Orthopedics', 'Orthopedic Surgery', '18 years', 'Expert in joint replacements, sports injuries, and minimally invasive arthroscopic surgery.', '2025-12-10 20:27:35.04641+05'),
('f2258c8b-7e6b-4173-9700-159c8c3ecc7e', 'Sana Iqbal', 'sana.iqbal@clinic.com', '$2a$06$EhL7siyUBA1y.DNm6oyEv.hpCQc/BkPZrWVZ9IFO/PO0rDOrZB.Mu', '(555) 654-3210', 'MD', 'Dermatology', 'Skin Health', '9 years', 'Treats a wide range of skin conditions including acne, eczema, and skin cancer screenings.', '2025-12-10 20:27:35.04641+05')
ON CONFLICT DO NOTHING;

-- ========================================================
-- SAMPLE DATA - APPOINTMENTS
-- ========================================================

INSERT INTO public.appointments (id, appointment_code, patient_id, doctor_id, problem, status, severity, duration, medical_history, created_at, updated_at) VALUES
('51a97223-0399-4a91-a547-a22ec57822c6', 'KQQHWZLU', 'f2f6401b-92a4-4d17-a133-7c3999a10ca6', 'ed226719-18cd-41ec-bae7-9914d3e729bb', 'Headache and fever', 'pending', NULL, NULL, NULL, '2025-12-11 01:04:04.937478+05', '2025-12-11 01:04:04.937478+05'),
('061c1a7b-33f9-4140-bdcd-ac3cad7c0898', 'AGOCK6QZ', 'f2f6401b-92a4-4d17-a133-7c3999a10ca6', 'ed226719-18cd-41ec-bae7-9914d3e729bb', 'Heart palpitations', 'pending', NULL, NULL, NULL, '2025-12-11 01:09:09.171064+05', '2025-12-11 01:09:09.171064+05'),
('c175bb70-5977-4ef1-b464-14b74e24e129', 'M93PMHSU', 'f2f6401b-92a4-4d17-a133-7c3999a10ca6', 'ed226719-18cd-41ec-bae7-9914d3e729bb', 'Back pain', 'pending', NULL, NULL, NULL, '2025-12-11 01:14:31.695885+05', '2025-12-11 01:14:31.695885+05'),
('c7b7477a-70b5-437a-9121-8abcb9b58ad9', 'NQ3R484Y', 'f2f6401b-92a4-4d17-a133-7c3999a10ca6', 'ed226719-18cd-41ec-bae7-9914d3e729bb', 'Skin rash', 'pending', NULL, NULL, NULL, '2025-12-11 01:19:44.248555+05', '2025-12-11 01:19:44.248555+05')
ON CONFLICT DO NOTHING;

-- ========================================================
-- FINAL SUMMARY
-- ========================================================

-- Display summary of created tables
SELECT '✅ Database setup complete!' AS status;
SELECT 
  (SELECT COUNT(*) FROM patients) AS patients_count,
  (SELECT COUNT(*) FROM doctors) AS doctors_count,
  (SELECT COUNT(*) FROM appointments) AS appointments_count;

SELECT 'Admin secret key is: 123$' AS admin_credentials_note;
SELECT 'Doctor profile columns added/verified!' AS migration_status;
