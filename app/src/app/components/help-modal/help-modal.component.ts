import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [],
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {
  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
