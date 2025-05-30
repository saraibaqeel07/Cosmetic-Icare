import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { ResourceConfig } from 'src/app/config/routes.config';
import { ADMIN, ROLES, ROLESEXPLAINED, userAndRoles, UserData } from 'src/app/interfaces/admin-interface';
import { HttpClientService } from 'src/app/services/http-client.service';
import { NewUserComponent } from '../componets/new-user/new-user.component';
import { PopupQuestionComponent } from '../componets/popup-question/popup-question.component';

@Component({
	selector: 'app-user-manage',
	templateUrl: './user-manage.component.html',
	styleUrls: ['./user-manage.component.scss']
})

export class UserManageComponent implements OnInit {
	userDataSub: Subscription;
	userData: UserData = null;
	usersAccGroup: userAndRoles[] = [];
	theRoles = [];
	theRolesExplained = [];
	rolesToUserAccGroup = {};
	toDeleteList = [];

	currentlyDragging = false;
	rolesList = {}
	groupList = {}
	yardList = []

	constructor(
		private httpClient: HttpClientService,
		public dialog: MatDialog,
	) { }

	async initForm() {
		this.rolesToUserAccGroup = {};
		this.theRoles.forEach((r, i) => {
			if (!this.rolesToUserAccGroup[i]) {
				this.rolesToUserAccGroup[i] = [];
			}
		});
		const usersAccGroup = [];
		let userAccounts = await this.httpClient.getUserAccounts().toPromise();
		console.log(userAccounts);
		
		const doneUserId = {};
		//get rid of the auto generated xml users
		userAccounts = userAccounts.filter(o => o.name !== "XML User");
		userAccounts.forEach((r, i) => {
			if (!doneUserId[r.userid]) {
				usersAccGroup.push(r);
			}

			doneUserId[r.userid] = " ";
			this.rolesToUserAccGroup[r.roleid].push(r);
		});

		this.usersAccGroup = usersAccGroup

		const roles = await this.httpClient.getRoles().toPromise();
		this.rolesList = roles;

		const allYards: any = await this.httpClient.getAllYards().toPromise();

		allYards.forEach(obj => {
			this.groupList[obj.S3GroupId] = obj.GroupName
		})

		const yards: any = await this.httpClient.getYards().toPromise()
		this.yardList = yards
	}

	drop(event: CdkDragDrop<string[]>) {

		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			const toMove = event.previousContainer.data[event.previousIndex];
			const alreadyIn = event.container.data.find(d => d['userid'] === toMove['userid']);
			if (alreadyIn) {
				return;
			}
			this.usersAccGroup.splice(event.previousIndex, 0, event.previousContainer.data[event.previousIndex] as unknown as userAndRoles);
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);

			this.changeUserRoles(toMove['userid']);

		}
	}


	changeUserRoles(userId: number, remove: boolean = false) {

		const roles = [];

		for (let rKey of Object.keys(this.rolesToUserAccGroup)) {
			for (let role of this.rolesToUserAccGroup[rKey]) {
				if (role.userid === userId) {
					roles.push({
						role: Number(rKey),
						GroupId: 0
					});
					continue;
				}
			}
		}

		if (!remove) {
			roles.push({
				role: AdminConfig.GROUPID,
				GroupId: this.httpClient.retrieveS3GroupId()
			});
		}

		this.httpClient.changeRoles({
			userId: userId,
			roles: roles
		}
		).subscribe(out => {
			this.initForm();
		});
	}

	manageUserDialog(user = null) {
		const dialogRef = this.dialog.open(NewUserComponent, {
			minWidth: '400px',
			maxWidth: '650px',
			data: {
				user: user
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.initForm();
		});
	}

	addRoleToUser(user: userAndRoles, roleId: number) {
		// console.log(this.rolesToUserAccGroup[roleId]);
		const alreadyInArr = this.rolesToUserAccGroup[roleId].find((a: userAndRoles) => {
			return a.userid === user.userid;
		});

		if (!alreadyInArr) {
			this.rolesToUserAccGroup[roleId].push(user);
			this.changeUserRoles(user.userid);
		}
	}

	dialogToAddRole(roleId: number) {
		const arrayToPass = this.usersAccGroup.filter((user: userAndRoles) => {
			const alreadyInArr = this.rolesToUserAccGroup[roleId].find((a: userAndRoles) => {
				return a.userid === user.userid;
			});
			return !alreadyInArr;
		});
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Add Role',
				question: `Choose the user you would like given the ${this.theRoles[roleId]} role`,
				confirm: 'Add Role to User',
				deny: 'Cancel',
				isconfirmed: false,
				otherData: {
					roleId: roleId,
					list: {
						listData: arrayToPass,
						listValue: 'userid',
						listDisplay: 'email',
						listChosen: null
					}
				}
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result.isconfirmed) {
				this.addRoleToUser(result.otherData.list.listChosen, result.otherData.roleId);
			}
		});
	}
	resendInvitation(user: userAndRoles) {
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Resending invitation',
				question: `Do you want to resend the email inviting ${(user.name) ? user.name : user.email} to join your group?`,
				confirm: 'Yes',
				deny: 'No',
				isconfirmed: false,
				otherData: {
					user: user
				}
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.isconfirmed) {
				this.httpClient.resendInvite(user.userid).subscribe(out => {

				});
			}
		});

	}
	deleteUser(user: userAndRoles) {
		//PopupQuestionComponent
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Removing account',
				question: `Are you sure you want to remove ${(user.name) ? user.name : user.email} from your account group?`,
				confirm: 'Yes',
				deny: 'No',
				isconfirmed: false,
				otherData: {
					user: user
				}
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.isconfirmed) {
				this.changeUserRoles(result.otherData.user.userid, true);
			}
		});
	}

	removeRole(user: userAndRoles, roleId: number) {
		//PopupQuestionComponent
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Remove Role',
				question: `Are you sure you want to delete this role from ${(user.name) ? user.name : user.email}?`,
				confirm: 'Yes',
				deny: 'No',
				isconfirmed: false,
				otherData: {
					user: user,
					roleId: roleId
				}
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.isconfirmed) {
				this.rolesToUserAccGroup[result.otherData.roleId] = this.rolesToUserAccGroup[result.otherData.roleId].filter(role => {
					return role.userid !== result.otherData.user.userid;
				});
				this.changeUserRoles(result.otherData.user.userid);
			}
		});
	}
	ngOnInit() {
		this.theRolesExplained = ROLESEXPLAINED;

		this.theRoles = ROLES.map((r, index) => {
			if (ADMIN.indexOf(r) !== -1 || index === AdminConfig.GROUPID) {
				r = '';
			}
			return r;
		});

		this.initForm();
		this.userDataSub = this.httpClient.getAdminUser().subscribe(user => {
			this.userData = user;
			this.initForm();
		});
	}
	ngOnDestroy() {
		this.userDataSub.unsubscribe();
	}
}
