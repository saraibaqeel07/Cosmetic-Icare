import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
	selector: 'app-custom-questions',
	templateUrl: './custom-questions.component.html',
	styleUrls: ['./custom-questions.component.scss'],
})
export class CustomQuestionsComponent implements OnInit {
	@Input() questionsGroup: FormGroup;
	@Output() quotePrice = new EventEmitter<object>();
	totalPriceAdj = 0;
	questions: FormArray;
	questionsMandatory = false;
	constructor(private adminService: AdminService) {}

	ngOnInit(): void {
		if (this.questionsGroup) {
			this.questions = this.questionsGroup.get('questions') as FormArray;
		}
		this.adminService.getQuestionsMandatory().subscribe((data: any) => {
			this.questionsMandatory = data;
			this.updateQuestionValidators();
		});
	}

	updateQuestionValidators(): void {
		this.questions.controls.forEach((control) => {
			if (this.questionsMandatory) {
				control.setValidators(Validators.required);
			} else {
				control.clearValidators();
			}
			control.updateValueAndValidity();
		});
	}

	questionAnswer() {
		this.quotePrice.emit(this.questionsGroup.value);
	}
}
