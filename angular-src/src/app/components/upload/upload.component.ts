import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  filesToUpload: Array<File> = [];
  constructor(private uploadService: UploadService) { }

  ngOnInit() {
  }

  upload() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);

    for (let i = 0; i < files.length; i++) {
        formData.append('uploads[]', files[i], files[i]['name']);
    }
    console.log('form data variable :   ' + formData.toString());
    this.uploadService.uploadFiles(formData).subscribe(
      res => {
        console.log(res);
        this.uploadService.processDocuments().subscribe(
          resp => {
            console.log(resp);
          }
        );
      }
    );
  }

  fileChangeEvent(fileInput: any) {
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
