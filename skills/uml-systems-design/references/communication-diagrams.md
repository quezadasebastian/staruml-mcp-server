# Guía Técnica: Diagramas de Comunicación / Colaboración (UML 2.5.1)

## 1. Definición y Propósito
El Diagrama de Comunicación (denominado *Diagrama de Colaboración* en UML 1.x) modela interacciones entre objetos enfatizando la **organización estructural de las instancias y sus enlaces directos** en lugar del flujo temporal vertical. Es isomórfico semánticamente al Diagrama de Secuencia, pero resalta las conexiones de red y la arquitectura de acoplamiento.

---

## 2. Elementos Notacionales Formativos

### 2.1. Objetos y Roles (`UMLObject` / `Lifeline`)
- Rectángulos rotulados con la sintaxis:
  $$\text{nombreInstancia} : \text{TipoClase}$$
- Pueden ser anónimos (ej. `:PedidoController`) o con identificador específico (ej. `miPedido : Pedido`).
- Se colocan en el lienzo en disposición espacial bidimensional (en red o estrella).

### 2.2. Enlaces / Conexiones (`UMLLink`)
- Líneas sólidas entre dos objetos que indican una vía de comunicación existente (generalmente una instancia de una asociación entre sus clases).

### 2.3. Mensajes con Numeración Secuencial
- Flechas pequeñas dibujadas paralelamente al enlace que indican la dirección del mensaje.
- **Esquema de Numeración Jerárquica:**
  - `1`: Primer mensaje de alto nivel.
  - `1.1`, `1.2`: Sub-mensajes generados durante la ejecución del mensaje `1`.
  - `1.2.1`: Mensaje anidado generado por `1.2`.
  - `2`: Siguiente mensaje al mismo nivel que `1`.
- **Concurrencia:** Letras para hilos concurrentes (ej. `1.1a`, `1.1b`).
- **Retorno:** Si se representa valor de retorno, se indica como `1.1: resultado := operacion(params)`.

---

## 3. ¿Cuándo Elegir Comunicación vs Secuencia?

| Criterio | Diagrama de Secuencia | Diagrama de Comunicación |
| :--- | :--- | :--- |
| **Énfasis Principal** | Orden temporal cronológico estricto | Topología estructural de enlaces |
| **Facilidad de Lectura** | Excelente para flujos de control paso a paso | Excelente para comprender el acoplamiento de componentes |
| **Concurrencia Compleja** | Se visualiza con fragmentos `par` | Se visualiza con prefijos de letras en mensajes |
| **Uso Típico** | Diseño detallado de APIs y Casos de Uso | Arquitectura de microservicios y patrones de diseño (ej. Observer, Chain of Responsibility) |
