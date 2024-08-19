import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import VideoDetail from "./pages/VideoDetail";
import Gallery from "./pages/Gallery";
import Header from "./ui/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "./contexts/SearchContext";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
import { ConfigProvider } from "./contexts/ConfigContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <SearchProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <BrowserRouter>
            <Header>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="video" element={<Video />} />
                  <Route path="video-detail" element={<VideoDetail />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Header>
          </BrowserRouter>
        </SearchProvider>
      </ConfigProvider>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
