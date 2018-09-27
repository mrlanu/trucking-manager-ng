import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-delete-all-tasks',
  template: `<h1 mat-dialog-title>Do you really want to delete ?</h1>
            <mat-dialog-content>
              <!--<p>You have {{ passedData.numberTasks }} for delete</p>-->
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="center" fxLayoutGap="15px">
              <button mat-raised-button [mat-dialog-close]="true">Yes</button>
              <button mat-raised-button [mat-dialog-close]="false">No</button>
            </mat-dialog-actions>`
})
export class DeleteConfirmComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}

}
