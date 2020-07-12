import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faGithub, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Speaker } from 'functions/src/speakers/speaker.model';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.scss']
})
export class SpeakerDetailComponent implements OnInit {
  readonly faEnvelope = faEnvelope;
  readonly faFacebookSquare = faFacebookSquare;
  readonly faGithub = faGithub;
  readonly faInstagram = faInstagram;
  readonly faLinkedin = faLinkedin;
  readonly faTwitter = faTwitter;

  public speaker: Speaker;
  public alertDescription: string;
  public isOnlyConfirm: boolean;

  constructor(
    private dialogRef: MatDialogRef<SpeakerDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.speaker = data.speaker;
  }

  ngOnInit() { }

  onClose() {
    this.dialogRef.close(false);
  }

}
