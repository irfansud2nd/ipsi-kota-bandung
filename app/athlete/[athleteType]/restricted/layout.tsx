import IsAuthorized from "@/components/auth/IsAuthorized";
import Container from "@/components/ui/Container";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full w-full p-2">
      <IsAuthorized>{children}</IsAuthorized>
    </Container>
  );
};
export default layout;
