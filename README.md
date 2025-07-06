# ChasquiBus - Aplicación Web

---

## 📱 Descripción

**ChasquiBus Web** es una aplicación desarrollada con **Next.js** y **TypeScript** que permite la gestión y visualización de rutas, boletos, usuarios, cooperativas y más, dentro del sistema de transporte público ChasquiBus. Incluye paneles administrativos, formularios avanzados, integración con API REST y una interfaz moderna y responsiva.

---

## ✨ Características Principales

- Panel administrativo para gestión de cooperativas, buses, choferes, rutas y usuarios.
- Visualización y gestión de boletos, ventas y pagos.
- Formularios avanzados con validación y feedback.
- Integración con API RESTful para operaciones en tiempo real.
- Interfaz responsiva y moderna, adaptable a cualquier dispositivo.
- Seguridad y control de acceso por roles.
- Visualización de reportes y estadísticas.
- Soporte para autenticación y autorización.
- Gestión de tarifas, descuentos y métodos de pago.

---

## 🛠️ Tecnologías Utilizadas

- **Next.js** (SSR, SSG y App Router)
- **React** y **React DOM**
- **TypeScript**
- **Material UI (MUI)** y **MUI Icons**
- **Emotion** (CSS-in-JS)
- **TailwindCSS** (utilidades CSS)
- **Axios** (cliente HTTP)
- **Formik** y **Yup** (formularios y validación)
- **Day.js** y **date-fns** (manejo de fechas)
- **Recharts** (gráficas y reportes)
- **ESLint** (linter)
- **Jest** (opcional, testing)

---

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- (Opcional) Yarn o pnpm

---

## 🚀 Instalación y Configuración

```bash
# Clona el repositorio
git clone <url-del-repositorio>
cd chasquibus-web-front/chasquibus-web

# Instala las dependencias
npm install
```

---

## 📱 Estructura del Proyecto

```
chasquibus-web-front/
└── chasquibus-web/
    ├── src/
    │   ├── app/              # Páginas principales y rutas (Next.js App Router)
    │   │   ├── dashboard/    # Panel administrativo
    │   │   ├── auth/         # Páginas de autenticación
    │   │   ├── layout.tsx    # Layout global
    │   │   ├── page.tsx      # Página principal
    │   │   ├── globals.css   # Estilos globales
    │   │   └── favicon.ico   # Favicon
    │   ├── components/       # Componentes reutilizables (por dominio)
    │   ├── constants/        # Constantes globales (navegación, etc.)
    │   ├── hooks/            # Hooks personalizados (ej: useAuth)
    │   ├── lib/              # Utilidades y configuración de API
    │   ├── public/           # Recursos estáticos (imágenes, favicon, etc.)
    │   ├── services/         # Servicios de API y lógica de negocio
    │   ├── types/            # Tipos TypeScript globales
    │   └── middleware.ts     # Middleware de Next.js
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── .gitignore
    └── ...
```

---

## 🎯 Funcionalidades Principales

- **Gestión de cooperativas:** CRUD de cooperativas, admins, buses y choferes.
- **Rutas y frecuencias:** Definición y visualización de rutas, paradas, horarios y tarifas.
- **Boletos y ventas:** Visualización, gestión y control de boletos y ventas.
- **Pagos:** Integración y gestión de métodos de pago.
- **Descuentos:** Aplicación y gestión de descuentos y promociones.
- **Panel administrativo:** Acceso a reportes, estadísticas y configuración avanzada.
- **Autenticación y roles:** Control de acceso y permisos.
- **Notificaciones y feedback visual.**

---

## 🔧 Scripts Disponibles

- `npm run dev` — Inicia el servidor en modo desarrollo.
- `npm run build` — Compila el proyecto para producción.
- `npm run start` — Inicia el servidor en modo producción.
- `npm run lint` — Ejecuta el linter para verificar la calidad del código.

---

## 📱 Configuración de Dispositivos

- Interfaz responsiva, adaptable a escritorio, tablet y móvil.
- Acceso vía navegador moderno (Chrome, Firefox, Edge, Safari, etc.).
- Configuración de endpoints en `src/constants` o variables de entorno.

---

## 🔐 Configuración de Permisos

- Acceso protegido por autenticación JWT.
- Roles: superadmin, admin, oficinista, chofer, etc.
- Endpoints y vistas protegidas según rol y permisos.

---

## 🧪 Testing

- Linting con ESLint:
  ```bash
  npm run lint
  ```
- (Opcional) Testing con Jest o herramientas compatibles con React.

---

## 📦 Build y Deploy

- Build para producción:
  ```bash
  npm run build
  ```
- Despliegue recomendado en Vercel, Netlify, AWS, etc.
- Verifica variables de entorno y endpoints antes de producción.

---

## 🐛 Solución de Problemas

- Si tienes problemas con dependencias, ejecuta:
  ```bash
  npm install
  ```
- Verifica la configuración de endpoints y variables de entorno.
- Consulta la documentación de Next.js, React y MUI para problemas específicos.

---

## 🤝 Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz tus cambios y asegúrate de pasar el linter.
4. Haz un Pull Request con una descripción clara.

---

## 📄 Licencia

Este proyecto es privado y no tiene licencia de distribución pública.  
Contacta al equipo para más información.

---

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: NeoSoft
- **Diseño UI/UX**: NeoSoft
- **Frontend Web**: NeoSoft

---

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@chasquibus.com
- 📱 WhatsApp: +593 968622132
- 🌐 Website: https://neosoft-a8aeb.web.app/
