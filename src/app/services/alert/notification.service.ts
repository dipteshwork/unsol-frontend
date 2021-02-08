import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message, title) {
    this.toastr.success(message, title);
  }

  showError(error, title) {
    if (error.status != 500) {
      const message =
        error.error &&
        (typeof error.error.error == 'string'
          ? error.error.error
          : error.error.message);
      this.toastr.error(message, title);
    }
  }

  showInfo(message, title) {
    this.toastr.info(message, title);
  }

  showWarning(message, title) {
    this.toastr.warning(message, title, {
      timeOut: 3000,
      easeTime: 300
      });
  }
}
