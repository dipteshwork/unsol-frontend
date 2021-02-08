import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-custom-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {
  @Input('modalTitle') modalTitle: string;
  @Input('modalIcon') modalIcon: boolean;
  @Input('appLang') appLang: string;

  constructor(
  ) {
  }
}
