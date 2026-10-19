---
title: 'Tutorial: Del monitor al papel'
excerpt: 'Mi proceso paso a paso para imprimir una foto, desde calibrar el monitor hasta cortar el papel, cuidando que el color llegue intacto.'
author: 'kiko-ruiz'
tags: 'photography, tutorial'
---

Una foto no está terminada hasta que la tienes en las manos. Y para que lo que tienes en las manos se parezca a lo que viste en la pantalla, **la edición y la impresión tienen que ser un mismo trabajo**, no dos oficios que se pasan el testigo.

Por eso mi forma de imprimir es lo más artesana y delicada que sé. No busco rapidez; busco que el color que decidí al editar sea el que acabe en el papel. Todo lo demás (el papel, el formato, el corte) está al servicio de eso, y todo empieza en un sitio que mucha gente se salta: **calibrar**.

Aquí va mi paso a paso, tal cual lo hago. Los papeles y formatos que menciono son los mismos que ofrezco en la [tienda de impresiones](/tienda/impresiones).

![Mi Canon imagePROGRAF PRO-1000 en plena impresión {"priority": true, "align": "right", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_impresora.jpg)

## Preparar el monitor y el entorno

Trabajo con un **BenQ PhotoVue SW271C**, un 27" 4K que cubre el 99 % de Adobe RGB, el 100 % de sRGB y el 90 % de DCI-P3, con una LUT 3D de 16 bits. Lo importante de esa LUT es que permite calibrar **por *hardware***: las correcciones se escriben en el propio monitor, no en la tarjeta gráfica, y por eso son más estables en el tiempo.

Antes de medir nada, preparo el terreno:

- Limpio la pantalla, porque una huella justo donde apoyo la sonda puede estropear la medición.
- Restablezco los ajustes manuales del monitor desde su menú.
- En el Mac mini desactivo el salvapantallas, *Night Shift* y el ahorro de energía.
- Dejo el monitor encendido **al menos media hora** para que los componentes se estabilicen térmicamente.
- Conecto el monitor al Mac con el cable de vídeo y también con el cable USB de la caja; sin él, la calibración por *hardware* no funciona.

## Calibrar y perfilar el monitor

Para medir uso la sonda **X-Rite i1Display Pro** y el software **BenQ Palette Master Element**. Mi guía es el magnífico tutorial de [Francesco Gola](https://www.francescogola.net/tutorial/monitor-calibration-and-profiling-with-benq-palette-master-element/), del que parten mis ajustes.

![Mi BenQ PhotoVue SW271C con su capucha, con Lightroom Classic en pantalla {"align": "left"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_monitor.jpg)

Tengo **dos calibraciones**, porque editar e imprimir piden cosas distintas:

- **Edición:** punto blanco D65, luminancia de 120 cd/m² y primarios nativos del panel.
- **Impresión:** el mismo D65, pero con la luminancia bajada hacia los 80 cd/m². Una pantalla demasiado brillante hace que luego la copia parezca oscura al compararla.

En ambas dejo la gamma en 2,2, elijo perfil de versión 2 por compatibilidad, de tipo LUT de 16 bits y con el mayor número de parches posible. Al terminar, valido la calibración y no sigo hasta ver el resultado correcto.

## Editar con el color como referencia

Reviso y revelo en **Lightroom** y termino los retoques finos en **Photoshop**, siempre con la calibración de edición activa. Aquí no hay truco: si la pantalla miente, todo lo que decida después estará basado en una mentira.

Edito pensando ya en el papel. Cuido el contraste y las sombras con más cuidado que para una foto que solo se verá en pantalla, porque el papel no emite luz: la refleja, y su negro nunca será tan profundo como el de un monitor.

## Elegir papel y formato

El papel es la mitad del resultado. Imprimo sobre **Hahnemühle [Photo Pearl 310](https://www.hahnemuehle.com/es/digital-fineart/hahnemuehle-photo/p/Product/show/37/649.html)**, un papel de 310 g con acabado perlado que respeta los colores y da profundidad a las sombras sin los reflejos de un brillo total.

![Copias con borde y con mi firma, recién salidas de la impresora {"align": "right", "square": true}](/blog/2026-10-18_tutorial-del-monitor-al-papel_copias.jpg)

El formato lo marca la foto, no al revés. Trabajo en **A4, A3 y A2**, con borde o sin borde, y con mi firma si lo prefieres. Un formato bien elegido deja respirar la composición.

## Simular la copia en pantalla

Antes de gastar tinta, hago una **prueba de pantalla** (*soft proofing*). Activo la calibración de impresión del monitor y simulo en Lightroom o Photoshop el perfil ICC de este papel con mi impresora, con la opción de simular el color del papel y el negro de la tinta.

Esa vista previa muestra lo que el papel no puede reproducir: colores fuera de gama que se recortan y negros que se aclaran. Retoco lo justo para compensarlo y no más, porque el objetivo es acercar la copia a la edición, no reinventarla.

## Imprimir con el color bajo control

Imprimo con una **Canon imagePROGRAF PRO-1000** y sus **tintas pigmentadas originales Canon**. No uso tintas compatibles: toda la calibración pierde sentido si cambia lo que sale por los cabezales.

La regla de oro es que **solo un programa gestiona el color**. Lo hace Photoshop con el perfil del papel, y en el controlador de la impresora desactivo cualquier corrección. Si los dos tocan el color, se corrige dos veces y el resultado es impredecible.

Para el intento de renderizado parto del colorimétrico relativo con compensación del punto negro, y pruebo el perceptual si la prueba de pantalla enseña recortes importantes.

## Dejar reposar y valorar la copia

La copia recién impresa engaña. La tinta necesita unas horas para asentarse y el color termina de definirse con ellas, así que **no la juzgo al sacarla**.

La dejo reposar plana, sin tocar la superficie, y la valoro siempre bajo la misma luz neutra. Solo entonces la comparo con la pantalla. Si algo no me convence, vuelvo a la edición y ajusto, porque ese es el sentido de que todo sea un único flujo de trabajo.

## Cortar y revisar

El último paso es físico. Con la cizalla rotativa **Dahle 554** recorto el papel a medida y dejo los márgenes exactos. Su cuchilla se autoafila y la abrazadera automática sujeta la hoja mientras corto, así que el corte sale limpio, sin rebabas y de un solo gesto. Un borde mal cortado estropea una copia perfecta.

Reviso la superficie, los bordes y el color una última vez y solo entonces la doy por buena. Es un proceso lento, pero es el que me permite mirar la copia y reconocer, por fin, la foto que vi al editarla.

Si quieres tener una de mis fotos así, en la [tienda](/tienda/impresiones) tienes las impresiones con este mismo papel y este mismo cuidado.
