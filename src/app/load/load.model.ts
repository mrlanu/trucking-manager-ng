export class LoadModel {

  constructor(private _id: string,
              private _multistop: boolean,
              private _kind: 'dry' | 'frozen' | 'chilled',
              private _pickUpDate: Date[],
              private _deliveryDate: Date[],
              private _pickUpAddress: { number: string; street: string; city: string; state: string; unit?: string }[],
              private _deliveryAddress: { number: string; street: string; city: string; state: string; unit?: string }[],
              private _status: 'ready for pickup' | 'delayed' | 'completed' | 'on the dock') {
    this._id = _id;
    this._multistop = _multistop;
    this._kind = _kind;
    this._pickUpDate = _pickUpDate;
    this._deliveryDate = _deliveryDate;
    this._pickUpAddress = _pickUpAddress;
    this._deliveryAddress = _deliveryAddress;
    this._status = _status;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get multistop(): boolean {
    return this._multistop;
  }

  set multistop(value: boolean) {
    this._multistop = value;
  }

  get kind(): 'dry' | 'frozen' | 'chilled' {
    return this._kind;
  }

  set kind(value: 'dry' | 'frozen' | 'chilled') {
    this._kind = value;
  }

  get pickUpDate(): Date[] {
    return this._pickUpDate;
  }

  set pickUpDate(value: Date[]) {
    this._pickUpDate = value;
  }

  get deliveryDate(): Date[] {
    return this._deliveryDate;
  }

  set deliveryDate(value: Date[]) {
    this._deliveryDate = value;
  }

  get pickUpAddress(): { number: string; street: string; city: string; state: string; unit?: string }[] {
    return this._pickUpAddress;
  }

  set pickUpAddress(value: { number: string; street: string; city: string; state: string; unit?: string }[]) {
    this._pickUpAddress = value;
  }

  get deliveryAddress(): { number: string; street: string; city: string; state: string; unit?: string }[] {
    return this._deliveryAddress;
  }

  set deliveryAddress(value: { number: string; street: string; city: string; state: string; unit?: string }[]) {
    this._deliveryAddress = value;
  }

  get status(): 'ready for pickup' | 'delayed' | 'completed' | 'on the dock' {
    return this._status;
  }

  set status(value: 'ready for pickup' | 'delayed' | 'completed' | 'on the dock') {
    this._status = value;
  }
}
