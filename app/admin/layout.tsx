import AdminSideMenu from "@/components/admin/AdminSideMenu";
import IsAuthorized from "@/components/auth/IsAuthorized";
import ReduxProvider from "@/components/providers/ReduxProvider";
import Container from "@/components/ui/Container";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <IsAuthorized>
      <ReduxProvider>
        <Container className="h-full w-full grid grid-cols-1 lg:grid-cols-[auto_1fr]">
          <div className="w-fit h-full max-lg:hidden">
            <AdminSideMenu />
          </div>
          {children}
        </Container>
      </ReduxProvider>
    </IsAuthorized>
  );
};
export default layout;
