import {LoadModel} from './load.model';

export class LoadService {

  private loadList: LoadModel[] = [];

  createLoad(load: LoadModel) {
    this.loadList.push(load);
  }

  getLoadList(): LoadModel[] {
    return this.loadList.slice();
  }
}
