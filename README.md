# StarUML MCP Server 📐🤖

Un servidor basado en el estándar **Model Context Protocol (MCP)** en TypeScript/Node.js que otorga a agentes autónomos de IA (Claude Code, Cursor, Antigravity, Cline) la capacidad de interactuar directamente con proyectos de **StarUML** (`.mdj`).

---

## 🎯 ¿Qué problema resuelve?

Cuando los modelos de lenguaje intentan generar modelos UML nativos para herramientas de escritorio, suelen fallar en dos aspectos críticos:
1. **La capa geométrica (`views`):** Un archivo `.mdj` requiere definir coordenadas exactas (`left`, `top`, `width`, `height`) y puntos ortogonales de conexión (`points`). Sin ellos, los elementos se amontonan en la coordenada $(0,0)$ o el archivo queda corrupto.
2. **La coherencia referencial:** Cada entidad requiere identificadores de 24 caracteres únicos vinculados mediante punteros de referencia (`$ref`).

Este servidor abstrae toda esa complejidad matemática y estructural: el agente de IA solo declara la semántica (actores, clases, métodos, relaciones) y el motor interno de layout calcula automáticamente la disposición espacial limpia y lista para abrir en StarUML.

---

## ✨ Características Principales

* **Auto-Layout Determinista:** Integra `dagre` para calcular la posición óptima de nodos y enrutamiento de conectores, evitando colisiones o superposiciones.
* **Soporte Multi-Diagrama:**
  * **Casos de Uso:** Actores, fronteras de sistema (`systemBoundary`), asociaciones, `<<include>>` y `<<extend>>`.
  * **Diagramas de Clases:** Atributos tipados, operaciones, visibilidades, herencia, interfaces, composiciones y agregaciones.
  * **Diagramas de Secuencia:** Líneas de vida (*lifelines*) y flujo cronológico de mensajes síncronos, asíncronos y respuestas.
* **Inspección Bidireccional (`inspect_mdj_model`):** Permite a los agentes de IA leer y resumir proyectos `.mdj` existentes antes de refactorizarlos o extenderlos.
* **Transporte Estándar:** Comunicación lista para producción mediante Stdio (`@modelcontextprotocol/sdk`).

---

## Installation & Build

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Build Steps

```bash
# 1. Clone or enter the repository
cd staruml-mcp-server

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run build

# 4. Run automated test suite
npm test

# 5. Generate a sample complex diagram
npm run generate-sample
```

---

## MCP Server Configuration

### 1. Claude Desktop (`claude_desktop_config.json`)

Locate your Claude configuration file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the server under `mcpServers`:

```json
{
  "mcpServers": {
    "staruml": {
      "command": "node",
      "args": [
        "c:/Users/Mi Equipo/Documents/staruml-mcp-server/dist/index.js"
      ]
    }
  }
}
```

*(Replace the path with your actual absolute path to `dist/index.js`).*

### 2. Antigravity / Agent CLI Configuration

Add to your MCP settings file:

```json
{
  "mcpServers": {
    "staruml": {
      "command": "node",
      "args": [
        "C:\\Users\\Mi Equipo\\Documents\\staruml-mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

---

## MCP Tools Reference

### Tool 1: `generate_class_diagram`
Compiles an object-oriented domain model into a complete `.mdj` file with auto-calculated coordinates.

**Input Schema:**
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

**Supported Relationship Types:**
- `generalization`: Inheritance (solid line, hollow triangle arrow pointing to superclass)
- `realization`: Interface implementation (dashed line, hollow triangle arrow pointing to interface)
- `composition`: Strong ownership (solid line, filled diamond at whole end)
- `aggregation`: Weak ownership (solid line, hollow diamond at whole end)
- `dependency`: Dependency (dashed line, arrow pointing to target)
- `association`: Standard association (solid line)

---

### Tool 2: `generate_use_case_diagram`
Builds a Use Case diagram with actors, boundary systems, use cases, and relationships.

**Input Schema:**
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
    { "id": "uc_browse", "name": "Browse Products", "systemBoundary": "Web Store" },
    { "id": "uc_checkout", "name": "Checkout Order", "systemBoundary": "Web Store" },
    { "id": "uc_pay", "name": "Process Payment", "systemBoundary": "Payment Subsystem" }
  ],
  "relationships": [
    { "id": "r1", "type": "association", "sourceId": "act_customer", "targetId": "uc_browse" },
    { "id": "r2", "type": "association", "sourceId": "act_customer", "targetId": "uc_checkout" },
    { "id": "r3", "type": "include", "sourceId": "uc_checkout", "targetId": "uc_pay" }
  ]
}
```

---

### Tool 3: `generate_sequence_diagram`
Creates an interaction sequence diagram with lifelines and synchronous/asynchronous/reply messages arranged in chronological vertical order.

**Input Schema:**
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

### Tool 4: `inspect_mdj_model`
Reads an existing `.mdj` file and returns a concise structural overview (list of diagrams, classes, interfaces, relationships, methods, actors, and use cases).

**Input Schema:**
```json
{
  "filePath": "./output/complex_architecture.mdj"
}
```

**Example Output:**
```markdown
# StarUML Model Overview: Enterprise Banking System
**File:** `output/complex_architecture.mdj`

## Summary Statistics
- **Diagrams:** 1
- **Classes:** 6
- **Interfaces:** 1
- **Attributes:** 17
- **Operations / Methods:** 8
- **Relationships:** 6

## Diagrams
- **Core Domain Architecture** (`UMLClassDiagram`) — 13 visual views

## Classes & Interfaces
### BankAccount «abstract» (abstract) (`UMLClass`)
**Attributes:**
  - `protected` **accountNumber**: string
  - `protected` **balance**: BigNumber
**Operations:**
  - `public` **deposit**(amount: BigNumber)
  - `public` **withdraw**(amount: BigNumber): boolean

### IAuditLogger (`UMLInterface`)
**Operations:**
  - `public` **logEvent**(action: string, payload: Record<string, unknown>)

## Relationships
- **SavingsAccount** ──(generalization)──> **BankAccount**
- **CloudAuditService** ──(realization)──> **IAuditLogger**
- **BankAccount** ──(composition "transactions" [1 -> 0..*])──> **Transaction**
- **BankCustomer** ──(aggregation "accounts" [1 -> 1..*])──> **BankAccount**
```

---

## Project Structure

```
staruml-mcp-server/
├── package.json               # ESM configuration and dependencies
├── tsconfig.json              # Strict TypeScript settings with NodeNext resolution
├── src/
│   ├── index.ts               # CLI entrypoint connecting StdioServerTransport
│   ├── server.ts              # Tool registration and error handling
│   ├── types.ts               # Zod validation schemas and StarUML AST interfaces
│   ├── staruml/
│   │   ├── id-generator.ts    # 24-char Base64 collision-free ID generator
│   │   ├── mdj-factory.ts     # Pure node and view constructors
│   │   └── mdj-builder.ts     # High-level diagram builders mapping Dagre layout to AST
│   ├── layout/
│   │   ├── dagre-layout.ts    # 2D graph layout engine using Dagre
│   │   └── sequence-layout.ts # Chronological vertical layout engine for sequence diagrams
│   ├── inspector/
│   │   └── mdj-inspector.ts   # Parser and markdown overview generator for .mdj files
│   └── utils/
│       └── file-writer.ts     # Safe atomic JSON disk writer
├── scripts/
│   └── generate-complex-model.ts # Standalone sample generator
├── tests/
│   ├── e2e.test.ts            # Full end-to-end test suite
│   └── mcp-server.test.ts     # MCP protocol in-memory client test suite
└── README.md
```

---

## License

MIT
