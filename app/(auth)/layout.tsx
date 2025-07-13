import LeftImagePortion from "@/components/LeftImagePortion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex ">
      <LeftImagePortion />
      {children}
    </main>
  );
}
