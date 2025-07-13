import { SignIn } from "@clerk/nextjs";

export default function signInPage() {
  return (
    <div className="fixed top-20 right-10 z-0">
      <SignIn/>
    </div>
  );
}
