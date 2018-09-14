export interface LoadModel {

  id: string;
  broker: string;
  rate: number;
  weight: number;
  pallets: number;
  kind: string; /*dry | frozen etc.*/
  pickUpDate: Date;
  pickUpAddress: string;
  deliveryDate: Date;
  deliveryAddress: string;
  description: string;
  commodity: string;
}
