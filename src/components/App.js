import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import ChatScreen from "./ChatScreen";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");

  const startExperience = () => {
    setCurrentScreen("chat");
  };

  return (
    <div className="container">
      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={startExperience} />
      )}

      {currentScreen === "chat" && <ChatScreen />}
    </div>
  );
};

export default App;
