import { SignUp } from "@clerk/nextjs";

export default function signUpPage() {
  return (
    <div className="fixed top-10 right-10 z-50">
      <SignUp />
    </div>
  );
}
