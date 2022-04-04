import React, { useEffect, useState, useRef } from "react";

import "./App.css";

import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

//Draw Rectangle
import { drawRectangle } from "./utilities";

function App() {
  //Create model and action states
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  //Create state for the 'command' button
  const [pressed, setPressed] = useState(false);

  //Create Ref and x, y, width, height, color, rotate states
  const canvasRef = useRef(null);
  const [x, setX] = useState(297);
  const [y, setY] = useState(300);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [color, setcolor] = useState('red');
  const [rotate, setRotating] = useState(false);

  //Create recognizer
  const loadModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT");
    console.log("Model Loaded");
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());

    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  useEffect(() => {
    loadModel();
  }, []);

  
  function argMax(arr) {
    return arr
      .map((x, index) => [x, index])
      .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  //Listen for actions
  const recognizeCommands = async () => {
    setPressed(true);
    console.log("Listening for commands");
    model.listen(
      (result) => {
        console.log(labels[argMax(Object.values(result.scores))]);
        setAction(labels[argMax(Object.values(result.scores))]);
      },
      { includeSpectrogram: true, probabilityThreshold: 0.8 }
    );
  };

   //Update rectangle
   const numberMap = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9
  }

  useEffect(() => {
    //Update x, y, color and animation

    const update =
     action === "up" ? setY(y - 10) : 
     action === "down" ? setY(y + 10) : 
     action === "left" ? setX(x - 10) : 
     action === "right" ? setX(x + 10) :
     action === "yes" ? setcolor("green"):
     action === "no" ? setcolor("red") :
     action === "go" ? setRotating(true) :
     action === "stop" ? setRotating(false) : "";

     //Update width and height
     if(Object.keys(numberMap).includes(action)) {
       setWidth(10 * numberMap[action]);
       setHeight(10 * numberMap[action]);
     }

     canvasRef.current.width = 640;
     canvasRef.current.height = 640;
     const ctx = canvasRef.current.getContext('2d');
     console.log(x, y, width, height);

     drawRectangle(ctx, x, y, width, height, color);
     setAction('reset');

  }, [action])

  return (
    <div className="App">
      <div>
        {pressed ? <h1>Listening</h1> : <h1>Click "command" button to activate the mic</h1>}
      </div>
      <header className="App-header">
        <canvas
          ref={canvasRef}
          style={{
            marginTop: "-60px",
            justifyContent: "center",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 640,
          }}
          className={rotate ? 'rectangle' : undefined}
        />
        <button onClick={recognizeCommands}>Command</button>
      </header>
    </div>
  );
}

export default App;
