import { Component,computed  } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header,Sidebar ,Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUrl = computed(() => this.router.url);
  constructor(public auth: AuthService, private router: Router) {}
}
