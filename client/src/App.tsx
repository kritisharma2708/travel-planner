import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ChatPage from "./pages/ChatPage";
import TripPage from "./pages/TripPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/trip/:idOrSlug" element={<TripPage />} />
      </Route>
    </Routes>
  );
}
