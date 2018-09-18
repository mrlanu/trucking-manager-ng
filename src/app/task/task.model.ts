import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface TaskModel {
  loadId: string;
  kind: string;
  date: Timestamp;
  address: string;
  employee: string;
  isCompleted: boolean;
  description: string;
}