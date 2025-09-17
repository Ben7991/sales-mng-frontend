import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "@shared/components/header/header.component";
import { SidenavComponent } from "@shared/components/sidenav/sidenav.component";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, HeaderComponent, SidenavComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

}
