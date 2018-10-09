import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import {AddressModel} from '../shared/address.model';

export interface TaskModel {
  id: string;
  loadId: string;
  kind: string;
  date: Timestamp;
  time: string;
  address: AddressModel;
  employee: string;
  isCompleted: boolean;
  description: string;
  crossTask: CrossTask;
}

export interface UnscheduledTasks {
  'unscheduledPickUp': number;
  'unscheduledDelivery': number;
}

export interface CrossTask {
  address: AddressModel;
  isCompleted: boolean;
}
