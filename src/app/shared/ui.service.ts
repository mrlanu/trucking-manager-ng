import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {Injectable} from '@angular/core';

@Injectable()
export class UiService {

  constructor(private snackBar: MatSnackBar) {}

  isLoadingChanged = new Subject<boolean>();
  isEmployeeModeChanged = new Subject<boolean>();

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
}
