import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [load, setLoad] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const [generateOrCopy, setGenerateOrCopy] = useState(true);
  useEffect(() => {
    (async () => {
      if (window.location.pathname.length ==8) {
        const res = await fetch(
          `http://localhost:3004${window.location.pathname}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        if (data.success) {
          window.location.replace(data.url.toString());
        }else{
          setLoad(true);
          alert("Regerate the Url ");
        }
      } else {
        setLoad(true);
      }
    })();
  }, [generateOrCopy,load]);

  const generateUrl = async () => {
    if (url.length > 0) {
      document.getElementById("genOrCpy").innerHTML = "copy";
    }
    if (generateOrCopy) {
      const res = await fetch(`/generate?url=${url}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setUrl(window.location.href + data.shortUrl);
        setGenerateOrCopy(false);
        setGenerateError("");
      } else {
        setGenerateError("Add Url to proceed");
      }
    } else {
      document.getElementById("genOrCpy").innerHTML = "copy";
      copyToClipboard();
      setGenerateOrCopy(true);
    }
  };

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    if (!url) {
      return;
    }

    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    alert("Short Url copied to clipboard");
    setUrl("");
    document.getElementById("genOrCpy").innerHTML = "Generate";
  };

  return (
    <div className="App">
      {load ? (
        <div className="container">
          <h2>SMXURL</h2>
          <h3>Shorter your your URL with ease</h3>
          <div className="input-btn">
            <input
              type="text"
              className="input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <button className="btn" id="genOrCpy" onClick={generateUrl}>
              Genrate
            </button>
          </div>
          <p
            style={{
              display: "inline",
              margin: "0 25px",
              fontSize: "12px",
              color: "red",
              textAlign: "center",
            }}
          >
            {generateError}
          </p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
