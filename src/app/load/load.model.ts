import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface LoadModel {

  id: string;
  date: Timestamp;
  broker: string;
  dispatch: string;
  rate: number;
  weight: number;
  pallets: number;
  kind: string; /*dry | frozen etc.*/
  description: string;
  commodity: string;
  task: {
    pickUpCount: number;
    unscheduledPickUpCount: number;
    deliveryCount: number;
    unscheduledDeliveryCount: number;
  };
  warehouse: string;
}
