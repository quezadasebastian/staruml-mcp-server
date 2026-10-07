# Especificación Técnica del Metamodelo StarUML (.mdj)

## 1. Arquitectura del Archivo .mdj
StarUML almacena proyectos completos como un documento JSON plano con extensión `.mdj`. La estructura jerárquica del archivo sigue el patrón:

```text
Project (_type: "Project")
 └── UMLModel (_type: "UMLModel", name: "Model")
      ├── UMLUseCaseDiagram / UMLClassDiagram / UMLSequenceDiagram (ownedViews: [...])
      ├── UMLActor, UMLUseCase, UMLClass, UMLInterface (ownedElements: [...])
      └── UMLUseCaseSubject, UMLAssociation, etc.
```

---

## 2. Sistema de Identificadores y Punteros (`$ref`)

1. **Formato de IDs:**
   - Cadenas alfanuméricas únicas de 24 caracteres compatibles con Base64 (ej. `AAAAAAFOtEV60o5VF/w=`).
2. **Punteros de Referencia:**
   - Las conexiones entre nodos no anidados utilizan punteros explícitos con la sintaxis:
     ```json
     { "$ref": "<TARGET_ELEMENT_ID>" }
     ```
   - Un nodo hijo referencia a su contenedor mediante `_parent: { "$ref": "<PARENT_ID>" }`.
   - Un nodo de vista visual (`*View`) referencia a su entidad ontológica mediante `model: { "$ref": "<MODEL_ID>" }`.

---

## 3. Requerimientos Críticos de Vistas y Conectores

### 3.1. UMLAssociationView (11 Subviews Obligatorias)
Para que el motor de renderizado de StarUML dibuje la línea de asociación entre dos elementos en el lienzo, `UMLAssociationView` **DEBE** poseer exactamente 11 subviews y 11 referencias de cabecera apuntando a los extremos de asociación `end1` y `end2` (`UMLAssociationEnd`):

```json
{
  "_type": "UMLAssociationView",
  "_id": "<VIEW_ID>",
  "_parent": { "$ref": "<DIAGRAM_ID>" },
  "model": { "$ref": "<ASSOC_MODEL_ID>" },
  "head": { "$ref": "<HEAD_VIEW_ID>" },
  "tail": { "$ref": "<TAIL_VIEW_ID>" },
  "points": "x1:y1;x2:y2;...",
  "nameLabel": { "$ref": "<SUBVIEW_0>" },
  "stereotypeLabel": { "$ref": "<SUBVIEW_1>" },
  "propertyLabel": { "$ref": "<SUBVIEW_2>" },
  "tailRoleNameLabel": { "$ref": "<SUBVIEW_3>" },       // model: end1Id
  "tailPropertyLabel": { "$ref": "<SUBVIEW_4>" },       // model: end1Id
  "tailMultiplicityLabel": { "$ref": "<SUBVIEW_5>" },   // model: end1Id
  "headRoleNameLabel": { "$ref": "<SUBVIEW_6>" },       // model: end2Id
  "headPropertyLabel": { "$ref": "<SUBVIEW_7>" },       // model: end2Id
  "headMultiplicityLabel": { "$ref": "<SUBVIEW_8>" },   // model: end2Id
  "tailQualifiersCompartment": { "$ref": "<SUBVIEW_9>" },// model: end1Id
  "headQualifiersCompartment": { "$ref": "<SUBVIEW_10>" } // model: end2Id
}
```

> [!CAUTION]
> Si los subviews de `tail` apuntan a `modelId` en lugar de `end1Id`, o si faltan subviews como `tailQualifiersCompartment`, StarUML descarta silenciosamente la conexión y muestra los elementos desconectados en el lienzo.

### 3.2. UMLUseCaseSubjectView (Límite del Sistema)
Un cuadro de límite del sistema (`UMLUseCaseSubjectView`) requiere obligatoriamente:
1. Una entidad de modelo semántico `UMLUseCaseSubject` dentro de `UMLModel.ownedElements`.
2. Una referencia `model: { "$ref": "<SUBJECT_MODEL_ID>" }` en `UMLUseCaseSubjectView` y en su `UMLNameCompartmentView`.
3. Dimensiones calculadas con margen alrededor de todos los casos de uso contenidos.

---

## 4. Pipeline de Cálculo de Coordenadas (Dagre Engine)
El servidor utiliza la librería `dagre` para resolver grafos dirigidos acíclicos:
1. **Configuración de Rango:**
   - Casos de uso: `rankdir: "LR"` (de izquierda a derecha), `nodesep: 50`, `ranksep: 110`.
   - Clases: `rankdir: "TB"` (de arriba hacia abajo), `nodesep: 60`, `ranksep: 90`.
2. **Cálculo de Polilíneas de Conexión (`points`):**
   - Dagre calcula los puntos de quiebre ortogonales `points: [ {x, y}, ... ]`.
   - Se serializan en formato StarUML como: `"x1:y1;x2:y2;x3:y3"`.
