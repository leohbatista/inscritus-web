import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() compact: boolean;
  @Input() image: boolean;
  @Input() path: boolean;

  @Output() upload = new EventEmitter<string>();

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  // State for appdropzone CSS toggling
  isHovering: boolean;

  @ViewChild('urlDocumentCtrl', { static: false }) documentUrl: ElementRef;

  constructor(
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
  ) { }

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  startUpload(event: FileList): void {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    const image = this.image !== undefined && this.image !== false && this.image !== null;

    if (image && file.type.split('/')[0] !== 'image') {
      console.error('Unsupported file type');
      this.snackbar.open('Formato não suportado! Insira apenas imagens.', null, {
        duration: 3000,
      });
      return;
    }

    // The storage path
    const path = `${this.path || 'general'}/${(new Date()).toISOString()}_${file.name.toUpperCase()}`;

    // Totally optional metadata
    const customMetadata = { app: 'Inscritus Web' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.storage.ref(path).getDownloadURL();
        const linkSubscription = this.downloadURL.pipe(take(1)).subscribe(url => {
          this.upload.emit(url);
          if (linkSubscription) { linkSubscription.unsubscribe(); }
        });
      })
    );
  }

  // Determines if the upload task is active
  isActive(snapshot): boolean {
    return (snapshot.state === 'running' || snapshot.state === 'paused') && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  getDocumentUrl(): string {
    if (this.documentUrl) {
      return this.documentUrl.nativeElement.value;
    } else {
      return null;
    }
  }
}
