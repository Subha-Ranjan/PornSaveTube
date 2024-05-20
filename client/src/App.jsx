import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import logo from "./images/PornSaveTubeLogo.png";

function App() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [filesInfo, setFilesInfo] = useState(null);
  const [myArray, setMyArray] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let [isValidUrl, setIsValidUrl] = useState(null);

  const messageRef = useRef();
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [videoInfo]);

  const update = (res) => {
    setVideoInfo(res.data);
    console.log("Video Info:", videoInfo);
    setIsLoading(false);
    setFilesInfo(res.data.files.filter(a=> a.quality!=='hls' && a.url !==''))
    
    
  };

  async function sendLink(downloadURL) {
    axios
      .post("http://localhost:8000/api/sendlink", { link: downloadURL })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }

  function getInfo() {
    if (url.trim() == "") {
      setIsValidUrl("Empty URL");
      console.log(isValidUrl);
    }
    if (url.trim() !== "") {
      setIsValidUrl(true);
      setIsLoading(true);
      axios
        .post("http://localhost:8000/api", { link: url })
        .then(update)
        .catch((err) => {
          setIsLoading(false);
          setIsValidUrl("Bad Request!!!");
        });
    }
  }
  console.log(filesInfo)
  return (
    <div className="App">
      <div className="conatainer">
        <div className="image-wrapper">
          <img
            src={logo}
            alt="YouSaveTube_Logo"
            width="100%"
            className="image"
          />
        </div>

        <form onSubmit={(e) => e.preventDefault(e)}>
          <label>
            Enter the Porn Video URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                padding: "10px",
                minWidth: "calc((100% / 4) * 3 - 10%)",
                height: "1.3rem",
                margin: "1rem",
              }}
              placeholder="paste any link from Pornhub,Spankbang or Xvideos"
            />
          </label>
          <button onClick={() => getInfo()} type="submit">
            Get Video Info
          </button>
        </form>

        {<p style={{"color":"red"}}><b>{isValidUrl}</b></p>}
      {isLoading?<h3>Loading...</h3>:


      <div className="outputContainer" ref={messageRef}>
          {videoInfo !== null ? (
          <div>
            <h3>{videoInfo.title}   </h3>
            <p><b>Duration:</b>{videoInfo.duration} &nbsp;<b>Platorm:</b>{videoInfo.platform}</p>
            <img src={videoInfo.image} alt="thumbnail"/>
            <ul>
              {filesInfo?.map((video) => (
                <li key={video.url} style={{listStyle:"none"}}>
                  <b>{video.quality}</b>
                  {"---> "}
                  <a><button src={video.url}>Download</button></a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}</div>
    }  
        
      </div>
    </div>
  );
}

export default App;
