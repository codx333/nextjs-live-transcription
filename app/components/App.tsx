"use client";

import { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";
import { MicrophoneIcon } from "./icons/MicrophoneIcon";
import Visualizer from "./Visualizer";

const App = () => {
  const [caption, setCaption] = useState<string | undefined>("Click the microphone to start speaking");
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, stopMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setupMicrophone();
  }, [setupMicrophone]);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
  }, [microphoneState, connectToDeepgram]);

  useEffect(() => {
    if (!microphone || !connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      if (thisCaption !== "") {
        setCaption(thisCaption);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption("Click the microphone to start speaking");
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
  }, [connectionState, connection, microphone]);

  const toggleRecording = () => {
    if (isRecording) {
      stopMicrophone();
      setIsRecording(false);
      setCaption("Click the microphone to start speaking");
    } else {
      startMicrophone();
      setIsRecording(true);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl aspect-video bg-black/20 rounded-2xl overflow-hidden relative">
        {microphone && <Visualizer microphone={microphone} />}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={toggleRecording}
            className="w-20 h-20 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <MicrophoneIcon micOpen={isRecording} className="w-10 h-10" />
          </button>
        </div>

        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <div className="bg-black/70 px-6 py-3 rounded-lg max-w-2xl text-center">
            <p className="text-lg">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;