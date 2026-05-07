-- Schema hardening for admin -> frontend consistency

alter table if exists public.categories
  add column if not exists image text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_active boolean not null default true;

alter table if exists public.products
  add column if not exists sale_price numeric,
  add column if not exists images text[] default '{}',
  add column if not exists is_active boolean not null default true;

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_active_created on public.products(is_active, created_at desc);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_categories_order on public.categories(sort_order, name);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_product_images_product on public.product_images(product_id, sort_order);

alter table if exists public.products enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.product_variants enable row level security;
alter table if exists public.product_attributes enable row level security;
alter table if exists public.product_images enable row level security;

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
on public.products
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read variants" on public.product_variants;
create policy "Public read variants"
on public.product_variants
for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_variants.product_id
      and p.is_active = true
  )
);

drop policy if exists "Public read attributes" on public.product_attributes;
create policy "Public read attributes"
on public.product_attributes
for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_attributes.product_id
      and p.is_active = true
  )
);

drop policy if exists "Public read product images" on public.product_images;
create policy "Public read product images"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_images.product_id
      and p.is_active = true
  )
);

drop policy if exists "Admin products" on public.products;
create policy "Admin products"
on public.products
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admin categories" on public.categories;
create policy "Admin categories"
on public.categories
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admin variants" on public.product_variants;
create policy "Admin variants"
on public.product_variants
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admin attributes" on public.product_attributes;
create policy "Admin attributes"
on public.product_attributes
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admin product images" on public.product_images;
create policy "Admin product images"
on public.product_images
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
