import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faGithub, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { AuthService } from 'src/app/auth/auth.service';
import { SpeakersService } from 'src/app/services/speakers.service';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { SpeakerDetailComponent } from 'src/app/components/speaker-detail/speaker-detail.component';
import { Speaker } from 'functions/src/speakers/speaker.model';
import { User } from 'functions/src/users/user.model';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss']
})
export class SpeakersComponent implements OnInit, OnDestroy {
  readonly faEnvelope = faEnvelope;
  readonly faFacebookSquare = faFacebookSquare;
  readonly faGithub = faGithub;
  readonly faInstagram = faInstagram;
  readonly faLinkedin = faLinkedin;
  readonly faTwitter = faTwitter;

  readonly defaultSpeakerImage = '../../assets/img/user-badge.png';

  isLoading = true;

  isCreateMode = false;
  editMode = [];

  speakers: Speaker[];
  speakersSubscription: Subscription;

  user: User;
  userSubscription: Subscription;

  newSpeaker = {
    bio: '',
    imageUrl: '',
    name: '',
    shortBio: '',
    social: {
      email: '',
      facebook: '',
      github: '',
      instagram: '',
      linkedIn: '',
      twitter: '',
    }
  };

  @ViewChild(FileUploadComponent, { static: false }) fileUploader: FileUploadComponent;

  constructor(
    private authService: AuthService,
    private speakersService: SpeakersService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.speakersSubscription = this.speakersService.getSpeakers().subscribe((speakers: Speaker[]) => {
      this.speakers = _.sortBy(speakers, ['name']);
      this.editMode = this.speakers?.map((s) => ({
        enabled: false,
        data: { ...s },
      })) || [];
      this.isLoading = false;
    });

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.speakersSubscription) { this.speakersSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  cancelSpeaker(): void {
    this.isCreateMode = false;
    this.clearNewSpeaker();
  }

  createSpeaker(): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar cadastro',
        alertDescription: 'Deseja realmente cadastrado este palestrante?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const speaker = {
          ...this.newSpeaker,
          imageUrl: this.fileUploader.getDocumentUrl()
        };

        this.speakersService.createSpeaker(speaker).then(() => {
          this.isCreateMode = false;
          this.clearNewSpeaker();
          this.snackbar.open('Palestrante cadastrado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating speaker', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao cadastrar',
              alertDescription: 'Não foi possível cadastrar o palestrante. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  clearNewSpeaker(): void {
    this.newSpeaker.name = '';
    this.newSpeaker.shortBio = '';
  }

  deleteSpeaker(postId): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar exclusão',
        alertDescription: 'Deseja realmente excluir este palestrante?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.speakersService.deleteSpeaker(postId).then(() => {
          this.snackbar.open('Palestrante excluído!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating speaker', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao excluir',
              alertDescription: 'Não foi possível excluir o palestrante. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  saveSpeaker(speakerId, i): void {
    console.log(this.editMode[i]);

    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Salvar palestrante',
        alertDescription: 'Deseja realmente salvar as alterações neste palestrante?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.speakersService.editSpeaker(speakerId, {
          ...this.editMode[i].data,
        }).then(() => {
          this.isCreateMode = false;
          this.clearNewSpeaker();
          this.snackbar.open('Palestrante editado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating speaker', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao salvar',
              alertDescription: 'Não foi possível editar o palestrante. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  cancelEditSpeaker(i: number): void {
    this.editMode[i] = {
      enabled: false,
      data: { ...this.speakers[i] }
    };
  }

  isNewSpeakerValid() {
    return this.newSpeaker.name && this.newSpeaker.shortBio;
  }

  isEditSpeakerValid(speaker) {
    return speaker.name && speaker.shortBio;
  }

  viewSpeaker(speaker: Speaker) {
    this.dialog.open(SpeakerDetailComponent, {
      maxWidth: '1000px',
      data: {
        speaker
      }
    });
  }

  editSpeakerImage(url, i) {
    this.editMode[i].data.imageUrl = url;
  }

  removeImage(i) {
    console.log(this.speakers[i], this.editMode[i]);

    this.editMode[i].data.imageUrl = '';

    console.log(this.speakers[i], this.editMode[i]);
  }
}
