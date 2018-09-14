import {LoadModel} from './load.model';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class LoadService {

  private loadList: LoadModel[] = [];
  loadsChanged = new Subject<LoadModel[]>();

  constructor(private db: AngularFirestore) {}

  addLoad(load: LoadModel) {
    this.db.collection('loads').add(load).then(result => {
      const id = result.id;
      this.db.doc(`loads/${id}`).update({id: id});
      });
  }

  fetchAvailableLoads() {
    this.db
      .collection('loads')
      .snapshotChanges()
      .pipe(map(docsArray => {
        return docsArray.map(doc => {
          return {
            ...doc.payload.doc.data()
          };
        });
      })).subscribe((loads: LoadModel[]) => {
        this.loadList = loads;
        this.loadsChanged.next([...this.loadList]);
        }
      );
  }

}
