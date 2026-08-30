interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function CafeLayout({ children, modal }: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
