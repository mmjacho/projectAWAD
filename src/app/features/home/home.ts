import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}

