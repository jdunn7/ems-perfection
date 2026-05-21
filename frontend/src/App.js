import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Home from "@/pages/Home";
import BookingSuccess from "@/pages/BookingSuccess";
import BookingCancel from "@/pages/BookingCancel";

function App() {
    return (
        <div className="App">
            <LanguageProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/booking-success" element={<BookingSuccess />} />
                        <Route path="/booking-cancel" element={<BookingCancel />} />
                    </Routes>
                </BrowserRouter>
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: "font-body rounded-2xl",
                        },
                    }}
                />
            </LanguageProvider>
        </div>
    );
}

export default App;
