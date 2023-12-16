import { useReducer } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { OcrResult } from '@snapquiz/types';
import axios from 'axios';
import { cameraSharp } from 'ionicons/icons';
import { API_URL } from "../../config";

import {
  IonAlert,
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonText,
} from '@ionic/react';
import LoadingPage from '../loading';
import TakeQuiz from '../quiz';

const ACTIONS = {
  ADD_TEXT: 'set_text',
  SET_PHOTORECIEVED: 'PhotoRecieved',
  SET_PHOTOVALID: 'photovalid',
  SHOWALERT: 'showalert',
  SET_ISFETCH: 'is_fetching',
  SET_SUBMITTED: 'set_submit',
  REMOVE_LAST_TEXT: 'remove_last_text',
};

type State = {
  text: Array<string> | [];
  photoRecieved: boolean;
  isValid: boolean;
  showAlert: boolean;
  fetching: boolean;
  submitted: boolean;
};
function removeLastEl(arr: Array<string>): Array<string> {
  const prevArr = [...arr];
  prevArr.splice(-1);
  return prevArr;
}
type ReducerAction = {
  type: string;
  payload: string | boolean;
};
function reducer(state: State, action: ReducerAction): State {
  switch (action.type) {
    case ACTIONS.ADD_TEXT:
      console.log(state.text);
      if (state.text.length === 0) {
        return { ...state, text: [`Page 1:\n${action.payload}`] };
      }
      return {
        ...state,
        text: [
          ...state.text,
          `Page ${state.text.length + 1}:\n${action.payload}`,
        ],
      };
    case ACTIONS.SET_PHOTORECIEVED:
      console.log(action.payload + 'photo recieved');
      if (typeof action.payload === 'string') {
        return state;
      }
      return { ...state, photoRecieved: action.payload };
    case ACTIONS.SET_PHOTOVALID:
      if (typeof action.payload === 'string') {
        return state;
      }
      return { ...state, isValid: action.payload };
    case ACTIONS.SHOWALERT:
      if (typeof action.payload === 'string') {
        return state;
      }
      return { ...state, showAlert: action.payload };
    case ACTIONS.SET_ISFETCH:
      if (typeof action.payload === 'string') {
        return state;
      }
      console.log(action.payload + 'fetch');
      return { ...state, fetching: action.payload };
    case ACTIONS.SET_SUBMITTED:
      if (typeof action.payload === 'string') {
        return state;
      }
      return { ...state, submitted: action.payload };
    case ACTIONS.REMOVE_LAST_TEXT:
      if (typeof action.payload === 'string') {
        return state;
      }
      if (state.text.length === 0) {
        return { ...state, text: [] };
      }
      return { ...state, text: removeLastEl(state.text) };
    default:
      return state;
  }
}
const Snap = () => {
  //   const [text, setText] = useState<Array<string>>([]);
  //   const [photoRecieved, setPhotoRecieved] = useState(false);
  //   const [isValid, setIsValid] = useState(false);
  //   const [showAlert, setShowAlert] = useState(false);
  //   const [fetching, setFetching] = useState(false);
  //   const [submitted, setSubmitted] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    text: [],
    photoRecieved: false,
    isValid: false,
    showAlert: false,
    fetching: false,
    submitted: false,
  });
  const { text, photoRecieved, isValid, showAlert, fetching, submitted } =
    state;
  console.log(
    'text: ',
    text,
    photoRecieved,
    isValid,
    showAlert,
    fetching,
    submitted
  );
  const takePicture = async () => {
    dispatch({ type: ACTIONS.SET_ISFETCH, payload: false });
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      width: 1024,
      resultType: CameraResultType.Base64,
    });

    const path = image.base64String ? image.base64String : '';
    dispatch({ type: ACTIONS.SET_ISFETCH, payload: true });

    try {
      console.log(path);

      const res = await axios.post(API_URL + "/v1/ocr-base64", {
        data: path,
      });
      const response: OcrResult = res.data;
      if (response.valid) {
        dispatch({ type: ACTIONS.SET_SUBMITTED, payload: true });
        dispatch({ type: ACTIONS.SET_PHOTOVALID, payload: response.valid });
        dispatch({ type: ACTIONS.ADD_TEXT, payload: response.text });
      } else {
        dispatch({ type: ACTIONS.SHOWALERT, payload: true });
        dispatch({ type: ACTIONS.SET_PHOTOVALID, payload: false });
        dispatch({ type: ACTIONS.ADD_TEXT, payload: response.text });
      }
      dispatch({ type: ACTIONS.SET_SUBMITTED, payload: true });
      dispatch({ type: ACTIONS.SET_ISFETCH, payload: false });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <IonPage>
      {photoRecieved && isValid ? (
        <TakeQuiz text={text?.join('\n\n\n')} />
      ) : (
        <IonContent>
          <div
            style={{
              textAlign: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              display: fetching ? 'none' : 'flex',
            }}
          >
            <IonText style={{ textAlign: 'center', width: '100%' }}>
              <h1>Take a picture</h1>
            </IonText>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              textAlign: 'center',
              width: '100%',
            }}
            className="ion-text-center"
          >
            <div style={{ height: '20px' }}></div>
            <IonButton onClick={takePicture} style={{ width: '100%' }}>
              <IonIcon
                icon={cameraSharp}
                style={{ fontSize: '40px' }}
              ></IonIcon>
            </IonButton>
          </div>
          {fetching && <LoadingPage />}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() =>
              dispatch({ type: ACTIONS.SHOWALERT, payload: false })
            }
            header={'Image is not a valid notesheet'}
            message={'Please try again'}
            buttons={[
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  dispatch({ type: ACTIONS.REMOVE_LAST_TEXT, payload: true });
                  dispatch({ type: ACTIONS.SET_PHOTOVALID, payload: true });
                },
              },
              {
                text: 'OVERRIDE',
                role: 'confirm',
                handler: () => {
                  dispatch({ type: ACTIONS.SET_PHOTOVALID, payload: true });
                },
              },
            ]}
          ></IonAlert>
          <IonAlert
            isOpen={submitted && isValid}
            onDidDismiss={() =>
              dispatch({ type: ACTIONS.SET_SUBMITTED, payload: false })
            }
            header={'Do you want to add another image?'}
            message="Add another image or submit to have a quiz made"
            buttons={[
              {
                text: 'Add another image',
                role: 'confirm',
                handler: () => {
                  takePicture();
                },
              },
              {
                text: 'Submit',
                role: 'cancel',
                handler: () => {
                  dispatch({ type: ACTIONS.SET_PHOTORECIEVED, payload: true });
                },
              },
            ]}
          />
        </IonContent>
      )}
    </IonPage>
  );
};

export default Snap;
