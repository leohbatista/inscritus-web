import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {
  public alertTitle = 'Alert';
  public alertDescription: string;
  public isOnlyConfirm: boolean;
  
  public hasTextDescription: boolean;
  public dataTextDescription: {
    placeholder: 'Descrição';
    errorMessage: 'Informe uma descrição';
    dataTextCtrl: '';
  };
  
  public hasSelectList: boolean;
  public dataSelectList: {
    placeholder: 'Opções';
    errorMessage: 'Selecione uma opção';
    dataList: [];
  };
  optionSelected: any;

  constructor(
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.alertTitle = data.alertTitle;
    this.alertDescription = `<p>` + data.alertDescription + `</p>`;
    this.isOnlyConfirm = data.isOnlyConfirm;
    this.hasTextDescription = data.hasTextDescription;
  
    if (this.hasTextDescription) {
      this.dataTextDescription = data.dataTextDescription;
    }

    this.hasSelectList = data.hasSelectList;
    
    if (this.hasSelectList) {
      this.dataSelectList = data.dataSelectList;
    }
  }

  ngOnInit() { }

  onOK() {
    if (this.hasTextDescription && !this.dataTextDescription.dataTextCtrl.trim()) {
      return;
    } else if (this.hasSelectList) {
      if (this.optionSelected) {
        this.dialogRef.close(this.optionSelected);
      } else {
        return;
      }
    } else {
      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
