import Timestamp = firebase.firestore.Timestamp;
import * as firebase from '../../../../node_modules/firebase';

export interface LogModel {
  date: Timestamp;
  description: string;
  employee: string;
  loadId: string;
}
