import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface TaskModel {
  id: string;
  loadId: string;
  kind: string;
  date: Timestamp;
  time: string;
  address: {
    'address1': string,
    'address2': string,
    'city': string,
    'state': string,
    'zip': number
  };
  employee: string;
  isCompleted: boolean;
  crossDock: string;
  description: string;
}

export interface UnscheduledTasks {
  'unscheduledPickUp': number;
  'unscheduledDelivery': number;
}
