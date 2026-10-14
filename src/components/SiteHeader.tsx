import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const linkCls = "text-sm text-muted-foreground hover:text-foreground transition-colors";
  const active = { className: "text-sm text-foreground font-medium" };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-primary">Tutorly Demo</Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className={linkCls} activeProps={active} activeOptions={{ exact: true }}>Home</Link>
          {user && <Link to="/bookings" className={linkCls} activeProps={active}>My bookings</Link>}
          {user && isAdmin && <Link to="/admin" className={linkCls} activeProps={active}>Admin</Link>}
          {user ? (
            <Button variant="outline" size="sm" onClick={signOut}>Log out</Button>
          ) : (
            <Button asChild size="sm"><Link to="/auth">Sign up / Log in</Link></Button>
          )}
        </nav>
      </div>
    </header>
  );
}
