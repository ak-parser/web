import React, {useEffect} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './index.css'

export const numbers_en_US = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
export const numbers_uk_UA = ["один", "два", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"];

export function Dictaphone(props) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    useEffect(() => {
        if (listening === false)
            props.onSpeech(transcript);
    }, [listening]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    if (!isMicrophoneAvailable) {
        return <span>Please enable microphone.</span>;
    }

    return (
        <div className="dictaphone">
            <p className="dictaphone-status">Microphone: {listening ? 'on' : 'off'}</p>
            <div className="dictaphone-buttons">
                <button onClick={() => SpeechRecognition.startListening({language: 'uk-UA'})}>Start</button>
                <button onClick={() => SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
            </div>
            <p className="dictaphone-transcript">{transcript && ('Text: ' + transcript)}</p>
        </div>
    );
}
