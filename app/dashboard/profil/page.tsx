import ProfilForm from "./ProfilForm";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilPage() {
  let email = "";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    email = user.email ?? "";
  }

  return <ProfilForm email={email} />;
}
