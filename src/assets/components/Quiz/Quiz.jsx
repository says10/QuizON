import { useState, useEffect } from "react";
import { openDB } from "idb";
import { resultInitialState } from "../../../constants.js";
import AnswerTimer from "./AnswerTimer/AnswerTimer.jsx";
// =====================
// ⏳ QUIZ STATE MANAGEMENT
// =====================
const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { question, choices, correctAnswer, type } = questions[currentQuestion];

  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");

  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);

  const [attempts, setAttempts] = useState([]); // Store all attempts

  useEffect(() => {
    resetQuestionState();
  }, [currentQuestion]);

  //saves quiz attempt history to indexedDB
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("QuizDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("attempts")) {
            db.createObjectStore("attempts", { keyPath: "id", autoIncrement: true });
          }
        },
      });
      loadAttempts(db);
    };

    const loadAttempts = async (db) => {
      const storedAttempts = await db.getAll("attempts");
      setAttempts(storedAttempts.reverse()); // Show latest first
    };

    initDB();
  }, []);

  const saveAttempt = async (attempt) => {
    const db = await openDB("QuizDB", 1);
    await db.add("attempts", attempt);
    setAttempts((prev) => [attempt, ...prev]);
  };
  //Resets state variable for next question
  const resetQuestionState = () => {
    setAnswerIdx(null);
    setAnswer(null);
    setInputAnswer("");
    setIsAnswerChecked(false);
    setShowAnswerTimer(true);
    setResetKey((prevKey) => prevKey + 1); //  Forcing timer to reset for every question
  };

  const onAnswerClick = (selectedAnswer, index) => {
    if (isAnswerChecked) return;
    setAnswerIdx(index);
  };

  const onClickNext = () => {
    if (isAnswerChecked) {
      setNextPressed(true); // Mark as pressed before moving to next
      setTimeout(() => {
        setNextPressed(false); // Reset for next question
        moveToNextQuestion();
      }, 1000);
    } else {
      checkAnswer();
    }
  };

  const checkAnswer = () => {
    // If it's an MCQ, check if the selected answer matches the correct one.
  // If it's an input question, compare user input with the correct answer (case insensitive)
    const isCorrect =
      type === "MCQS"
        ? choices[answerIdx] === correctAnswer
        : inputAnswer.trim().toLowerCase() === correctAnswer.toString().toLowerCase();

    setAnswer(isCorrect);
    setIsAnswerChecked(true);
// Automatically move to the next question after 1 second
    setTimeout(() => moveToNextQuestion(), 1000);
  };
 
  const moveToNextQuestion = () => {
    const isCorrect =
      type === "MCQS"
        ? choices[answerIdx] === correctAnswer
        : inputAnswer.trim().toLowerCase() === correctAnswer.toString().toLowerCase();
//handles the score and results
    setResult((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
      score: isCorrect ? prev.score + 5 : prev.score,
    }));

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
      saveAttempt({
        date: new Date().toLocaleString(),
        score: result.score + (isCorrect ? 5 : 0),
        correct: result.correct + (isCorrect ? 1 : 0),
        wrongAnswers: result.wrongAnswers + (isCorrect ? 0 : 1),
      });
    }
  };
//handles when pressed try again button
  const onTryAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
    setCurrentQuestion(0);
  };
//moves to the next question automatically on timeout
  const handleTimeUp = () => {
    setShowAnswerTimer(false);
//increases the count of wrong answers
    setResult((prev) => ({
      ...prev,
      wrongAnswers: prev.wrongAnswers + 1,
    }));

    setTimeout(() => {
      if (currentQuestion !== questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };
 // Returns the UI for input-type and MCQ-type questions
  const getAnswerUI = (type) => {
    
    if (type === "INPUT") { 
      return (
        <div className="input-answer-container">
          <input
            type="text"
            className={`quiz-input ${isAnswerChecked ? (answer ? "correct" : "wrong") : ""}`}
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            disabled={isAnswerChecked}
          />
          {isAnswerChecked && (
            <p className={answer ? "correct-answer-display" : "wrong-answer"}>
              {!answer && <span className="correct-answer-text">{correctAnswer}</span>} 
            </p>
            
          )}
        </div>
      );
    }
    return (
      <ul>
        {choices.map((choice, index) => (                //for MCQ type questions
          <li
            key={choice}
            onClick={() => onAnswerClick(choice, index)}
            className={
              isAnswerChecked
                ? answerIdx === index
                  ? answer
                    ? "correct-answer"
                    : "wrong-answer"
                    : choice === correctAnswer // Highlight correct answer if wrong is selected
                    ? "correct-answer"
                    : ""
                : answerIdx === index
                ? "selected-answer" //  Blue for selection
                : ""
            }
          >
            {choice}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="quiz-container">
      {!showResult ? (
        <>
          {showAnswerTimer && (
            <AnswerTimer key={resetKey} duration={30} onTimeUp={handleTimeUp} />
          )}
          <div className="quiz-header">
          
  <div className="question-number-container">
    <span className="question-number">
      Question {currentQuestion + 1} <span className="total-questions">/ {questions.length}</span>
    </span>

    {/* Progress bar */}
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
      ></div>
    </div>
  </div>

  <h2 className="quiz-question">{question}</h2>
</div>


          {getAnswerUI(type)}
            
          <div className="footer">
            <button
              onClick={onClickNext}  //handles the next button for displaying the next question
              disabled={
                (type === "INPUT" && inputAnswer.trim() === "" && !isAnswerChecked) ||
                (type === "MCQS" && answerIdx === null && !isAnswerChecked)
              }
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        // Displays the final scoreboard after completing the quiz
        <div className="result">
          <h3>ScoreBoard</h3>
          <p>
            Total Questions: <span>{questions.length}</span>
          </p>
          <p>
            Total Score: <span>{result.score}</span>
          </p>
          <p>
            Correct Answers: <span>{result.correct}</span>
          </p>
          <p>
            Wrong Answers: <span>{result.wrongAnswers}</span>
          </p>
          <button onClick={onTryAgain}>Try Again</button>

          <h3>Attempt History</h3>
          {attempts.length > 0 ? (
            <ul>
              {attempts.map((attempt, index) => (
                <li key={index}>
                  <strong>{attempt.date}</strong> - Score: {attempt.score} | Correct: {attempt.correct} | Wrong: {attempt.wrongAnswers}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attempts yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
