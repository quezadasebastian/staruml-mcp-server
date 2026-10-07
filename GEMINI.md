# StarUML MCP Server - Arquitectura y Guía de Proyecto

## 1. Visión General del Proyecto
Servidor de Protocolo de Contexto de Modelo (MCP) de grado de producción en TypeScript/Node.js para la creación, manipulación, diseño espacial y auditoría programática de archivos de proyectos de StarUML (`.mdj`).

El servidor calcula automáticamente coordenadas espaciales ortogonales mediante `dagre` para que los diagramas generados abran perfectamente estructurados y conectados sin necesidad de reposicionamiento manual.

---

## 2. Pila Tecnológica y Dependencias
- **Lenguaje:** TypeScript 5.3+ (ESM nativo, `"type": "module"`, `"target": "ES2022"`).
- **Runtime:** Node.js (v18+).
- **Protocolo MCP:** `@modelcontextprotocol/sdk` (transporte Stdio).
- **Motor de Layout:** `dagre` con orientación configurable (`TB` para clases, `LR` para casos de uso).
- **Validación de Esquema:** `zod` para validación estricta de payloads JSON-RPC.
- **Testing:** `vitest`.

---

## 3. Estructura de Directorios
```text
staruml-mcp-server/
├── .agents/skills/uml-systems-design/ # Skill de modelado y diseño de sistemas UML
│   ├── SKILL.md
│   └── references/                   # Guías de Casos de Uso, Actividades, Estados, Secuencia, etc.
├── src/
│   ├── index.ts                      # Punto de entrada Stdio MCP
│   ├── server.ts                     # Registro y validación de herramientas MCP con Zod
│   ├── types.ts                      # Interfaces y tipos del metamodelo StarUML
│   ├── staruml/
│   │   ├── id-generator.ts           # Generador de IDs únicos de 24 caracteres (Base64-like)
│   │   ├── mdj-factory.ts            # Nodos semánticos y vistas visuales conformes con StarUML
│   │   └── mdj-builder.ts            # Constructores de AST de diagramas (Clases, Casos de Uso, Secuencia)
│   ├── layout/
│   │   ├── dagre-layout.ts           # Motor de layout automático Dagre
│   │   └── sequence-layout.ts        # Motor de layout cronológico de secuencia
│   ├── inspector/
│   │   └── mdj-inspector.ts          # Parser e inspector estructural de archivos .mdj
│   └── utils/
│       └── file-writer.ts            # Escritor atómico de archivos JSON
├── tests/                            # Pruebas de integración E2E y unitarias
├── output/                           # Salidas de diagramas generados
└── GEMINI.md                         # Este documento de arquitectura
```

---

## 4. Herramientas MCP Expuestas
1. `generate_class_diagram`: Genera diagramas de clases con atributos, operaciones, estereotipos y las 6 relaciones formales de UML.
2. `generate_use_case_diagram`: Genera diagramas de casos de uso con actores primarios/secundarios, límites del sistema (`System Boundary`) y relaciones (`association`, `include`, `extend`, `generalization`).
3. `generate_sequence_diagram`: Genera diagramas de interacción de secuencia con líneas de vida y mensajes sincronizados, asíncronos y respuestas ordenados cronológicamente.
4. `inspect_mdj_model`: Analiza un archivo `.mdj` y retorna un resumen exhaustivo de entidades, vistas, multiplicidades y relaciones.

---

## 5. Reglas Críticas del Metamodelo StarUML
1. **Líneas de Asociación Conectadas:**
   - Todo nodo visual `UMLAssociationView` **DEBE** poseer 11 subviews (`tailRoleNameLabel`, `tailPropertyLabel`, `tailMultiplicityLabel`, `headRoleNameLabel`, `headPropertyLabel`, `headMultiplicityLabel`, `tailQualifiersCompartment`, `headQualifiersCompartment`, etc.).
   - Las subviews del extremo `tail` deben tener su modelo referenciando a `end1` (`UMLAssociationEnd`).
   - Las subviews del extremo `head` deben tener su modelo referenciando a `end2` (`UMLAssociationEnd`).
2. **Límites del Sistema (`System Boundary`):**
   - Todo `UMLUseCaseSubjectView` requiere su correspondiente nodo semántico `UMLUseCaseSubject` dentro de `UMLModel.ownedElements` y la propiedad `model: { "$ref": "<subject_model_id>" }`.
3. **Skill de Especialización:**
   - Para diseñar cualquier diagrama UML sin ambigüedades, consultar la skill del workspace ubicada en `.agents/skills/uml-systems-design/SKILL.md`.

---

## 6. Comandos de Compilación y Test
```bash
# Compilar TypeScript a dist/
npm run build

# Ejecutar suite de pruebas Vitest
npm test
```
