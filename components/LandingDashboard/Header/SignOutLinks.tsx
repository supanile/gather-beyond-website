import { SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";

const SignOutLinks = () => {
  const handleLogout = () => {
    toast.success("You have successfully logged out", {});
  };

  return (
    <SignOutButton redirectUrl="/">
      <button 
        className="w-full md:w-auto text-center md:text-left text-muted-foreground hover:text-primary transition-all duration-300 font-medium py-3 px-4 md:px-4 md:py-2 rounded-xl md:rounded-lg border border-border/50 hover:bg-accent/50 hover:border-primary/50 md:border-none md:hover:border-none transform hover:scale-105 relative group after:absolute after:inset-0 after:rounded-xl md:after:rounded-lg after:bg-gradient-to-r after:from-gray-600/20 after:to-slate-600/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 cursor-pointer"
        onClick={handleLogout}
      >
        <span className="relative z-10">Logout</span>
      </button>
    </SignOutButton>
  );
};

export default SignOutLinks;