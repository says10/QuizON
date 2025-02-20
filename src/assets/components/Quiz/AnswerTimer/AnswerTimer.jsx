import { useState, useEffect } from "react";
import "./AnswerTimer.scss";

const AnswerTimer = ({ duration, onTimeUp, reset }) => {
  const [timeLeft, setTimeLeft] = useState(duration);// Initializes timer with the given duration

  useEffect(() => {
    setTimeLeft(duration); // Reset timer when `reset` changes
  }, [reset, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
//Time
    const timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timerId); // Cleans up the timeout on re-renders
  }, [timeLeft]);

  return (
    <div className="timer" data-time={timeLeft}>
      Time Left: {timeLeft}s
    </div>
  );
};

export default AnswerTimer;
