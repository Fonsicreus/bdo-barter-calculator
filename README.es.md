# BDO Barter Calculator

[English](README.md) · **Español**

Calcula qué llevar al salir del puerto, cuánto pesará la carga después de cada isla y con cuántos objetos podrás volver. Satella mantiene este planificador no oficial de Black Desert Online.

El selector de idioma permite alternar entre español, inglés, coreano, japonés y chino simplificado.

## Qué puedes planificar

| En el planificador | Qué puedes hacer |
| --- | --- |
| **Trueque individual** | Calcula cuántos intercambios caben y con qué peso saldrás de la isla tras aceptar una oferta. |
| **Cadena por niveles** | Elige el nivel que quieres conseguir y calcula la carga inicial que te dará más objetos de ese nivel, según los intercambios que queden en cada parada. |
| **Varios trueques** | Combina ofertas encadenadas e independientes. Cambia las cantidades o el orden de las paradas para ver en qué punto pesa más la carga. |
| **Referencia de objetos** | Consulta pesos, precios de venta a PNJ y requisitos de desbloqueo de rutas y de trueques especiales. |

Para tu primer cálculo, selecciona el barco, introduce la capacidad máxima en LT que aparece en su ficha y elige **Trueque individual**. Por ejemplo, si una isla ofrece dos objetos de nivel 2 por uno de nivel 1, cuatro intercambios convierten 400 LT de mercancía en 3.200 LT. A ambos pesos se suma el resto de la carga que ya lleves a bordo.

## Datos de trueque

Los pesos base y precios de venta a PNJ de la tabla siguen la actualización de Pearl Abyss del 16 de abril de 2026.

| Nivel | Peso por objeto | Precio de venta a PNJ |
| --- | --- | --- |
| 1 | 100 LT | No se vende |
| 2 | 400 LT | No se vende |
| 3 | 900 LT | 1.000.000 de plata |
| 4 | 1.000 LT | 2.000.000 de plata |
| 5 | 1.000 LT | 10.000.000 de plata normal / 25.000.000 del Gran Océano (Great Ocean) |
| 6 | 2.000 LT | 50.000.000 de plata |
| 7 | 2.000 LT | 100.000.000 de plata |

- Usa las cantidades y el número de intercambios restantes que aparezcan en cada oferta del juego. El botón **Debug** de la cabecera habilita ratios personalizados para las ofertas compatibles.
- El tramo de nivel 0 → 1 da un objeto de nivel 1 por trueque. Indica cuántos trueques quieres hacer e incluye los materiales terrestres en la **carga previa**. Su peso se mantiene en la estimación durante toda la ruta.
- Los materiales del barco tienen pesos propios y las cantidades de monedas de cuervo dependen de la oferta. Antes de vender un objeto de nivel 5, comprueba si está marcado como **Gran Océano (Great Ocean)**.
- El planificador reutiliza objetos según su nivel. Confirma que son exactamente los que pide la siguiente oferta.

### Capacidad del barco

Introduce el máximo de LT que muestra la información del barco con el equipo, los marineros y los efectos aplicados. Excluye de la **carga previa** los objetos que vas a intercambiar, salvo los materiales terrestres de nivel 0 descritos arriba. El planificador supone que los objetos que no obtengas de paradas anteriores se cargan en el primer puerto.

**Sobrecarga** permite terminar la última oferta de la isla por encima de la capacidad normal al realizar todos sus trueques en un solo lote. El barco debe respetar la capacidad normal al cargar en el puerto y antes de iniciar otra oferta. El tope final del **150 %** es una estimación provisional.

### Fuentes

- Notas e historial de actualizaciones de Pearl Abyss. [Actualización del 16 de abril de 2026](https://www.naeu.playblackdesert.com/News/Detail?groupContentNo=9973) · [Historial de trueques](https://www.naeu.playblackdesert.com/Adventure/History?_groupMasterNo=10127)
- Capacidades de barcos y desbloqueo de rutas. [BDO Codex](https://bdocodex.com/us/) · [Black Desert Foundry](https://www.blackdesertfoundry.com/bartering-guide/)
- Cambios en los requisitos del trueque especial. [Notas del parche de Pearl Abyss](https://www.tw.playblackdesert.com/zh-TW/News/Detail?countryType=zh-TW&groupContentNo=19419)

## Cómo ejecutarlo en local

Instala [Bun](https://bun.sh) y ejecuta estos comandos en la carpeta del proyecto. Abre la dirección local que Vite muestre en la terminal.

```bash
bun install --frozen-lockfile
bun run dev
```

La aplicación usa React, Vite, Tailwind CSS y Lucide. Estos comandos comprueban los cambios y generan el sitio estático.

```bash
bun run lint
bun test
bun run build
```

Usa `bun run preview` para abrir la compilación de producción en local. Al subir cambios a `main` se inicia el despliegue de Pages. Si termina correctamente, publica el contenido de `dist/` en la dirección que GitHub ha asignado a la calculadora. [Workflow de despliegue](.github/workflows/pages.yml) · [Dirección de GitHub Pages](https://fonsicreus.github.io/bdo-barter-calculator/)

## Colaboraciones y licencia

El proyecto utiliza IA bajo supervisión humana. Quienes contribuyen revisan los cambios generados y contrastan los datos de trueque con las notas de parche y las observaciones en el juego. Para comunicar una corrección, indica la región, la fecha del parche y la fuente del valor. [Guía de contribución en inglés](CONTRIBUTING.md) · [Código de conducta en inglés](CODE_OF_CONDUCT.md)

El código del proyecto se distribuye bajo PolyForm Noncommercial 1.0.0. El uso comercial requiere un permiso aparte. Black Desert Online es un juego de Pearl Abyss. [Licencia](LICENSE.md)
