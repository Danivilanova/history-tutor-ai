
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import ElevenLabsProvider from "./components/providers/ElevenLabsProvider";
import Index from "./pages/Index";
import LessonScreen from "./pages/LessonScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ElevenLabsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lesson" element={<LessonScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </ElevenLabsProvider>
    </QueryClientProvider>
  );
}

export default App;
