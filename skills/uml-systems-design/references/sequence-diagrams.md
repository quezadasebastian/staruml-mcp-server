# Guía Técnica: Diagramas de Secuencia (UML 2.5.1)

## 1. Definición y Propósito
El Diagrama de Secuencia modela interacciones entre instancias o componentes organizadas a lo largo de una línea temporal vertical. Muestra el orden cronológico explícito de las invocaciones a métodos, transferencias de mensajes y retornos para realizar un caso de uso o escenario determinado.

---

## 2. Elementos Notacionales Formativos

### 2.1. Líneas de Vida (`UMLLifeline`)
- Representan participantes individuales en la interacción.
- Se ilustran con un encabezado rectangular en la parte superior y una línea punteada vertical que desciende indicando el paso del tiempo.
- **Convenciones de Roles (BCE Pattern):**
  - **Actor:** Usuario humano o sistema externo que dispara la petición.
  - **Boundary (`<<boundary>>`):** Controladores de API, interfaces de usuario o adaptadores de entrada.
  - **Control (`<<control>>`):** Servicios de aplicación, orquestadores, gestores de casos de uso.
  - **Entity (`<<entity>>`):** Entidades de dominio, modelos o repositorios de persistencia.

### 2.2. Barras de Activación / Ejecución (`ExecutionSpecification`)
- Rectángulos verticales estrechos colocados sobre la línea de vida punteada.
- Indican el período exacto durante el cual la instancia tiene el foco de control o se encuentra ejecutando cómputo activo.

### 2.3. Tipos de Mensajes (`UMLMessage`)
- **Mensaje Sincrónico (`synchCall`):**
  - Línea sólida con punta de flecha rellena sólida (`->`).
  - El emisor suspende su ejecución y espera a que el receptor complete el procesamiento antes de continuar.
- **Mensaje Asincrónico (`asynchCall`):**
  - Línea sólida con punta de flecha abierta (`->`).
  - El emisor despacha el mensaje (ej. eventos de mensajería, colas RabbitMQ/Kafka) y continúa su ejecución inmediatamente sin bloquearse.
- **Mensaje de Respuesta / Retorno (`reply`):**
  - Línea punteada con punta de flecha abierta (`-->`).
  - Devuelve el control y opcionalmente un valor o resultado al emisor de una llamada sincrónica previa.
- **Mensaje de Creación (`createMessage`):**
  - Flecha abierta dirigida directamente contra el rectángulo superior de una nueva línea de vida (instanciación de objetos).
- **Mensaje de Destrucción (`destroyMessage`):**
  - Termina la línea de vida con una cruz grande (`X`) al final del eje temporal.

### 2.4. Fragmentos Combinados (`CombinedFragment`)
Marcos rectangulares con un operador pentagonal en la esquina superior izquierda que gobiernan flujos complejos:
- **`alt` (Alternativa):** Bloque if-else condicional. Dividido por líneas punteadas horizontales con guardas `[condición]`.
- **`opt` (Opcional):** Bloque que se ejecuta únicamente si la guarda se cumple.
- **`loop` (Bucle):** Bloque iterativo gobernado por un rango o condición `[min, max]`.
- **`par` (Paralelo):** Secciones concurrentes ejecutadas simultáneamente en múltiples líneas de vida.
- **`critical` (Región Crítica):** Bloque indivisible o sección atómica sin intercalación de otros mensajes.

---

## 3. Reglas Técnicas y Antipatrones

1. **Monotonía Temporal Descendente:** Las llamadas ocurren estrictamente hacia abajo. Cada mensaje debe ubicarse en una coordenada $Y$ mayor que la del mensaje que lo precede cronológicamente.
2. **Correspondencia de Retornos:** Toda llamada sincrónica que devuelva datos o señale finalización de procesamiento debe emparejarse con un mensaje de retorno (`reply`) apuntando de regreso al invocador antes de que este inicie una nueva llamada en el mismo hilo.
3. **Llamadas Reflexivas:** Cuando una instancia se llama a sí misma (auto-invocación), la flecha sale de su barra de activación, dobla en 90° y regresa a una sub-barra de activación anidada desplazada hacia la derecha.
