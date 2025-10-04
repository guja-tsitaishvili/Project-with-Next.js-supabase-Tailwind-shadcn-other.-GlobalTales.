export default function MapLayout({
  children,
  modal, // 👈 must be named the same as the @modal folder
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
