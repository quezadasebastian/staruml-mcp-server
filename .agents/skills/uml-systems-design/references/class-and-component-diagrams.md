# Guía Técnica: Diagramas de Clases y Componentes (UML 2.5.1)

## 1. Definición y Propósito
El Diagrama de Clases modela la estructura estática del software describiendo las clases, interfaces, tipos de datos y sus interconexiones de acoplamiento e invariantes. El Diagrama de Componentes modela la modularidad a nivel de artefactos ejecutables, librerías, subsistemas e interfaces provistas y requeridas.

---

## 2. Tipos de Entidades y Miembros

### 2.1. Clases (`UMLClass`), Interfaces (`UMLInterface`) y Enums (`UMLEnumeration`)
- Rectángulo dividido en 3 compartimentos:
  1. **Compartimento de Nombre:** Estereotipo (ej. `<<interface>>`, `<<abstract>>`, `<<service>>`, `<<entity>>`) y nombre del clasificador.
  2. **Compartimento de Atributos:** Variables y campos con visibilidad y tipo.
  3. **Compartimento de Operaciones:** Métodos y funciones con signatura y tipo de retorno.

### 2.2. Modificadores de Visibilidad
- `+` **Public:** Accesible desde cualquier clasificador.
- `-` **Private:** Accesible únicamente dentro de la clase que lo declara.
- `#` **Protected:** Accesible por la clase y sus descendientes por herencia.
- `~` **Package / Internal:** Accesible por clasificadores dentro del mismo paquete/módulo.

---

## 3. Las 6 Relaciones Formales de UML

| Relación | Tipo en Metamodelo | Notación Gráfica | Semántica y Grado de Acoplamiento |
| :--- | :--- | :--- | :--- |
| **Herencia (Generalización)** | `UMLGeneralization` | Línea sólida con triángulo hueco cerrado en el ancestro | Relación "es un" (*is-a*). Máximo acoplamiento estático. |
| **Realización de Interfaz** | `UMLInterfaceRealization` | Línea discontinua con triángulo hueco cerrado en la interfaz | Un clasificador implementa el contrato estipulado por una interfaz. |
| **Composición** | `UMLAssociation` (`composite`) | Línea sólida con rombo negro relleno en el todo | Relación parte-todo fuerte (*part-whole*). El ciclo de vida de la parte depende del todo; si se destruye el todo, se destruyen las partes. |
| **Agregación** | `UMLAssociation` (`shared`) | Línea sólida con rombo blanco hueco en el todo | Relación parte-todo débil (*has-a*). La parte puede existir independientemente del todo (ej. un Estudiante en un Curso). |
| **Asociación Simple** | `UMLAssociation` (`none`) | Línea sólida continua (opcionalmente dirigida) | Conexión semántica entre dos clases independientes. Posee multiplicidades en ambos extremos. |
| **Dependencia** | `UMLDependency` | Línea discontinua con flecha abierta en el proveedor | Relación "usa un" (*uses-a*). Un cambio en el elemento destino puede afectar al origen (ej. parámetros de método, variables locales temporales). |

---

## 4. Multiplicidades Formativas
- `1` : Exactamente una instancia obligatoria.
- `0..1` : Cero o una instancia (opcional / nullable).
- `*` o `0..*` : Cero o muchas instancias (colección).
- `1..*` : Una o muchas instancias (al menos una obligatoria).
- `n..m` : Rango discreto específico.

---

## 5. Diagramas de Componentes
- **Componente (`UMLComponent`):** Unidad autónoma modular con comportamiento encapsulado.
- **Interfaz Provista (Provided Interface):** Conector tipo "lollipop" (círculo con paleta) que representa servicios expuestos.
- **Interfaz Requerida (Required Interface):** Conector tipo "socket" (semicírculo o copa) que representa servicios necesarios para funcionar.
