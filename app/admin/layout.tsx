import AdminSideMenu from "@/components/admin/AdminSideMenu";
import IsAuthorized from "@/components/auth/IsAuthorized";
import ReduxProvider from "@/components/providers/ReduxProvider";
import Container from "@/components/ui/Container";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <IsAuthorized>
      <ReduxProvider>
        <Container className="h-full w-full grid grid-cols-1 lg:grid-cols-[auto_1fr]">
          <div className="w-fit h-full max-w-[220px] max-lg:hidden">
            <AdminSideMenu />
          </div>
          <div className="p-1 w-full max-w-full grid grid-cols-1">
            {children}
          </div>
        </Container>
      </ReduxProvider>
    </IsAuthorized>
  );
};
export default layout;
