import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';

interface MenuItem {
  id?: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  mobileMenuOpen = false;

  hoverLevel1: string | null = null;
  hoverLevel2: string | null = null;
  hoverLevel3: string | null = null; // <-- NUEVA LÍNEA

  readonly companyName = signal('AgroCafé Admin');

  constructor(
    private router: Router,
    private autoriza: AuthService
  ) {}

  // 👉 Aquí ya NO usamos field initializer con this.autoriza
  get logueadoCabecera(): boolean {
    return this.autoriza.isLoggedIn();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onAboutClick(): void {
    this.router.navigate(['/home']);
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onLogoutClick(): void {
    this.autoriza.logout();
  }

  navigateTo(route?: string) {
    if (!route) return;
    this.router.navigate([route]);
    this.hoverLevel1 = null;
    this.hoverLevel2 = null;
    this.hoverLevel3 = null; // <-- NUEVA LÍNEA
  }

  // ===============================
  //   MENÚ CON TRES NIVELES
  // ===============================
  menuItems: MenuItem[] = [

    {
      id: 'base',
      label: 'Base y Usuarios',
      children: [
        { label: 'Usuarios', icon: 'manage_accounts', route: '/usuarios' },
        { label: 'Roles', icon: 'security', route: '/roles' },
      ]
    },

    {
      id: 'productores',
      label: 'Productores y Fincas',
      children: [
        { label: 'Productores', icon: 'person', route: '/productores' },
        { label: 'Fincas', icon: 'landscape', route: '/fincas' },
        { label: 'Parcelas', icon: 'eco', route: '/parcelas' },
      ]
    },

    {
      id: 'bitacora',
      label: 'Bitácora de Campo',
      children: [
        //{ label: 'Bitacora', icon: 'task_alt', route: '/labores' },
        //{ label: 'Plagas', icon: 'bug_report', route: '/plagas' }
        {
          id: 'bitacora-sub',
          label: 'Bitacora',
          icon: 'task_alt',
          children: [
            {
              id: 'bitacora-mant',
              label: 'Documentos',
              icon: 'list_alt',
              children: [
                { label: 'Bitacora', icon: 'list_alt', route: '/bitacoras' },
              ]
            },
            {
              id: 'bitacora-report',
              label: 'Reportes',
              icon: 'analytics',
              children: [
                { label: 'Bitacora', icon: 'assignment', route: '/reporte-bitacoras' }
              ]
            }
          ]
        },
      ]
    },

    {
      id: 'inventario',
      label: 'Lotes e Inventario',
      children: [
        { label: 'Lotes', icon: 'warehouse', route: '/lotes' },
        { label: 'Inventario', icon: 'list_alt', route: '/inventario' }
      ]
    },
    {
      id: 'clientes',
      label: 'Clientes y Reportes',
      children: [
        {
          id: 'clientes-sub',
          label: 'Clientes',
          icon: 'group',
          children: [
            {
              id: 'clientes-mant',
              label: 'Mantenimientos',
              icon: 'build',
              children: [
                { label: 'Clientes', icon: 'person', route: '/clientes' },
                { label: 'Opciones', icon: 'tune', route: '/clientes-opciones' },
                { label: 'Tipos', icon: 'category', route: '/clientes-tipos' }
              ]
            },
            {
              id: 'clientes-report',
              label: 'Reportes',
              icon: 'analytics',
              children: [
                { label: 'Clientes', icon: 'assignment', route: '/reporte-clientes' }
              ]
            }
          ]
        },

        {
          id: 'pedidos-sub',
          label: 'Pedidos',
          icon: 'shopping_basket',
          children: [
            {
              id: 'ped-doc',
              label: 'Documentos',
              icon: 'description',
              children: [
                { label: 'Pedidos', icon: 'inventory_2', route: '/pedidos' },
                { label: 'Opciones', icon: 'tune', route: '/pedidos-opciones' }
              ]
            },
            {
              id: 'ped-rep',
              label: 'Reportes',
              icon: 'analytics',
              children: [
                { label: 'Pedidos', icon: 'assignment', route: '/reporte-pedidos' }
              ]
            }
          ]
        }
      ]
    }
  ];
}
