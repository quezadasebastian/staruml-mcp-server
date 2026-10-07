# Guía Técnica: Diagramas de Actividades (UML 2.5.1)

## 1. Definición y Propósito
El Diagrama de Actividades modela el flujo de control y de datos entre acciones computacionales o pasos de un proceso de negocio. Es el equivalente de UML a un diagrama de flujo avanzado, enriquecido con concurrencia, sincronización y asignación de responsabilidades.

---

## 2. Elementos Notacionales Formativos

### 2.1. Nodos de Control
- **Nodo Inicial (`InitialNode`):** Círculo sólido negro. Marca el punto de entrada de la actividad. Debe haber al menos uno por flujo.
- **Nodo Final de Actividad (`ActivityFinalNode`):** Círculo negro dentro de un círculo hueco (ojo de buey). Detiene todos los flujos de la actividad entera.
- **Nodo Final de Flujo (`FlowFinalNode`):** Círculo con una cruz interior (`X`). Termina una rama individual sin abortar las demás ramas concurrentes.
- **Nodo de Decisión (`DecisionNode`):** Rombo con 1 entrada y múltiples salidas con condiciones de guarda mutuamente excluyentes entre corchetes `[condición]`.
- **Nodo de Unión / Merge (`MergeNode`):** Rombo con múltiples entradas y 1 salida. Reúne flujos alternativos sin sincronización.
- **Bifurcación / Fork (`ForkNode`):** Barra sólida gruesa con 1 entrada y múltiples salidas. Inicia hilos de ejecución paralelos/concurrentes.
- **Sincronización / Join (`JoinNode`):** Barra sólida gruesa con múltiples entradas y 1 salida. Espera a que todos los hilos concurrentes finalicen antes de proseguir.

### 2.2. Nodos de Acción (`Action` / `OpaqueAction`)
- Rectángulos con esquinas redondeadas.
- Representan un paso atómico ejecutable que transforma el estado o consume/produce objetos.
- **Ejemplo:** `Verificar Disponibilidad de Stock`, `Debitar Saldo de Cuenta`, `Generar Token JWT`.

### 2.3. Particiones / Carriles (`ActivityPartition` / Swimlanes)
- Columnas verticales o filas horizontales que agrupan acciones según el actor, servicio o componente responsable de ejecutarlas.
- **Ejemplo de Carriles:**
  - `Cliente / App Móvil`
  - `API Gateway`
  - `Servicio de Pagos`
  - `Base de Datos`

### 2.4. Flujos de Objetos (`ObjectFlow` y `ObjectNode`)
- Rectángulos que representan instancias de datos en un estado específico (ej. `Orden [Creada]`, `Factura [Firmada]`).
- Los flujos conectan acciones con pines de entrada/salida de datos.

---

## 3. Reglas de Validación y Antipatrones

1. **Balance de Fork y Join:** Toda barra de `Fork` que abra ejecución concurrente debe, salvo excepciones justificadas de terminación asíncrona, converger en un `Join` antes de alcanzar el nodo final.
2. **Exhaustividad de Guardas en Decisiones:** Las ramas que salen de un rombo de decisión deben cubrir todos los posibles estados lógicos (es buena práctica incluir una rama `[else]` para manejo de excepciones).
3. **No Usar Merge como Join:** No usar un rombo para sincronizar flujos concurrentes; el rombo se dispara con el primer token que llegue, produciendo condiciones de carrera. Usar siempre la barra de Join.
