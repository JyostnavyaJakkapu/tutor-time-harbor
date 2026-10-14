import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — Tutorly Demo" },
      { name: "description", content: "Create and view your Tutorly Demo tutoring sessions." },
      { property: "og:title", content: "My bookings — Tutorly Demo" },
      { property: "og:description", content: "Create and view your Tutorly Demo tutoring sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [form, setForm] = useState({ subject: "", date: "", time: "", notes: "" });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*")
        .eq("user_id", user.id).order("date").order("time");
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("bookings").insert({ ...form, notes: form.notes || null, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm({ subject: "", date: "", time: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[1fr_1.3fr]">
      <section>
        <h1 className="font-display text-4xl text-foreground">New booking</h1>
        <form className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6"
          onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          {create.error && <p className="text-sm text-destructive">{(create.error as Error).message}</p>}
          <Button type="submit" className="w-full" disabled={create.isPending}>Book session</Button>
        </form>
      </section>
      <section>
        <h2 className="font-display text-4xl text-foreground">My bookings</h2>
        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading…</p>}
          {!isLoading && bookings.length === 0 && <p className="text-muted-foreground">No bookings yet.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-foreground">{b.subject}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm text-primary">{b.date} · {b.time.slice(0, 5)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    disabled={cancel.isPending}
                    onClick={() => { if (window.confirm(`Cancel the ${b.subject} session on ${b.date}?`)) cancel.mutate(b.id); }}
                  >
                    Cancel
                  </Button>
                </span>
              </div>
              {b.notes && <p className="mt-1 text-sm text-muted-foreground">{b.notes}</p>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
