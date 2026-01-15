import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <div class="welcome-card">
        <div class="welcome-content">
          <h2 class="welcome-title">¡Bienvenido al Sistema Ing Civil!</h2>
          <p class="welcome-description">
            Utiliza el menú lateral para acceder a las diferentes herramientas de cálculo estructural.
            Nuestro sistema te permite realizar cálculos precisos y generar reportes profesionales.
          </p>
        </div>
        
        <!-- About Section -->
        <div class="about-section">
          <h3 class="about-title">¿Quiénes Somos?</h3>
          <p class="about-text">
           Somos tu aliado en el diseño estructural.
           Desarrollamos software intuitivo creado por ingenieros para ingenieros,
           diseñado para simplificar cálculos complejos de cimentaciones y optimizar tu flujo de trabajo.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .welcome-card {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      max-width: 800px;
      width: 100%;
      text-align: center;
    }

    .welcome-title {
      color: #667eea;
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .welcome-description {
      color: #6c757d;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .quick-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .action-button.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-button.secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .about-section {
      padding-top: 40px;
      border-top: 1px solid #e9ecef;
    }

    .about-title {
      color: #495057;
      font-size: 1.5rem;
      margin-bottom: 15px;
    }

    .about-text {
      color: #6c757d;
      font-size: 1rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .welcome-card {
        padding: 20px;
        margin: 10px;
      }
      
      .welcome-title {
        font-size: 2rem;
      }
      
      .quick-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .action-button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class WelcomeComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateToSection(section: string): void {
    // Usar navegación relativa desde el dashboard
    this.router.navigate(['../', section], { relativeTo: this.route });
  }
}