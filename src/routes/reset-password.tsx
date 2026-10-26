import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Tutorly Demo" },
      { name: "description", content: "Choose a new password for your Tutorly Demo account." },
      { property: "og:title", content: "Set a new password — Tutorly Demo" },
      { property: "og:description", content: "Choose a new password for your Tutorly Demo account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // The reset link lands here with a recovery session in the URL hash.
  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
    else setMsg("This link doesn't look valid. Request a new one from the log in page.");
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Password updated. Taking you to your bookings…");
      setTimeout(() => navigate({ to: "/bookings" }), 1200);
    }
    setBusy(false);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-4xl text-foreground">Set a new password</h1>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!ready} />
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full" disabled={busy || !ready}>
          Save new password
        </Button>
      </form>
    </main>
  );
}
