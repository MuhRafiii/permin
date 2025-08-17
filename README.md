This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/user](http://localhost:3000/user) with your browser to see the result.

Open [http://localhost:3000/admin](http://localhost:3000/admin) with your browser to see admin page (login as admin first).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend

run backend:

```bash
cd library-backend

# seeding admin
npm run seed

# run server
npm run start
```

backend: Express + Typescript
database: supabase

supabase schema:
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.books (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
title text NOT NULL,
author text,
publisher text,
year integer,
description text,
category_id uuid,
image text DEFAULT 'https://res.cloudinary.com/dxlevzn3n/image/upload/v1755059566/placeholder_surqve.png'::text,
status USER-DEFINED NOT NULL DEFAULT 'available'::status,
created_at timestamp with time zone DEFAULT now(),
reserved_by uuid,
reserved_at timestamp with time zone,
borrowed_by uuid,
borrowed_at timestamp with time zone,
CONSTRAINT books_pkey PRIMARY KEY (id),
CONSTRAINT books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
CONSTRAINT books_borrowed_by_fkey FOREIGN KEY (borrowed_by) REFERENCES public.users(id),
CONSTRAINT books_reserved_by_fkey FOREIGN KEY (reserved_by) REFERENCES public.users(id)
);

CREATE TABLE public.borrowings (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid,
book_id uuid,
borrowed_at timestamp without time zone DEFAULT now(),
returned_at timestamp without time zone,
status USER-DEFINED DEFAULT 'borrowed'::borrowing_status,
CONSTRAINT borrowings_pkey PRIMARY KEY (id),
CONSTRAINT borrowings_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
CONSTRAINT borrowings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.categories (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
name text NOT NULL,
CONSTRAINT categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.favorites (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid,
book_id uuid,
CONSTRAINT favorites_pkey PRIMARY KEY (id),
CONSTRAINT favorites_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.users (
id uuid NOT NULL DEFAULT uuid_generate_v4(),
name text NOT NULL,
email text NOT NULL UNIQUE,
role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
CONSTRAINT users_pkey PRIMARY KEY (id)
);
