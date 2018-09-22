import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface LoadModel {

  id: string;
  broker: string;
  dispatch: string;
  rate: number;
  pickUpCount: number;
  unscheduledPickUpCount: number;
  deliveryCount: number;
  unscheduledDeliveryCount: number;
  weight: number;
  pallets: number;
  kind: string; /*dry | frozen etc.*/
  pickUpDate: Timestamp;
  pickUpAddress: string;
  deliveryDate: Timestamp;
  deliveryAddress: string;
  description: string;
  commodity: string;
}
