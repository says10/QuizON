import { useState } from 'react'
import './global.scss';
import Quiz from './assets/components/Quiz/Quiz';
import { gkQuiz } from './constants';

const App = () => {
  return (
    <div>
      {/* Global Quiz Header */}
      <header className="quiz-global-header">
        <div className="quiz-logo">
          <img src="/quiz-icon.png" alt="Quiz Icon" className="quiz-icon" />
          <span className="quiz-title">QuizON</span>
        </div>
        <span className="copyright">© Says10</span>
      </header>

      {/* Main Quiz Component */}
      <Quiz questions={gkQuiz.questions} />
    </div>
  );
};


export default App
