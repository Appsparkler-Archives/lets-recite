import { useEffect } from "react";

type DeferredPromptEvent =
  | (Event & {
      prompt: () => void;
      userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
    })
  | null;

export let deferredPrompt: DeferredPromptEvent = null;

function deferPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    console.log("before install prevented...");
    deferredPrompt = event as DeferredPromptEvent;
  });
}

export const InstallButton = () => {
  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const userChoice = await deferredPrompt.userChoice;
      if (userChoice.outcome === "dismissed") {
        alert("dismissed");
      } else {
        console.log("app is added to users home screen");
      }
    }
  };

  useEffect(() => {
    deferPrompt();
  }, []);

  return (
    <>
      <button onClick={handleClick}>
        <h1>Install</h1>
      </button>
    </>
  );
};
