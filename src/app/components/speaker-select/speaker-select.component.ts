import { searchUsers } from './../../../../functions/src/users/users.handler';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Speaker } from 'functions/src/speakers/speaker.model';
import { SpeakersService } from 'src/app/services/speakers.service';

@Component({
  selector: 'app-speaker-select',
  templateUrl: './speaker-select.component.html',
  styleUrls: ['./speaker-select.component.scss']
})
export class SpeakerSelectComponent implements OnInit {
  readonly defaultSpeakerImage = '../../assets/img/user-badge.png';

  speakers: Speaker[];
  speakersSubscription: Subscription;

  filteredSpeakers: Speaker[];

  isLoading = true;
  searchValue = '';

  constructor(
    private dialogRef: MatDialogRef<SpeakerSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private speakersService: SpeakersService,
  ) { }

  ngOnInit(): void {
    this.speakersSubscription = this.speakersService.getSpeakers().subscribe((speakers: Speaker[]) => {
      this.speakers = _.sortBy(speakers, ['name']);
      this.filteredSpeakers = this.speakers;
      this.isLoading = false;
    });
  }

  searchSpeakers() {
    this.isLoading = true;
    this.filteredSpeakers = _.filter(this.speakers, s => s.name.trim().toUpperCase().indexOf(this.searchValue.trim().toUpperCase()) >= 0);
    this.isLoading = false;
  }

  onSelect(speaker: Speaker) {
    this.dialogRef.close(speaker);
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
