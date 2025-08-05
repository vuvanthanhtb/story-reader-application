import { FullLoadingPage } from "shared/pages";
import AppRoutes from "./routes";

const App = () => {
  return (
    <>
      <AppRoutes />
      <FullLoadingPage />
    </>
  );
};

export default App;
