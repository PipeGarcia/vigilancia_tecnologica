import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadService {

  constructor(private http: Http) { }

  uploadFiles(formData) {
    return this.http.post('/articles/fileUpload', formData)
      .map(files => files.json());
  }

  processDocuments() {
    return this.http.post('/articles/processDocuments', '')
      .map(files => files.json());
  }
}
