import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [src, setSrc] = useState<null | string>(null);

  useEffect(() => {
    fetch("https://httpbin.org/get").then(() => {
      setSrc(
        "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      );
    });
  }, []);

  return (
    <>
      <img src={"/vite.svg"} width={100} />
      <div>{src !== null ? <img src={src} width="100%" /> : "Loading!!!"}</div>
    </>
  );
}

export default App;
