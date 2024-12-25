'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const questions = [
    {
      question: 'What is the name of my dog?',
      answers: ['Bobby', 'The better zola', 'Isis', 'willdog'],
      correct: 2,
    },
    {
      question: 'Which disneyland are you going to next year? :o',
      answers: ['shanghai', 'the new one in indo', 'japan', 'none lol sucks to be me'],
      correct: 3,
      timed: true, // Timed question with a bomb
    },
    {
      question: 'How heavy is santa?',
      answers: ['nobody knows', '260 pounds', 'really really fat', 'heavy'],
      correct: 1,
    },
    {
      question: '10 - 6 = ?',
      answers: ['10', '?', 'math', 'ga lulus SD'], // All answers are wrong
      timed: true,
      correct: -1, // No correct answer; player must click the question number
    },
    {
      question: 'typing', // Special question type
      type: 'typing',
      sequence: ['Z', 'O', 'L', 'A'], // Typing sequence
    },
    {
      question: 'Where do pirates hide their Xmas gifts?',
      answers: ['Under the Sea', 'In a Treasure Chest', 'In a Ship', 'On an Island'],
      correct: -1, // No correct answer; player must click the "X" in "Xmas"
      type: 'clickX',
    },
    {
      question: 'I hope you paid attention to the question number lol',
      answers: ['6', '9', '7', '8'],
      correct: 2,
    },
    {
      question: "Once upon a time, there was a chicken named Bob. Bob wasn’t like other chickens—he dreamed of adventure, crossing roads not for the other side, but for discovery. One day, he found a strange map in the coop and decided to leave. Along the way, Bob faced many challenges: dodging dogs, crossing puddles, and outsmarting greedy pigeons. He felt free, unstoppable—until he stumbled upon something shocking.Wow, you’re still reading this, lol. There’s a bomb. Just click the question number to continue. Blablablablabla. Keep scrolling. Blablablablabla. Are you still here? Blablablablabla. Don't worry, Bob’s adventure continues!",
      answers: ['okay', 'cant read all this', 'im dead', 'click to pause bomb'], // All answers are wrong
      correct: -1, // No correct answer; player must click the question number
      timed: true,
    },
    {
      question: 'rate this quiz',
      answers: ['5/5!!!', 'shit', 'needs improvement', '3/5'],
      correct: 0,
    },
    {
      question: 'Is this the last question?',
      answers: ['yes', 'no', 'maybe', 'not sure'],
      correct: 1,
    },
    {
      question: 'OK, how about now, is this the last question?',
      answers: ['yes', 'no', 'theres still 5 more', 'this quiz is AI generated'],
      correct: 0,
    },
    
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [lostLife, setLostLife] = useState(false); // For life animation
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(null); // For timed questions
  const [explosion, setExplosion] = useState(false); // Explosion GIF state
  const [gameOver, setGameOver] = useState(false); // Game over state
  const [winner, setWinner] = useState(false); // Winner state
  const [typingProgress, setTypingProgress] = useState(0); // Track typing progress
  const [showDog, setShowDog] = useState(false); // Show dog picture
  const audioRef = useRef();

  const startGame = () => {
    setGameStarted(true);
    audioRef.current.play();
  };

  const handleAnswerClick = (index) => {
    if (questions[currentQuestion].correct === index) {
      setScore(score + 1);
      moveToNextQuestion();
    } else {
      loseLife();
    }
  };

  const handleClickOnXmas = () => {
    if (questions[currentQuestion]?.type === 'clickX') {
      setScore(score + 1); // Correct answer for trick question
      moveToNextQuestion();
    }
  };

  const loseLife = () => {
    setLostLife(true); // Trigger life animation
    setTimeout(() => setLostLife(false), 500); // Reset animation state

    setLives((prev) => {
      const updatedLives = prev - 1;
      if (updatedLives <= 0) triggerGameOver();
      return updatedLives;
    });
  };

  const handleTypingInput = (e) => {
    const question = questions[currentQuestion];
    if (question.type === 'typing') {
      const currentLetter = question.sequence[typingProgress];
      if (e.key.toUpperCase() === currentLetter) {
        setTypingProgress(typingProgress + 1); // Move to the next letter
        if (typingProgress + 1 === question.sequence.length) {
          // Sequence completed
          setShowDog(true);
          setTimeout(() => {
            setShowDog(false);
            moveToNextQuestion();
          }, 2000);
        }
      } else {
        loseLife(); // Lose a life on incorrect typing
        setTypingProgress(0); // Reset progress
      }
    }
  };

  const handleQuestionNumberClick = () => {
    if (currentQuestion === 3 || currentQuestion === 7) {
      setScore(score + 1); // Correct answer for trick question
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    setTimer(null); // Clear timer for the next question
    setTypingProgress(0); // Reset typing progress
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setWinner(true); // All questions answered
    }
  };

  useEffect(() => {
    if (questions[currentQuestion]?.timed) {
      let countdown = 10; // Start countdown from 10 seconds
      const interval = setInterval(() => {
        setTimer(countdown);
        if (countdown <= 0) {
          clearInterval(interval);
          triggerBombExplosion(); // Trigger explosion when timer reaches 0
        }
        countdown -= 1;
      }, 1000);

      return () => clearInterval(interval); // Clean up the interval
    } else {
      setTimer(null); // Reset the timer for non-timed questions
    }
  }, [currentQuestion]);

  const triggerBombExplosion = () => {
    setExplosion(true); // Show explosion GIF
    setGameOver(true); // Instantly transition to game over
    setTimer(null); // Stop any active timers
    setTimeout(() => setExplosion(false), 2000); // Hide the explosion GIF after 2 seconds
  };

  const triggerGameOver = () => {
    setGameOver(true); // Mark game as over
    setLives(0); // Set lives to 0
  };

  useEffect(() => {
    if (questions[currentQuestion]?.type === 'typing') {
      window.addEventListener('keydown', handleTypingInput);
    }
    return () => window.removeEventListener('keydown', handleTypingInput);
  }, [currentQuestion, typingProgress]);

  return (
    <div style={{
      fontFamily: '"Comic Sans MS", cursive',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundImage: 'url("/bg.jpeg")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      color: '#fff',
      padding: '20px',
      position: 'relative',
    }}>
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/christmas-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {!gameStarted ? (
        // Title Screen
        <div>
          <h1 style={{
            color: '#ff0000',
            textShadow: '2px 2px 4px #000',
            fontSize: '3rem',
          }}>🎄 Welcome to the Christmas Quiz 🎄</h1>
          <button onClick={startGame} style={{
            margin: '20px',
            padding: '15px 40px',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.3)',
          }}>
            Play
          </button>
        </div>
      ) : winner ? (
        // Winner Screen
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}>
          <h1 style={{
            color: '#00ff00',
            textShadow: '2px 2px 4px #000',
            fontSize: '4rem',
          }}>🎉 Congratulations! You Won! 🎉</h1>
          <h2 style={{ fontSize: '2rem' }}>Your gift is: check my whatsapp pfp</h2>
          <button onClick={() => location.reload()} style={{
            margin: '20px',
            padding: '15px 40px',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '15px',
          }}>
            Play Again
          </button>
        </div>
      ) : gameOver ? (
        // Loser Screen
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: explosion ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        }}>
          {explosion && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/explosion.gif")',
              backgroundSize: 'cover',
              zIndex: 10,
            }} />
          )}
          {!explosion && (
            <>
              <h1 style={{
                color: '#ff0000',
                textShadow: '2px 2px 4px #000',
                fontSize: '4rem',
                zIndex: 11,
              }}>💥 Game Over 💥</h1>
              <button onClick={() => location.reload()} style={{
                margin: '20px',
                padding: '15px 40px',
                fontSize: '20px',
                cursor: 'pointer',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
              }}>
                Play Again
              </button>
            </>
          )}
        </div>
      ) : (
        // Game Screen
        <div style={{ width: '100%', maxWidth: '700px' }}>
          {/* Question Number */}
{currentQuestion !== 6 && ( // Hide the question number for Question 7
  <div
    onClick={handleQuestionNumberClick}
    style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#ff6347',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px #000',
      cursor: currentQuestion === 3 ? 'pointer' : 'default',
    }}
  >
    {currentQuestion + 1}
  </div>
)}

          {/* Timer Bomb */}
          {timer !== null && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '150px',
              height: '150px',
              backgroundImage: 'url("/bomb.png")',
              backgroundSize: 'cover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px #000',
            }}>
              {timer}
            </div>
          )}

          {showDog ? (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img src="/dog.jpg" alt="Dog" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          ) : (
            <>
              {/* Question or Typing Prompt */}
              <h2 style={{
  fontSize: currentQuestion === 7 ? '1.5rem' : '3rem', // Smaller text for the last question
  marginBottom: '30px',
  textShadow: '2px 2px 4px #000',
}}>
  {questions[currentQuestion].type === 'typing' ? (
    `Type ${questions[currentQuestion].sequence[typingProgress]}`
  ) : questions[currentQuestion].type === 'clickX' ? (
    <>
      Where do pirates hide their{" "}
      <span
        onClick={handleClickOnXmas}
        style={{
          color: "#ff0000",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        X
      </span>
      mas gifts?
    </>
  ) : (
    questions[currentQuestion].question
  )}
</h2>


              {/* Answer Options */}
              {questions[currentQuestion].type !== 'typing' &&
                 (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                  }}>
                    {questions[currentQuestion].answers.map((answer, index) => (
                      <div
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        style={{
                          padding: '40px',
                          backgroundColor: '#ff6347',
                          color: '#fff',
                          border: '3px solid #fff',
                          borderRadius: '15px',
                          fontSize: '2rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.5)',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {answer}
                      </div>
                    ))}
                    
                  </div>
                  
                )}
                <h3
            className={lostLife ? 'animate-life' : ''}
            style={{
              fontSize: '1.8rem',
              marginTop: '30px',
              color: lostLife ? '#ff0000' : '#ff6347',
              transition: 'color 0.3s',
            }}
          >
            Lives: {lives}
          </h3>
            </>
          )}
        </div>
      )}
    </div>
  );
}
