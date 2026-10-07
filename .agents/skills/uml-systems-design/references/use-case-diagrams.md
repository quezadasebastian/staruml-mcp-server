# Guía Técnica: Diagramas de Casos de Uso (UML 2.5.1)

## 1. Definición y Propósito
El Diagrama de Casos de Uso modela los requerimientos funcionales del sistema desde la perspectiva de usuarios y entidades externas. Captura el comportamiento del sistema sin revelar su estructura interna ni su lógica de implementación.

---

## 2. Elementos Notacionales Formativos

### 2.1. Actores (`UMLActor`)
- Representan un rol que un usuario humano, hardware externo u otro sistema de software asume al interactuar con el sistema bajo estudio.
- **Notación:** Figura antropomórfica ("stick figure") o clase con estereotipo `<<actor>>`.
- **Clasificación:**
  - **Actor Primario:** Quien inicia la interacción para cumplir un objetivo de negocio (se ubica convencionalmente a la izquierda).
  - **Actor Secundario / de Soporte:** Quien provee servicios o recibe notificaciones del sistema (se ubica convencionalmente a la derecha, ej. pasarelas de pago, servidores de correo, motores de auditoría).
  - **Actor Sistema:** Sistemas externos automatizados, señalados con estereotipo `<<Sistema>>` o `<<External System>>`.

### 2.2. Límite del Sistema / Frontera (`UMLUseCaseSubject`)
- Define el alcance exacto de la solución que se está construyendo o delimitando.
- **Regla:** Los casos de uso residen **DENTRO** del rectángulo del sujeto; los actores residen **FUERA** del rectángulo.
- En StarUML, debe declararse semánticamente como `UMLUseCaseSubject` y proyectarse visualmente como `UMLUseCaseSubjectView`.

### 2.3. Casos de Uso (`UMLUseCase`)
- Representa una secuencia coherente de transacciones que el sistema ejecuta para producir un resultado observable de valor para un actor.
- **Formato del Nombre:** Siempre comienza con un verbo en infinitivo seguido del objeto directo (ej. `Registrar Incidencia`, `Generar Reporte Financiero`, `Cancelar Reserva`).
- **Nivel de Granularidad (Cockburn):** Nivel objetivo de usuario ("nivel del mar"). Evitar modelar detalles de interfaz gráfica (como "Hacer clic en botón").

---

## 3. Relaciones Formales y Reglas de Dirección

### 3.1. Asociación (`UMLAssociation`)
- Conecta un Actor con un Caso de Uso.
- Indica comunicación bidireccional entre el actor y el sistema.
- En UML estándar se representa como una línea sólida continua (puede tener flecha abierta opcional indicando navegación).

### 3.2. Inclusión (`UMLInclude` con estereotipo `<<include>>`)
- **Semántica:** Comportamiento obligatorio que se extrae y reutiliza en múltiples casos de uso, o fragmento indispensable para completar el caso base.
- **Dirección de la flecha:** Del **Caso Base** hacia el **Caso Incluido**.
  $$\text{Caso Base} \xrightarrow{\ll\text{include}\gg} \text{Caso Incluido}$$
- **Ejemplo:** `Registrar Incidencia` $\xrightarrow{\ll\text{include}\gg}$ `Calcular Fecha Límite de SLA`.

### 3.3. Extensión (`UMLExtend` con estereotipo `<<extend>>`)
- **Semántica:** Comportamiento condicional u opcional que añade funcionalidad al caso base solo en puntos de extensión específicos (`Extension Points`).
- **Dirección de la flecha:** Del **Caso de Extensión** hacia el **Caso Base**.
  $$\text{Caso de Extensión} \xrightarrow{\ll\text{extend}\gg} \text{Caso Base}$$
- **Ejemplo:** `Escalar Incidencia por Vencimiento` $\xrightarrow{\ll\text{extend}\gg}$ `Atender y Resolver Incidencia`.

### 3.4. Generalización (`UMLGeneralization`)
- **Entre Actores:** Un actor especializado hereda los casos de uso del actor general (ej. `Administrador` $\rightarrow$ `Usuario del Sistema`).
- **Entre Casos de Uso:** Un caso de uso especializado hereda y concreta el comportamiento de un caso abstracto (ej. `Pagar con Tarjeta` $\rightarrow$ `Procesar Pago`).

---

## 4. Requisitos para Generación en StarUML (.mdj)

Para que StarUML dibuje correctamente las líneas y el marco:
1. **Actores y Casos de Uso:** Cada uno debe tener su nodo semántico (`UMLActor`, `UMLUseCase`) en `ownedElements` del `UMLModel` y su respectivo `UMLActorView`, `UMLUseCaseView` en `ownedViews` del `UMLUseCaseDiagram`.
2. **Líneas de Asociación:** Deben instanciarse como `UMLAssociation` en el modelo semántico con `end1` apuntando al actor y `end2` al caso de uso. En la vista (`UMLAssociationView`), `tail` apunta a `UMLActorView` y `head` a `UMLUseCaseView`.
3. **11 Subviews en UMLAssociationView:** Las 11 subviews (`tailRoleNameLabel`, `headRoleNameLabel`, `tailMultiplicityLabel`, `headMultiplicityLabel`, `tailQualifiersCompartment`, `headQualifiersCompartment`, etc.) deben apuntar en sus modelos a `end1` y `end2`.
