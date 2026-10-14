import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Tutorly Demo" },
      { name: "description", content: "All Tutorly Demo bookings across students." },
      { property: "og:title", content: "Admin — Tutorly Demo" },
      { property: "og:description", content: "All Tutorly Demo bookings across students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", user.id],
    queryFn: async () => {
      const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (me?.role !== "admin") return { allowed: false, rows: [] };
      const [{ data: rows, error }, { data: profiles }] = await Promise.all([
        supabase.from("bookings").select("*").order("date").order("time"),
        supabase.from("profiles").select("id, full_name"),
      ]);
      if (error) throw error;
      const names = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
      return { allowed: true, rows: (rows ?? []).map((r) => ({ ...r, student: names.get(r.user_id) ?? "Unknown" })) };
    },
  });

  if (isLoading) return <main className="mx-auto max-w-5xl px-6 py-14 text-muted-foreground">Loading…</main>;
  if (!data?.allowed)
    return <main className="mx-auto max-w-5xl px-6 py-14"><h1 className="font-display text-4xl">Admins only</h1><p className="mt-2 text-muted-foreground">You don't have access to this page.</p></main>;

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="font-display text-4xl text-foreground">All bookings</h1>
      <p className="mt-1 text-muted-foreground">{data.rows.length} bookings</p>
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-secondary-foreground">
            <tr>{["Student", "Subject", "Date", "Time", "Notes"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.rows.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{b.student}</td>
                <td className="px-4 py-3">{b.subject}</td>
                <td className="px-4 py-3">{b.date}</td>
                <td className="px-4 py-3">{b.time.slice(0, 5)}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
