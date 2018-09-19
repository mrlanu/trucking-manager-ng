import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface TaskModel {
  id: string;
  loadId: string;
  kind: string;
  date: Timestamp;
  time: string;
  address: string;
  employee: string;
  isCompleted: boolean;
  description: string;
}
