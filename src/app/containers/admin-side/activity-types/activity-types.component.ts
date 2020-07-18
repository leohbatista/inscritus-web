import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivityType } from 'functions/src/activities/activity.model';
import { AdminActivitiesService } from 'src/app/services/admin-activities.service';
import * as _ from 'lodash';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss']
})
export class ActivityTypesComponent implements OnInit, OnDestroy {

  isLoading = true;

  isCreateMode = false;
  editMode = [];

  types: ActivityType[];
  typesSubscription: Subscription;

  newType = {
    name: '',
    description: '',
  };

  constructor(
    private adminActivitiesService: AdminActivitiesService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.typesSubscription = this.adminActivitiesService.getActivityTypes().subscribe((types: ActivityType[]) => {
      this.types = _.sortBy(types, ['name']);
      this.editMode = this.types?.map(t => ({
        enabled: false,
        data: {
          id: t.id,
          name: t.name,
          description: t.description,
        }
      })) || [];
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.typesSubscription) { this.typesSubscription.unsubscribe(); }
  }

  cancelCreateType(): void {
    this.isCreateMode = false;
    this.clearNewType();
  }

  createType(): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar criação',
        alertDescription: 'Deseja realmente criar este tipo?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const type = {
          ...this.newType,
        };

        this.adminActivitiesService.createActivityType(type).then(() => {
          this.isCreateMode = false;
          this.clearNewType();
          this.snackbar.open('Tipo criado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating activity type', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao criar',
              alertDescription: 'Não foi possível criar o tipo. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  clearNewType(): void {
    this.newType.name = '';
    this.newType.description = '';
  }

  deleteType(typeId): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar exclusão',
        alertDescription: 'Deseja realmente excluir este tipo?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.adminActivitiesService.deleteActivityType(typeId).then(() => {
          this.snackbar.open('Tipo excluído!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating activity type', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao excluir',
              alertDescription: 'Não foi possível excluir o tipo. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  saveType(typeId, i): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Salvar tipo',
        alertDescription: 'Deseja realmente salvar as alterações neste tipo?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.adminActivitiesService.editActivityType(typeId, this.editMode[i].data).then(() => {
          this.isCreateMode = false;
          this.clearNewType();
          this.snackbar.open('Tipo editado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating activity type', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao salvar',
              alertDescription: 'Não foi possível editar o tipo. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  cancelEditType(i: number): void {
    this.editMode[i] = {
      enabled: false,
      data: {
        name: this.types[i]?.name || '',
        description: this.types[i]?.description || '',
      }
    };
  }

}
