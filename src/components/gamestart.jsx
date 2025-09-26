import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";
import background from "/pictures/Mainmenu.png";

export default function GameStart({ setView }) {
  const [name, setName] = useState("");
  const [slotChoice, setSlotChoice] = useState(null);
  const { setPlayer, resetGame, setCurrentNode, loadSaves, loadGame, deleteSave } = useGame();

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name before starting the game!");
      return;
    }

    const saves = loadSaves();
    const normName = name.trim().toLowerCase();
    if (saves[normName]) {
      // If the saves exist, this shows slot selection
      setSlotChoice(saves[normName]);
    } else {
      // if there are no saves left, this will lead to creating a new profile again
      resetGame(false, 1);
      setPlayer({ name, hp: 100, inventory: [], visited: [], slot: 1 });
      setCurrentNode("start");
      alert(`Welcome to Aswang Hunters, ${name}!`);
      setView("game");
    }
  };

  const handleSlotLoad = (slot) => {
    if (loadGame(name, slot)) {
      alert(`Welcome back, ${name}! Loaded slot ${slot}`);
      setView("game");
    }
  };

  const handleNewSlot = () => {
    const saves = loadSaves();
    const normName = name.trim().toLowerCase();
    const nextSlot = (saves[normName]?.length || 0) + 1;
    resetGame(false, nextSlot);
    setPlayer({ name, hp: 100, inventory: [], visited: [], slot: nextSlot });
    setCurrentNode("start");
    alert(`New adventure started in Slot ${nextSlot}, ${name}!`);
    setView("game");
  };

  const handleDelete = (slot) => {
    if (window.confirm(`Delete slot ${slot}? This cannot be undone.`)) {
      deleteSave(name, slot);
      const saves = loadSaves();
      const normName = name.trim().toLowerCase();
      setSlotChoice(saves[normName] || null);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${background})` }} className="container">
      {!slotChoice ? (
        <form className="namebox" onSubmit={handleNameSubmit}>
          <div className="title">
            <h2>Aswang Hunters</h2>
          </div>
          <img
            className="aswanglogo"
            src="/pictures/mainicon.png"
            width={150}
            alt="aswangicon"
          />
          <div className="nam">
            <label htmlFor="name">Enter Name: </label>
          </div>
          <input
            type="text"
            id="name"
            placeholder="Your name..."
            maxLength="6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="submit" value="Start" />
        </form>
      ) : (


        //Save slot Screen
        <div className="slot-selection">
          <div className="slotheader">
          <h2>Saves for {name}</h2>
          </div>
          <div className="Saveslots">
          {slotChoice.map((save) => (
            <div key={save.slot}>
              <button className="btns1 btn-default" onClick={() => handleSlotLoad(save.slot)}>
                Slot {save.slot} – HP: {save.hp}, Level: {save.currentNode}
              </button>
              <button className="btndel btn-default" onClick={() => handleDelete(save.slot)}>X Delete</button>
            </div>
          ))}
          <button className="btns1 btn-default" onClick={handleNewSlot}>+ New Slot</button>
        </div>
        </div>
      )}
    </div>
  );
}
