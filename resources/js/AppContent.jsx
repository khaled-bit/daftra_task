// AppContent.jsx
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import Loading from "./Components/Loading.jsx";
import { useAuth } from "./contexts/AuthContext";
import { useSetting as useGeneralSetting } from "./contexts/GeneralSettingContext";
import { useReservationSetting } from "./contexts/ReservationSettingContext";
import { useOrderSetting } from "./contexts/OrderSettingContext";
import { useSetting as useHeroSetting } from "./contexts/HeroSettingContext";

export default function AppContent() {
    const { loading: authLoading } = useAuth();
    const { loading: generalLoading } = useGeneralSetting();
    const { loading: reservationLoading } = useReservationSetting();
    const { loading: orderLoading } = useOrderSetting();
    const { loading: heroLoading } = useHeroSetting();

    const isLoading =
        authLoading ||
        generalLoading ||
        reservationLoading ||
        orderLoading ||
        heroLoading;

    if (isLoading) return <Loading />;

    return <RouterProvider router={routes} />;
}
