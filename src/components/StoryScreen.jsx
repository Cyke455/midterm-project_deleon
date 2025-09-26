import React, { useEffect } from "react";
import { useGame } from "../contexts/GameContext";

export default function StoryScreen({ setView }) {
  const {
    story,
    currentNode,
    setCurrentNode,
    player,
    addItem,
    takeDamage,
    resetGame,
    markVisited,
  } = useGame();

  const node = story[currentNode];

  // Apply effects only once per node
  useEffect(() => {
    if (!node?.onArrive) return;

    if (!player.visited.includes(currentNode)) {
      if (node.onArrive.addItem) addItem(node.onArrive.addItem);
      if (node.onArrive.takeDamage) takeDamage(node.onArrive.takeDamage);
      markVisited(currentNode);
    }
  }, [currentNode]);

  // Check for game over
  useEffect(() => {
    if (player.hp <= 0) {
      setCurrentNode("gameOver_hp");
    }
  }, [player.hp]);

  if (!node) return <p>Invalid node</p>;

  // Handle endings
  if (node.isEnding) {
    return (
      <div>
        <div className="StoryText">
          <h2>{node.text}</h2>
          <div
            className="image-asset"
            style={{ backgroundImage: `url(${node.imageAsset})` }}
          ></div>
        </div>
        <button className="btn btn-default" onClick={() => resetGame(true, player.slot)}>
            Play Again
        </button>
        <button className="btn btn-fail" onClick={() => setView("gamestart")}>
          Go to main menu
        </button>
      </div>
    );
  }

  return (
    <div className="story">
      <div className="StoryText">
        <h2>{node.text}</h2>
        <div
          className="image-asset"
          style={{ backgroundImage: `url(${node.imageAsset})` }}
        ></div>
      </div>

      <div className="choices">
        {node.choices.map((choice, idx) => {
          const hasRequirement =
            choice.requires && !player.inventory.includes(choice.requires);
          const shouldHide =
            choice.hideIf && player.inventory.includes(choice.hideIf);

          if (shouldHide) return null;

          return (
            <button
              key={idx}
              className="btn btn-default"
              disabled={hasRequirement}
              onClick={() => setCurrentNode(choice.to)}
            >
              <u>{choice.text}</u>
            </button>
          );
        })}
      </div>

      <div className="stats">
        <div className="playername">
        <p>
          <strong>{player.name}</strong>
        </p>
        </div>
        <div className="HP">
          <div className="Hud">
            <img
              className="hud"
              src="/pictures/hudhead.png"
              width={40}
              alt="hud"
            />
          </div>
          <p>HP: {player.hp}</p>
        </div>

  <div className="Inventory">
     <div className="inventory-row">
    <span>Inventory:   </span>

    <img
      src="/pictures/Bolo.png"
      alt="Bolo"
      width={40}
      className="inventory-icon"
    />
    {player.inventory.map((item, idx) => (
      <img
        key={idx}
        src={`/pictures/${item}.png`}
        alt={item}
        width={40}
        className="inventory-icon"
      />
    ))}

</div>
</div>

        
      </div>
    </div>
  );
}
