import Container from "@/components/ui/Container";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Container className="h-full w-full p-2">{children}</Container>;
};
export default layout;
