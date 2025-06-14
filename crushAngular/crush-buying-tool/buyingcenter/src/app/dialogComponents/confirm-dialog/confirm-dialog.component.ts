import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { confirmDialog } from 'src/app/interfaces/call-center.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
			@Inject(MAT_DIALOG_DATA) public data: confirmDialog) { }

  ngOnInit(): void {
  }
		denyClick() {
			this.dialogRef.close(false);
		}
		confirmClick() {
			this.dialogRef.close(true);
		}
}
