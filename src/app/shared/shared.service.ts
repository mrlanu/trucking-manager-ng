import {Subject} from 'rxjs';

export class SharedService {
  isLoadingChanged = new Subject<boolean>();
  isEmployeeModeChanged = new Subject<boolean>();
}
