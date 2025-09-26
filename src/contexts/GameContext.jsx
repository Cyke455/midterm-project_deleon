import { createContext, useContext, useState, useEffect } from "react";
import story from "../story.json";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [player, setPlayer] = useState({ name: "", hp: 100, inventory: [], visited: [], slot: 1 });
  const [currentNode, setCurrentNode] = useState("start");

  const normalizeName = (name) => name.trim().toLowerCase();

  // Load saves in data
  const loadSaves = () => {
    const saved = localStorage.getItem("saves");
    return saved ? JSON.parse(saved) : {};
  };

  const saveGame = () => {
    if (!player.name) return;
    const saves = loadSaves();
    const normName = normalizeName(player.name);

    if (!saves[normName]) saves[normName] = [];
    const slotIndex = saves[normName].findIndex((s) => s.slot === player.slot);
    const saveData = { ...player, currentNode };
    if (slotIndex >= 0) {
      saves[normName][slotIndex] = saveData;
    } else {
      saves[normName].push(saveData);
    }
    localStorage.setItem("saves", JSON.stringify(saves));
  };

  const loadGame = (name, slot) => {
    const saves = loadSaves();
    const normName = normalizeName(name);
    const slotData = saves[normName]?.find((s) => s.slot === slot);
    if (slotData) {
      setPlayer({ ...slotData, name }); 
      setCurrentNode(slotData.currentNode || "start");
      return true;
    }
    return false;
  };

  const deleteSave = (name, slot) => {
    const saves = loadSaves();
    const normName = normalizeName(name);
    if (!saves[normName]) return;

    saves[normName] = saves[normName].filter((s) => s.slot !== slot);
    if (saves[normName].length === 0) {
      delete saves[normName];
    }
    localStorage.setItem("saves", JSON.stringify(saves));
  };

  const addItem = (item) =>
    setPlayer((prev) => ({
      ...prev,
      inventory: [...new Set([...prev.inventory, item])],
    }));

  const takeDamage = (amount) =>
    setPlayer((prev) => {
      const newHP = prev.hp - amount;
      return { ...prev, hp: newHP <= 0 ? 0 : newHP };
    });

  const markVisited = (nodeId) => {
    setPlayer((prev) => ({
      ...prev,
      visited: [...new Set([...prev.visited, nodeId])],
    }));
  };

  const resetGame = (preserveName = false, slot = 1) => {
    setPlayer((prev) => ({
      name: preserveName ? prev.name : "",
      hp: 100,
      inventory: [],
      visited: [],
      slot,
    }));
    setCurrentNode("start");
  };

  // Auto-save feature
  useEffect(() => {
    if (player.name) {
      saveGame();
    }
  }, [player, currentNode]);

  return (
    <GameContext.Provider
      value={{
        player,
        setPlayer,
        story,
        currentNode,
        setCurrentNode,
        addItem,
        takeDamage,
        resetGame,
        markVisited,
        loadGame,
        loadSaves,
        deleteSave,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
