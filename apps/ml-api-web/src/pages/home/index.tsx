import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonText,
  IonButton,
} from '@ionic/react';
import {
  book,
  build,
  grid,
  colorFill,
  checkboxOutline,
  documentTextOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import './home.css';
const Home = () => {
  const [redirect, setRedirect] = useState(false);
  const handleSubmit = () => {
    setRedirect(true);
  };
  if (redirect) return <Redirect to="/snap" />;
  return (
    <IonContent className="ion-text-center">
      <IonText>
        <h1>Welcome to Snapquiz</h1>
      </IonText>
      <IonText>
        <p style={{fontSize: '18px', fontWeight: 400}}>
          This platform will quiz you and teach the content from your notesheets
          in less than 5 minutes
        </p>
      </IonText>
      <br style={{ height: '10px' }}></br>
      <div className="center-align">
        <div className="welcome-card">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon
                  icon={documentTextOutline}
                  style={{ fontSize: '32px' }}
                />
              </IonCardTitle>
              <IonCardTitle>Scan Documents</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Our AI models are trained to read even the worst handwriting and
                scan them.
              </p>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={checkboxOutline} style={{ fontSize: '32px' }} />
              </IonCardTitle>
              <IonCardTitle>Prepares You</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                Our AI model not only akes tests, but it also fully perpares you
                with test-like questions.
              </p>
            </IonCardContent>
          </IonCard>
        </div>
      </div>
      <IonButton
        style={{ width: '100%' }}
        color="primary"
        onClick={handleSubmit}
      >
        Get Started!
      </IonButton>
    </IonContent>
  );
};

export default Home;
