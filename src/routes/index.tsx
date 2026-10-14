import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tutorly Demo — Book a private tutor session" },
      { name: "description", content: "Book one-to-one tutoring sessions with Tutorly Demo in seconds." },
      { property: "og:title", content: "Tutorly Demo — Book a private tutor session" },
      { property: "og:description", content: "Book one-to-one tutoring sessions with Tutorly Demo in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <p className="text-sm uppercase tracking-[0.2em] text-accent-foreground">Private tutoring</p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-foreground md:text-7xl">
        Learn at your pace,<br />one session at a time.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        Pick a subject, choose a time, and add a note about what you'd like to cover. That's it.
      </p>
      <div className="mt-10 flex gap-3">
        <Button asChild size="lg"><Link to="/bookings">Book a session</Link></Button>
        <Button asChild size="lg" variant="outline"><Link to="/auth">Create an account</Link></Button>
      </div>
      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {[
          ["1", "Sign up", "Make a free account with your email."],
          ["2", "Book", "Choose subject, date and time."],
          ["3", "Learn", "Show up and get focused help."],
        ].map(([n, t, d]) => (
          <div key={n} className="rounded-lg border border-border bg-card p-6">
            <span className="font-display text-3xl text-primary">{n}</span>
            <h3 className="mt-2 font-medium text-foreground">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
