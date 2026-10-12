# StarUML MCP Server 📐🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-6e9f18.svg)](https://vitest.dev/)
[![MCP](https://img.shields.io/badge/MCP-1.32.1-orange.svg)](https://modelcontextprotocol.io/)

Servidor de producción basado en el estándar **Model Context Protocol (MCP)** en TypeScript/Node.js que otorga a agentes autónomos de IA (Claude Code, Cursor, Antigravity, Cline) la capacidad de interactuar directamente con proyectos de **StarUML** (`.mdj`).

---

## 🎯 ¿Qué problema resuelve?

Cuando los modelos de lenguaje intentan generar modelos UML nativos para herramientas de escritorio, suelen fallar en dos aspectos críticos:

1. **La capa geométrica (`views`):** Un archivo `.mdj` requiere definir coordenadas exactas (`left`, `top`, `width`, `height`) y puntos ortogonales de conexión (`points`). Sin ellos, los elementos se amontonan en la coordenada $(0,0)$ o el archivo queda corrupto.
2. **La coherencia referencial:** Cada entidad requiere identificadores de 24 caracteres únicos vinculados mediante punteros de referencia (`$ref`).

Este servidor abstrae toda esa complejidad matemática y estructural: el agente de IA solo declara la semántica (actores, clases, métodos, relaciones) y el motor interno de layout calcula automáticamente la disposición espacial limpia y lista para abrir en StarUML.

---

## ✨ Características Principales

- **Auto-Layout Determinista:** Integra `dagre` para calcular la posición óptima de nodos y enrutamiento ortogonal de conectores, evitando colisiones o superposiciones.
- **Soporte Multi-Diagrama:**
  - **Casos de Uso:** Actores, fronteras de sistema (`systemBoundary`), asociaciones, `<<include>>` y `<<extend>>`.
  - **Diagramas de Clases:** Atributos tipados, operaciones, visibilidades, herencia, interfaces, composiciones y agregaciones.
  - **Diagramas de Secuencia:** Líneas de vida (_lifelines_) y flujo cronológico de mensajes síncronos, asíncronos y respuestas.
- **Inspección Bidireccional (`inspect_mdj_model`):** Permite a los agentes de IA leer y resumir proyectos `.mdj` existentes antes de refactorizarlos o extenderlos.
- **Seguridad y Resiliencia:** Validación estricta con esquemas Zod, escritura atómica en disco para evitar archivos corruptos y manejo defensivo de errores.
- **Anotaciones MCP Nativas:** Cumple con la especificación MCP al declarar `readOnlyHint`, `destructiveHint`, `idempotentHint` y `openWorldHint` en todas sus herramientas.

---

## 🔒 Tabla de Herramientas y Anotaciones de Seguridad

| Herramienta MCP | Descripción | `readOnlyHint` | `destructiveHint` | `idempotentHint` | `openWorldHint` |
|---|---|:---:|:---:|:---:|:---:|
| `generate_class_diagram` | Genera diagrama de clases y relaciones en `.mdj`. | `false` | `true` | `true` | `false` |
| `generate_use_case_diagram` | Genera diagrama de casos de uso y actores en `.mdj`. | `false` | `true` | `true` | `false` |
| `generate_sequence_diagram` | Genera diagrama de interacción de secuencia en `.mdj`. | `false` | `true` | `true` | `false` |
| `inspect_mdj_model` | Lee e inspecciona un archivo `.mdj` existente. | `true` | `false` | `true` | `false` |

> [!NOTE]
> Las herramientas de generación sobreescriben de forma atómica el archivo de destino indicado en `filePath`, por lo que se marcan con `destructiveHint: true`. La herramienta `inspect_mdj_model` solo lee datos sin modificar el sistema de archivos (`readOnlyHint: true`).

---

## 🚀 Instalación y Compilación

### Requisitos Previos

- **Node.js:** Versión 18.0.0 o superior (compatible con v20 y v22).
- **npm:** Versión 9 o superior.

### Pasos de Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/quezadasebastian/staruml-mcp-server.git
cd staruml-mcp-server

# 2. Instalar dependencias limpias
npm ci

# 3. Compilar TypeScript a dist/
npm run build

# 4. Ejecutar la suite completa de pruebas
npm test
```

---

## ⚙️ Configuración en Clientes MCP

### 1. Claude Desktop (`claude_desktop_config.json`)

Ubica tu archivo de configuración de Claude:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Agrega el servidor dentro de la sección `mcpServers`:

```json
{
  "mcpServers": {
    "staruml": {
      "command": "node",
      "args": ["<RUTA_ABSOLUTA>/staruml-mcp-server/dist/index.js"]
    }
  }
}
```

### 2. Antigravity / Cursor / Cline (`mcp_config.json`)

```json
{
  "mcpServers": {
    "staruml": {
      "command": "node",
      "args": ["C:/ruta/hacia/staruml-mcp-server/dist/index.js"]
    }
  }
}
```

---

## 🛠️ Referencia de Herramientas MCP

### 1. `generate_class_diagram`
Genera un diagrama de clases estructurado con layout automático Dagre.

**Esquema de Entrada:**
```json
{
  "filePath": "./output/architecture.mdj",
  "projectName": "E-Commerce System",
  "diagramName": "Domain Model",
  "classes": [
    {
      "id": "cls_user",
      "name": "User",
      "stereotype": "abstract",
      "attributes": [
        { "name": "id", "type": "string", "visibility": "protected" },
        { "name": "email", "type": "string", "visibility": "public" }
      ],
      "operations": [
        {
          "name": "authenticate",
          "returnType": "boolean",
          "visibility": "public",
          "parameters": [{ "name": "password", "type": "string" }]
        }
      ]
    },
    {
      "id": "iface_payment",
      "name": "IPaymentGateway",
      "stereotype": "interface",
      "operations": [
        {
          "name": "processPayment",
          "returnType": "PaymentResult",
          "visibility": "public",
          "parameters": [
            { "name": "amount", "type": "number" },
            { "name": "currency", "type": "string" }
          ]
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "rel_1",
      "type": "generalization",
      "sourceId": "cls_customer",
      "targetId": "cls_user"
    },
    {
      "id": "rel_2",
      "type": "realization",
      "sourceId": "cls_stripe",
      "targetId": "iface_payment"
    },
    {
      "id": "rel_3",
      "type": "composition",
      "sourceId": "cls_order",
      "targetId": "cls_order_item",
      "name": "items",
      "sourceMultiplicity": "1",
      "targetMultiplicity": "1..*"
    }
  ]
}
```

**Tipos de Relación de Clases Soportados:**
- `generalization`: Herencia (línea continua, triángulo hueco apuntando a superclase).
- `realization`: Implementación de interfaz (línea discontinua, triángulo hueco apuntando a interfaz).
- `composition`: Composición fuerte (línea continua, rombo relleno en el extremo contenedor).
- `aggregation`: Agregación débil (línea continua, rombo hueco en el extremo contenedor).
- `dependency`: Dependencia (línea discontinua con flecha abierta).
- `association`: Asociación estándar (línea continua).

---

### 2. `generate_use_case_diagram`
Genera un diagrama de casos de uso con actores primarios/secundarios y fronteras de sistema (`systemBoundary`).

**Esquema de Entrada:**
```json
{
  "filePath": "./output/use_cases.mdj",
  "projectName": "Online Store",
  "diagramName": "Checkout Flow",
  "actors": [
    { "id": "act_customer", "name": "Customer" },
    { "id": "act_admin", "name": "System Administrator" }
  ],
  "useCases": [
    {
      "id": "uc_browse",
      "name": "Browse Products",
      "systemBoundary": "Web Store"
    },
    {
      "id": "uc_checkout",
      "name": "Checkout Order",
      "systemBoundary": "Web Store"
    },
    {
      "id": "uc_pay",
      "name": "Process Payment",
      "systemBoundary": "Payment Subsystem"
    }
  ],
  "relationships": [
    {
      "id": "r1",
      "type": "association",
      "sourceId": "act_customer",
      "targetId": "uc_browse"
    },
    {
      "id": "r2",
      "type": "association",
      "sourceId": "act_customer",
      "targetId": "uc_checkout"
    },
    {
      "id": "r3",
      "type": "include",
      "sourceId": "uc_checkout",
      "targetId": "uc_pay"
    }
  ]
}
```

---

### 3. `generate_sequence_diagram`
Genera un diagrama de interacción cronológico con líneas de vida (*lifelines*) y mensajes verticales ordenados.

**Esquema de Entrada:**
```json
{
  "filePath": "./output/sequence.mdj",
  "projectName": "Auth Flow",
  "diagramName": "Login Sequence",
  "lifelines": [
    { "id": "ll_client", "name": "UserBrowser" },
    { "id": "ll_auth", "name": "AuthService" },
    { "id": "ll_db", "name": "UserDatabase" }
  ],
  "messages": [
    {
      "id": "m1",
      "name": "login(credentials)",
      "sourceLifelineId": "ll_client",
      "targetLifelineId": "ll_auth",
      "messageSort": "synchCall"
    },
    {
      "id": "m2",
      "name": "findByEmail(email)",
      "sourceLifelineId": "ll_auth",
      "targetLifelineId": "ll_db",
      "messageSort": "synchCall"
    },
    {
      "id": "m3",
      "name": "userData",
      "sourceLifelineId": "ll_db",
      "targetLifelineId": "ll_auth",
      "messageSort": "reply"
    },
    {
      "id": "m4",
      "name": "200 OK (JWT Token)",
      "sourceLifelineId": "ll_auth",
      "targetLifelineId": "ll_client",
      "messageSort": "reply"
    }
  ]
}
```

---

### 4. `inspect_mdj_model`
Lee e inspecciona la estructura de un archivo `.mdj` existente, retornando un resumen en Markdown.

**Esquema de Entrada:**
```json
{
  "filePath": "./output/architecture.mdj"
}
```

---

## 🛡️ Consideraciones de Seguridad

1. **Validación de Rutas:** Todos los parámetros de ruta `filePath` son validados estrictamente mediante Zod para asegurar que sean cadenas no vacías y terminen con la extensión `.mdj`.
2. **Escritura Atómica:** Se utiliza un patrón de escritura atómica (escritura en archivo temporal en el mismo directorio y reemplazo por renombrado atómico del sistema de archivos) para impedir que cortes de energía o caídas de proceso dejen archivos corrompidos.
3. **Manejo Controlado de Errores:** Las excepciones de lectura o análisis en archivos inexistentes o directorios son capturadas y transformadas en respuestas legibles con la bandera `isError: true` en lugar de abortar el proceso del servidor.
4. **Permisos Mínimos:** El servidor MCP no ejecuta comandos de shell externos ni realiza llamadas HTTP arbitrarias hacia internet (`openWorldHint: false`).

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para mantener la calidad del proyecto:

1. Crea un Fork del repositorio y una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
2. Asegúrate de que todo el código nuevo cuente con tipado estricto de TypeScript.
3. Ejecuta la suite de pruebas y compilación antes de enviar un Pull Request:
   ```bash
   npm run build
   npm test
   ```
4. Envía un Pull Request describiendo claramente los cambios introducidos.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

Copyright (c) 2026 Sebastián Quezada.
