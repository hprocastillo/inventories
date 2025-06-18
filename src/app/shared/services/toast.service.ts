import {Injectable, TemplateRef} from '@angular/core';
import {Toast} from '../interfaces/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({textOrTpl, ...options});
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showSuccess(message: string) {
    this.show(message, {classname: 'bg-success text-light', delay: 5000});
  }

  showError(message: string) {
    this.show(message, {classname: 'bg-danger text-light', delay: 5000});
  }
}
