export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#F9FAFB] dark:bg-gray-950">
      {children}
    </div>
  );
}
