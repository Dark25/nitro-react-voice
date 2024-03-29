import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ILinkEventTracker } from "@nitrots/nitro-renderer";
import { FC, useEffect, useRef, useState } from "react";
import {
  AddEventLinkTracker,
  CreateLinkEvent,
  RemoveLinkEventTracker,
} from "../../api";
import "./UpsideView.scss";
export const UpsideView: FC<{}> = (props) => {
  var isPlayed = false;
  var firstCheck = false;
  var radioUrl = "https://stream2.svrdedicado.org:8130/stream";

  const [isVisible, setIsVisible] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [answer, setAnswer] = useState("");
  const [audio, setAudio] = useState(new Audio(radioUrl));
  const myRef = useRef();
  const sso = new URLSearchParams(window.location.search).get("sso");

  useEffect(() => {
    const linkTracker: ILinkEventTracker = {
      linkReceived: (url: string) => {
        const parts = url.split("/");

        if (parts.length < 2) return;

        switch (parts[1]) {
          case "o":
            addNewAlert(parts[2], parts[3]);
            return;
        }
      },
      eventUrlPrefix: "mal/",
    };

    AddEventLinkTracker(linkTracker);

    return () => RemoveLinkEventTracker(linkTracker);
  }, [setIsVisible]);

  useEffect(() => {
    var intervalId = setInterval(radioChecker, 3000);

    async function radioChecker() {}
  }, []);

  function getPlayersOnline() {
    fetch("https://hgalaxy.net/api/usersOnline")
      .then((response) => response.text())
      .then((result) => {
        document.getElementById("usersOnline").innerHTML = result;
      });
  }

  function getAlert(name, text, identifier) {
    return (
      <div
        className="animate__animated animate__fadeInDown animate__faster"
        style={{
          padding: "10px",
          backgroundColor: "var(--test-galaxy)",
          color: "var(--test-galaxytext)",
          borderRadius: "5px",
          width: "270px",
          marginBottom: "20px",
          wordBreak: "break-all",
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <span className="badge bg-danger">Nueva mención recibida</span>
          <span style={{ float: "right", cursor: "pointer" }}>
            <span
              onClick={() => closeAlert(identifier)}
              className="badge bg-danger"
            >
              x
            </span>
          </span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>{name}:</b> &nbsp;
          {text}
        </div>
        <input
          onChange={(e) => handleAnswer(e.target.value)}
          className="form-control"
          type="text"
          style={{ marginBottom: "4px" }}
        />
        <button
          onClick={() => sendResponse(name, identifier)}
          className="btn btn-success btn-sm w-100"
        >
          Responder
        </button>
      </div>
    );
  }

  var response = "";

  function handleAnswer(a) {
    response = a;
  }

  function sendResponse(username, identifier) {
    fetch(
      "https://int.hgalaxy.fun/?type=mentionUser&userToMention=" +
        username +
        "&message=" +
        response +
        "&sso=" +
        sso
    );
    closeAlert(identifier);
  }

  function closeAlert(identifier) {
    setAlerts((prev) => prev.filter((item) => item.id !== identifier));
  }

  async function addNewAlert(name, text) {
    var identifier = Math.random();
    var alert = getAlert(name, text, identifier);
    setAlerts((oldArray) => [...oldArray, { id: identifier, alert: alert }]);
    var audio = new Audio("https://swfs.hgalaxy.net/sounds/plin.mp3");
    audio.play();
  }

  return (
    <>
      {isVisible && (
        <>
          <div id="mentionAlerts" style={{ marginTop: "20px" }}>
            {alerts != null && (
              <>
                {alerts.map((alert) => (
                  <>{alert.alert}</>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
