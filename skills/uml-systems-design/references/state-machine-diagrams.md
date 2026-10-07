# Guía Técnica: Diagramas de Máquinas de Estado (UML 2.5.1)

## 1. Definición y Propósito
El Diagrama de Máquina de Estados (State Machine / Statechart de Harel) modela el comportamiento reactivo dependiente del tiempo y de eventos para una entidad de dominio discreta (ej. un `Pedido`, una `Conexión TCP`, un `Ticket de Incidencia`). Describe todos los estados cualitativos posibles y las transiciones que ocurren ante estímulos externos.

---

## 2. Elementos Notacionales Formativos

### 2.1. Estados (`State`)
- Rectángulo con esquinas redondeadas dividido internamente en compartimentos:
  - **Nombre del Estado:** En la parte superior (ej. `Borrador`, `Pendiente de Aprobación`, `En Proceso`, `Cerrado`).
  - **Acciones Internas:**
    - `entry / acción`: Se ejecuta inmediatamente al ingresar al estado.
    - `do / actividad`: Actividad continua de fondo mientras se permanezca en el estado.
    - `exit / acción`: Se ejecuta al abandonar el estado.

### 2.2. Pseudoestados (`PseudoState`)
- **Estado Inicial (`InitialState`):** Círculo sólido negro. Solo permite transiciones salientes.
- **Estado Final (`FinalState`):** Círculo con borde concéntrico (diana). Representa la terminación del ciclo de vida de la entidad.
- **Punto de Decisión / Junction (`Junction`):** Círculo relleno pequeño que evalúa encadenamiento estático de guardas.
- **Punto de Selección / Choice (`Choice`):** Rombo que evalúa dinámicamente guardas en tiempo de ejecución.
- **Historia (`ShallowHistory` / `DeepHistory`):** Letra `H` o `H*` dentro de un círculo para recordar el último subestado activo en estados compuestos.

### 2.3. Transición (`Transition`)
- Flecha dirigida de un estado origen a un estado destino.
- **Sintaxis Estándar UML:**
  $$\text{Evento}(\text{argumentos})\;[\text{Guarda}]\;/\;\text{Acción}$$
  - **Evento (Trigger):** Qué desencadena la transición (ej. `solicitarRevision()`, `pagoConfirmado`).
  - **Guarda (Guard):** Condición booleana necesaria para que se dispare (ej. `[monto > 0]`, `[intentos < 3]`).
  - **Acción (Effect):** Operación o efecto colateral que se ejecuta durante el tránsito (ej. `enviarNotificacion()`).

---

## 3. Estados Compuestos y Concurrencia
- **Estado Compuesto Jerárquico:** Contiene una o más máquinas de estado anidadas.
- **Estados Ortogonales (Concurrencia):** Divididos por líneas punteadas donde coexisten múltiples subestados activos en paralelo dentro del mismo estado contenedor.

---

## 4. Reglas de Validación y Antipatrones

1. **Determinismo:** Desde un mismo estado no pueden salir dos transiciones con el mismo evento desencadenante a menos que sus guardas booleanas sean estrictamente disyuntas y mutuamente excluyentes.
2. **Estados Huérfanos:** Todo estado no inicial debe tener al menos una transición entrante, y todo estado no final debe tener al menos una transición saliente.
3. **No Usar Estados como Pasos:** Un estado es una condición duradera o fase de reposo/espera, no una acción transitoria (ej. `Validando` suele ser una acción dentro de una transición, mientras que `En Evaluación` es un estado legítimo).
