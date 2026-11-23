import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sesion } from '../../servicios/sesion';

@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panel.html',
})
export class Panel {
  protected readonly sesion = inject(Sesion);
}
