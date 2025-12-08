import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import RootLayout from "./components/layouts/RootLayout";
import Profile from "./pages/Profile";
import ChooseServices from "./pages/ChooseServices";
import ChooseCapster from "./pages/ChooseCapster";
import ChooseSchedule from "./pages/ChooseSchedule";
import ChangeProfile from "./pages/ChangeProfile";
import ReservationHistory from "./pages/ReservationHistory";
import ReservationHistoryDetail from "./pages/ReservationHistoryDetail";
import Notification from "./pages/Notification";
import ActiveReservation from "./pages/ActiveReservation";
import ActiveReservationDetail from "./pages/ActiveReservationDetail";
import ReservationLayout from "./components/layouts/ReservationLayout";
import RescheduleReservation from "./pages/RescheduleReservation";
import CommonLayout from "./components/layouts/CommonLayout";
import PersonalLayout from "./components/layouts/PersonalLayout";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<CommonLayout/>} >
            <Route path="/" element={<UserDashboard />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<ReservationLayout />}>
              <Route path="/appointment/choose-service" element={<ChooseServices />} />
              <Route path="/appointment/choose-capster" element={<ChooseCapster />} />
              <Route path="/appointment/choose-schedule" element={<ChooseSchedule />} />
              <Route path="/appointment/reschedule" element={<RescheduleReservation />} />
            </Route>

            <Route element={<PersonalLayout/>}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/change" element={<ChangeProfile />} />
              <Route path="/reservation/history" element={<ReservationHistory />} />
              <Route path="/reservation/history/:id" element={<ReservationHistoryDetail />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/reservation" element={<ActiveReservation />} />
              <Route path="/reservation/:id" element={<ActiveReservationDetail />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  // </StrictMode>,
)
