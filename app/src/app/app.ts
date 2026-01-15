import { Component } from '@angular/core';
import { MindMapComponent } from './components/mindmap/mindmap.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MindMapComponent, NavbarComponent],
  template: `
    <app-mindmap #mindmap></app-mindmap>
    <app-navbar [mindmap]="mindmap"></app-navbar>
  `,
  providers: [NgbModal]
})
export class App {
  // We'll use template references to access the mindmap component
}
