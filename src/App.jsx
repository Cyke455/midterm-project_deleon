import { useState } from "react";
import { GameProvider } from "./contexts/GameContext";
import GameStart from "./components/gamestart";
import StoryScreen from "./components/StoryScreen";
import story from "./story.json"
import "./App.css";

export default function App() {
  const [view, setView] = useState("gamestart");


  return (
    <GameProvider>
      <div style={{ backgroundColor: "#000000ff", minHeight: "100vh" }}>
        {view === "gamestart" && <GameStart setView={setView} />}
       {view === "game" && <StoryScreen setView={setView} />}

      </div>
    </GameProvider>
  );  
}
