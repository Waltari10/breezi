import { BreathingCircle } from "./components/BreathingCircle";
import { Navigation } from "./components/Navigation";
import "./App.css";

function App() {
  return (
    <>
      <Navigation />
      <main className="app-content">
        <BreathingCircle />
      </main>
    </>
  );
}

export default App;
