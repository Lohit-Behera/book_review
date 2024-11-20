import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <h1 className="text-3xl text-center font-bold">Hello world</h1>
    </ThemeProvider>
  );
}

export default App;
