import {Component, inject, TemplateRef} from '@angular/core';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [NgForOf, NgbToastModule, NgClass, NgTemplateOutlet, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  /** injects **/
  public toastService = inject(ToastService);

  isTemplate(toast: any): toast is TemplateRef<any> {
    return toast instanceof TemplateRef;
  }
}
