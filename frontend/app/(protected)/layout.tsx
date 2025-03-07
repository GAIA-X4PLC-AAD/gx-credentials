import { auth } from "@/auth";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  console.log("session", session);

  if (!session?.expires || parseInt(session.expires) < Date.now() / 1000) {
    redirect("/");
  }

  return (
    <div className="mx-auto block max-w-[calc(80rem_+_2rem)] px-[1rem]">
      <Header />
      {children}
    </div>
  );
};

export default ProtectedLayout;
