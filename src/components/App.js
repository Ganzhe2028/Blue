import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import ChatScreen from "./ChatScreen";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [customScenario, setCustomScenario] = useState("");
  const [userIdentity, setUserIdentity] = useState("我是孩子");

  const startExperience = (scenarioText, identity) => {
    setCustomScenario(scenarioText);
    setUserIdentity(identity);
    setCurrentScreen("chat");
  };

  return (
    <div className="container">
      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={startExperience} />
      )}

      {currentScreen === "chat" && (
        <ChatScreen
          customScenario={customScenario}
          userIdentity={userIdentity}
        />
      )}
    </div>
  );
};

export default App;
