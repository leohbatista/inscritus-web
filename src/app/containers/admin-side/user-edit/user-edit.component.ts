import { Component, OnInit, OnDestroy } from '@angular/core';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import { Subscription } from 'rxjs';
import { User } from 'functions/src/users/user.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { formatPhone } from 'src/app/common/utils';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  readonly userTypes = [
    {
      name: 'common-user',
      label: 'Participante',
    },
    {
      name: 'admin',
      label: 'Admin',
    },
  ]

  readonly MASKS = MASKS;
  readonly formatPhone = formatPhone;

  userSubscription: Subscription;
  user: User;
  uid: string;

  editUserFormGroup: FormGroup;
  userType: string;

  isLoading = true;

  constructor(
    private adminUsersService: AdminUsersService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    
    this.editUserFormGroup = this.formBuilder.group({
      nameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      phoneCtrl: new FormControl('', [Validators.required]),
      cpfCtrl: new FormControl('', [Validators.required, NgBrazilValidators.cpf]),
      typeCtrl: new FormControl('', [Validators.required]),
      activeCtrl: new FormControl(false),
      verifiedCtrl: new FormControl(false),
    });

    this.userSubscription = this.adminUsersService.getUserByUID(this.uid).subscribe(user => {      
      this.user = user;

      if(user) {
        this.fillUserData();
      }

      this.isLoading = false;
    })
    
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  editUser(): void {
    if(this.editUserFormGroup.valid) {
      this.isLoading = true;

      this.adminUsersService.editUser({
        uid: this.uid,
        name: (this.editUserFormGroup.get('nameCtrl').value as string).trim().toUpperCase(),
        email: (this.editUserFormGroup.get('emailCtrl').value as string).trim().toLowerCase(),
        phone: (this.editUserFormGroup.get('phoneCtrl').value as string).trim(),
        cpf: (this.editUserFormGroup.get('cpfCtrl').value as string).trim(),
        isAdmin: this.editUserFormGroup.get('typeCtrl').value === 'admin',
        emailVerified: this.editUserFormGroup.get('verifiedCtrl').value,
        isActive: this.editUserFormGroup.get('activeCtrl').value,
      }).then(res => {
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Alteração realizada',
            alertDescription: 'O usuário foi alterado com sucesso.',
            isOnlyConfirm: true
          }
        })
      }).catch(err => {
        console.error(err);
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Erro',
            alertDescription: 'Ocorreu um erro ao editar usuário. Tente novamente mais tarde.',
            isOnlyConfirm: true
          }
        })
      }).finally(() => {
        this.isLoading = false;
      });
    }
  }
  
  fillUserData(): void {
    this.editUserFormGroup.get('nameCtrl').setValue(this.user?.name || '');
    this.editUserFormGroup.get('emailCtrl').setValue(this.user?.email || '');
    this.editUserFormGroup.get('phoneCtrl').setValue(this.user?.phone || '');
    this.editUserFormGroup.get('cpfCtrl').setValue(this.user?.cpf || '');
    this.editUserFormGroup.get('typeCtrl').setValue(this.user.isAdmin ? 'admin' : 'common-user');
    this.editUserFormGroup.get('activeCtrl').setValue(!!this.user.isActive);
    this.editUserFormGroup.get('verifiedCtrl').setValue(!!this.user.emailVerified);
    if(this.user.emailVerified) {
      this.editUserFormGroup.get('verifiedCtrl').disable();
    }
  }

}
