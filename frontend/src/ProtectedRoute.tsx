import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/stores/useAuth";
import { toast } from "sonner";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "./api/axiosInstance";
import { useShallow } from "zustand/react/shallow";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./components/ui/alert-dialog";
import { useAlertDialog } from "./stores/useAlertDialog";

export default function ProtectedRoute() {
  const { user, accessToken } = useAuth(
    useShallow((state) => ({
      user: state.user,
      accessToken: state.accessToken,
    }))
  );
  const { setType, onOpen, isOpen, onClose } = useAlertDialog(
    useShallow(state => ({
      setType: state.setType,
      onOpen: state.onOpen,
      isOpen: state.isOpen,
      onClose: state.onClose
    }))
  )
  const navigate = useNavigate();
  const location = useLocation();

  const isTokenValid = (accessToken: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      if (Date.now() >= exp * 1000) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const refresh = async () => {
    try {
      await api.get("/user/me");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (error as string));
      setType("FORBIDDEN")
      onOpen();
    }
  };

  useEffect(() => {
    if (!accessToken || !user) {
      refresh();
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    if (!isTokenValid(accessToken)) {
      const isRefresh = confirm(
        "Session expired. Do you want to refresh your session?"
      );
      if (isRefresh) {
        refresh();
      } else {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
      }
    }
  }, [accessToken, location.pathname]);

  return (
    <>
      <AlertDialog onOpenChange={onClose} open={isOpen} defaultOpen={isOpen}>
        <Outlet />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're not currently logged in</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to access this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => navigate("/", { replace: true })}>
                Later
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/login", { replace: true })}>
                Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
