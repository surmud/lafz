-- Lafz optional accounts: one progress snapshot per user. Recordings never leave the device.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "own progress: select" on public.user_progress
  for select using (user_id = auth.uid());
create policy "own progress: insert" on public.user_progress
  for insert with check (user_id = auth.uid());
create policy "own progress: update" on public.user_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own progress: delete" on public.user_progress
  for delete using (user_id = auth.uid());

-- In-app "Delete account and data" (App Store 5.1.1(v), Google Play account deletion policy).
-- Runs as the table owner so it can remove the auth user; it can only ever delete the caller.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from public.user_progress where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
