export interface LoadModel {

  id: string;
  broker: string;
  rate: number;
  weight: number;
  pallets: number;
  kind: string; /*dry | frozen etc.*/
  pickUp: Date;
  pickUpAddress: string;
  delivery: Date;
  deliveryAddress: string;
  description: 'string';
}
