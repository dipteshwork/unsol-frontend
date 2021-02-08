import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-language-bar',
  templateUrl: './language-bar.component.html',
  styleUrls: ['./language-bar.component.scss'],
})
export class LanguageBarComponent {
  @Input('lang') lang: string;
  @Input('langArr') langArr: string;

  constructor() {
  }

  @Output() childChangeLangEvent = new EventEmitter<string>();
  changeLang(lang: string) {
    this.childChangeLangEvent.emit(lang);
  }
}
