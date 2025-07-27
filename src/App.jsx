import React, { useState, useEffect } from "react";
import './App.css';
import bg from './assets/Ai.jpg'; // ✅ Importing image

const App = () => {
  const [commands] = useState(true);
  const [texts, setTexts] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setISListening] = useState(false);

  // Function to speak the response using SpeechSynthesis
  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // Function to handle commands
  const handleCommands = (commands) => {
    if (commands.includes("open whatsapp")) {
      const message = "Opening WhatsApp";
      speak(message);
      setResponse(message);
      window.open("https://www.whatsapp.com", "_blank");
    } else if (commands.includes("open instagram")) {
      const message = "Opening Instagram";
      speak(message);
      setResponse(message);
      window.open("https://www.instagram.com", "_blank");
    } else if (commands.includes("open youtube")) {
      const message = "Opening YouTube";
      speak(message);
      setResponse(message);
      window.open("https://www.youtube.com", "_blank");
    } else if (commands.includes("open chatgpt")) {
      const message = "Opening ChatGPT";
      speak(message);
      setResponse(message);
      window.open("https://www.chatgpt.com", "_blank");
    } else {
      const message = `Searching Google for... ${commands}`;
      setResponse(message);
      speak(message);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(commands)}`);
    }
  };

  // Function to start listening for commands
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const message = "Speech Recognition is not supported in this browser";
      setResponse(message);
      alert(message);
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTexts(text);
      handleCommands(text);
    };

    recognition.onerror = (event) => {
      const message = `Error occurred: ${event.error}`;
      setResponse(message);
      alert(message);
    };

    setISListening(true);
    recognition.start();
  };

  useEffect(() => {
    let timeout;
    if (isListening) {
      timeout = setTimeout(() => {
        setISListening(false);
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timeout);
  }, [isListening]);

  return (
    <div
      className='w-screen h-screen flex flex-col gap-6 items-center justify-center'
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 className='text-6xl font-extrabold text-white drop-shadow-lg'>Voice Assistant!</h1>
      <p className='text-md font-semibold text-white bg-black/40 px-4 py-2 rounded-xl'>
        {commands ? "Please give me a command" : "Processing your command"}
      </p>

      <div className='flex items-center justify-center'>
        <button
          onClick={startListening}
          className='px-6 py-2 bg-black rounded-lg text-white hover:bg-gray-800 transition'
        >
          {isListening ? "Listening..." : "Start Listening"}
        </button>
      </div>

      <div className='bg-white p-5 shadow-lg h-auto rounded-xl space-y-5 w-[90%] max-w-md mt-6 bg-opacity-90'>
        <h2 className='text-xl font-medium'>
          <span className='text-green-600 font-bold'>Recognition Speech:</span>
          <br />
          {texts}
        </h2>
        <h4 className='text-lg'>
          <span className='text-orange-600 font-bold'>Response:</span> {response}
        </h4>
      </div>
    </div>
  );
};

export default App;
