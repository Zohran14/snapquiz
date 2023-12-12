import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonRadioGroup,
  IonList,
  IonItem,
  IonRadio,
  IonLabel,
  IonText,
  IonIcon,
} from '@ionic/react';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import './quiz.css';
import LoadingPage from '../loading/LoadingPage';
import useQuizData from '../../hooks/useQuizData';
import { API_URL } from "../../config";

interface Question {
  questionName: string;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  answer: string;
}

interface QuizQuestionProps {
  question: Question;
  isSubmitted: boolean;
  selectedAnswer: string;
  handleAnswerChange: (e: CustomEvent) => void;
  handleSubmit: () => void;
}

interface TakeQuizProps {
  text: string;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  isSubmitted,
  selectedAnswer,
  handleAnswerChange,
  handleSubmit,
}) => {
  const getClassName = (
    option: string,
    correctAnswer: string,
    selectedAnswer: string
  ): string => {
    if (!isSubmitted) {
      return '';
    }
    if (option === selectedAnswer || option === correctAnswer) {
      if (correctAnswer === selectedAnswer) {
        return 'bg-green';
      } else {
        if (option === correctAnswer) {
          return 'bg-green';
        }
        return 'bg-red';
      }
    } else {
      return '';
    }
  };
  return (
    <IonList
      style={{ marginTop: '30px', marginBottom: '50px' }}
      className="fade-in"
    >
      <IonText
        style={{ fontWeight: 700, fontsize: '25px' }}
        className="ion-text-wrap"
      >
        {question.questionName}
      </IonText>
      <br />
      <br />
      <br />
      <IonRadioGroup
        value={selectedAnswer}
        onIonChange={handleAnswerChange}
        className="circle-radio ion-text-center"
      >
        <IonList>
          <IonItem
            className={getClassName('a', question.answer, selectedAnswer)}
          >
            <IonRadio slot="start" value="a" mode="md" legacy={true} />
            <IonLabel className="ion-text-center label-radio">
              {question.a}
            </IonLabel>
          </IonItem>
          <IonItem
            className={getClassName('b', question.answer, selectedAnswer)}
          >
            <IonRadio slot="start" value="b" mode="md" legacy={true} />
            <IonLabel className="ion-text-center label-radio">
              {question.b}
            </IonLabel>
          </IonItem>
          <IonItem
            className={getClassName('c', question.answer, selectedAnswer)}
          >
            <IonRadio slot="start" value="c" mode="md" legacy={true} />
            <IonLabel className="ion-text-center label-radio">
              {question.c}
            </IonLabel>
          </IonItem>
          <IonItem
            className={getClassName('d', question.answer, selectedAnswer)}
          >
            <IonRadio slot="start" value="d" mode="md" legacy={true} />
            <IonLabel className="ion-text-center label-radio">
              {question.d}
            </IonLabel>
          </IonItem>
          <IonItem
            className={getClassName('e', question.answer, selectedAnswer)}
          >
            <IonRadio slot="start" value="e" mode="md" legacy={true} />
            <IonLabel className="ion-text-center label-radio">
              {question.e}
            </IonLabel>
          </IonItem>
        </IonList>
      </IonRadioGroup>
      <br style={{ height: '20px' }} />
      <IonButton
        onClick={handleSubmit}
        style={{ width: '30%' }}
        disabled={isSubmitted}
      >
        Submit
      </IonButton>
      {isSubmitted && (
        <div
          className={
            question.answer === selectedAnswer
              ? 'alert alert-success'
              : 'alert alert-danger'
          }
        >
          {question.answer === selectedAnswer ? (
            <h3>Correct</h3>
          ) : (
            <h3>
              Your answer was incorrect. The correct answer is{' '}
              <strong style={{ fontWeight: 900 }}>
                {question.answer.toUpperCase()}
              </strong>
            </h3>
          )}
        </div>
      )}
    </IonList>
  );
};

const TakeQuiz: React.FC<TakeQuizProps> = ({ text }) => {
  const [currentNum, setCurrentNum] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('a');
  const { data, error, isLoading } = useQuizData(
    API_URL + '/v1/create-quiz',
    text
  );

  const handleAnswerChange = (e: CustomEvent) => {
    setSelectedAnswer(e.detail.value);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!data) return;
    setCurrentNum((num) => (num < data.length - 1 ? num + 1 : num));
    setIsSubmitted(false);
    setSelectedAnswer('');
  };

  const handlePreviousQuestion = () => {
    setCurrentNum((num) => (num > 0 ? num - 1 : num));
    setIsSubmitted(false);
    setSelectedAnswer('');
  };
  if (error) return (<IonContent className='ion-text-center'>Error: {error}</IonContent>)
  if (isLoading)
    return (
      <IonContent>
        <LoadingPage />
      </IonContent>
    );

  return (
    <IonContent
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {data.length > 0 && (
        <>
          <QuizQuestion
            question={data[currentNum]}
            isSubmitted={isSubmitted}
            selectedAnswer={selectedAnswer}
            handleAnswerChange={handleAnswerChange}
            handleSubmit={handleSubmit}
          />
          <div className="button-container">
            <IonButton
              onClick={handlePreviousQuestion}
              disabled={currentNum === 0 || !isSubmitted}
              style={{ width: '120px', marginRight: '5px' }}
            >
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
            <IonButton
              onClick={handleNextQuestion}
              disabled={currentNum === data.length - 1 || !isSubmitted}
              style={{ width: '120px', marginLeft: '5px' }}
            >
              <IonIcon icon={arrowForwardOutline} />
            </IonButton>
          </div>
        </>
      )}
    </IonContent>
  );
};

export default TakeQuiz;
