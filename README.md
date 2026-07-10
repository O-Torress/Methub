# MetHub — Explorador de la Colección del Met Museum 

MetHub es una aplicación web de página única (SPA) diseñada para explorar la extensa colección de arte de la Open Access API del **Metropolitan Museum of Art** de Nueva York. 

Este proyecto fue desarrollado utilizando únicamente tecnologías web nativas (**HTML5, CSS3 y JavaScript Vanilla**), sin frameworks de terceros, implementando componentes web personalizados y arquitecturas asíncronas avanzadas.

---

##  Características Clave

- **Enrutador SPA en el Cliente**: Sistema de navegación sin recarga de página basado en hashes de URL (`#home`, `#explore`, `#departments`, `#artist`, `#compare`).
- **Capa de Datos Robusta (`api.js`)**: Gestión avanzada de peticiones asíncronas con límites de tiempo (*timeouts*) implementados mediante `AbortController` y cargas concurrentes eficientes mediante `Promise.allSettled`.
- **Componentes Web Nativos (Custom Elements)**:
  - `<loading-state>`: Representa esqueletos de carga (*skeletons*) dinámicos y responsivos con animación *shimmer*.
  - `<error-state>`: Interfaz de error intuitiva con la posibilidad de reintentar llamadas asíncronas contextuales.
- **Explorador de Departamentos (`#departments`)**: Muestra un catálogo interactivo con íconos temáticos para los 19 departamentos del museo.
- **Vista de Artista (`#artist/:name`)**: Galería dedicada que agrupa y pagina (de 4 en 4) las obras de un autor específico con metadatos y biografía dinámica.
- **Comparador de Obras Dual (`#compare`)**:
  - Buscadores independientes en tiempo real con *debounce* (400ms) para evitar llamadas innecesarias a la API.
  - Sistema de prevención de duplicidad en paneles de selección.
  - Tabla comparativa detallada que resalta visualmente las discrepancias (`≠`) técnicas e históricas de ambas obras.
  - Cálculo inmediato de diferencias en la línea del tiempo (años).
  - Precarga de obras directa desde la vista de detalles.

---

## Tecnologías y Estructura

- **Frontend**: HTML5 Semántico, CSS3 Custom Properties (variables de diseño) y JavaScript Vanilla (ES6+).
- **API**: [The Metropolitan Museum of Art Open Access API](https://collectionapi.metmuseum.org/public/collection/v1).

###  Organización del Proyecto

```text
proyecto/
├── css/
│   └── styles.css             # Estilos globales y específicos de vistas
├── img/
│   └── logo.webp              # Logotipo de la aplicación
├── js/
│   ├── api.js                 # Capa de peticiones HTTP
│   ├── app.js                 # Enrutador e inicialización
│   ├── components/
│   │   ├── error-state.js     # Custom Element de error
│   │   └── loading-state.js   # Custom Element de carga
│   └── views/
│       ├── home.js            # Portada del sitio
│       ├── explorar.js        # Exploración general y filtros
│       ├── detalles.js        # Ficha técnica individual
│       ├── departamento.js    # Listado de departamentos
│       ├── artista.js         # Vista de autor y paginación
│       └── comparacion.js     # Panel comparador de obras
└── index.html                 # Punto de entrada SPA
```

---

## Instalación y Ejecución

Al ser un desarrollo basado en JavaScript Vanilla, no requiere procesos de compilación o dependencias complejas. 

1. Clona el repositorio:
   ```bash
   git clone https://github.com/O-Torress/Methub.git
   ```
2. Abre el proyecto en tu entorno local usando un servidor de desarrollo (por ejemplo, la extensión **Live Server** en VS Code o ejecutando `npx serve` desde la terminal).
3. Abre el navegador en la dirección local indicada por tu servidor (generalmente `http://localhost:5500` o `http://localhost:3000`).


Desarrollado en pareja por:
- **Oscar Torres** 
- **Santiago Leal** 
