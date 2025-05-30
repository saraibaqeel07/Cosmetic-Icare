import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { popupQuestion } from 'src/app/interfaces/admin-interface';

@Component({
  selector: 'app-popup-question',
  templateUrl: './popup-question.component.html',
  styleUrls: ['./popup-question.component.scss']
})
export class PopupQuestionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PopupQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: popupQuestion) { }

  ngOnInit(): void {
  }
  onNoClick(result: boolean): void {
    this.data.isconfirmed = result;
    this.dialogRef.close(this.data);
  }

}
