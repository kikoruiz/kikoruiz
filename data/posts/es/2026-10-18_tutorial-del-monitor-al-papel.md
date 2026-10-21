---
title: 'Tutorial: Del monitor al papel'
excerpt: 'Mi proceso paso a paso para imprimir una foto, desde calibrar el monitor hasta cortar el papel, cuidando que el color llegue intacto.'
author: 'kiko-ruiz'
tags: 'photography, tutorial'
---

Una foto no está terminada hasta que la tienes en las manos. Y para que lo que tienes en las manos se parezca a lo que viste en la pantalla, **la edición y la impresión tienen que ser un mismo trabajo**, no dos oficios que se pasan el testigo.

Por eso mi forma de imprimir es lo más artesana y delicada que sé. No busco rapidez. Busco que el color que decidí al editar sea el que acabe en el papel. Todo lo demás (el papel, el formato, el corte) está al servicio de eso, y todo empieza en un sitio que mucha gente se salta: **calibrar**.

Aquí va mi paso a paso, tal cual lo hago. Los papeles y formatos que menciono son los mismos que ofrezco en la [tienda de impresiones](/tienda/impresiones). Y como sé que esto está lleno de siglas que echan para atrás, voy explicando cada una en cristiano según aparece.

![Mi Canon imagePROGRAF PRO-1000 en plena impresión {"priority": true, "align": "right", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_impresora.jpg)

## Preparar el monitor y el entorno

Trabajo con un **BenQ PhotoVue SW271C**, un monitor de 27" con resolución 4K pensado para fotografía. Según su ficha cubre el 99% de Adobe RGB, el 100% de sRGB y el 90% de DCI-P3, y lleva una LUT 3D de 16 bits. Dicho así suena a jeroglífico, así que lo traduzco:

- **Espacios de color (sRGB, Adobe RGB, DCI-P3).** Un espacio de color es el conjunto de colores que un dispositivo es capaz de mostrar o imprimir. Piensa en cajas de lápices: unas tienen más tonos que otras. sRGB es la caja estándar de internet, la que casi todas las pantallas y navegadores dan por hecha. Adobe RGB es una caja más grande, sobre todo en verdes y azules turquesa, y me interesa porque una impresora alcanza tonos que sRGB no tiene. DCI-P3 es la del cine digital, y la usan también muchas pantallas de móviles y portátiles modernos. Que mi monitor cubra el 99% de Adobe RGB significa que puede enseñarme casi todos esos colores, y por tanto edito viendo la foto completa.
- **LUT 3D de 16 bits.** LUT viene de *look-up table*, "tabla de consulta". Es una tabla que lleva el monitor por dentro y que funciona como un traductor: cada vez que recibe un color del ordenador, mira en la tabla qué señal exacta tiene que mandar al panel para que se vea correcto. Es "3D" porque corrige a la vez el rojo, el verde y el azul, así que puede arreglar un tono sin estropear otro. Y "16 bits" cuenta cuántos escalones tiene cada color (65.536), lo que da degradados suaves, sin esas bandas que a veces se ven en un cielo.
- **Calibrar por *hardware*.** Con esa tabla interna, las correcciones de la calibración se escriben en el propio monitor y no en la tarjeta gráfica del ordenador. Por eso son más estables en el tiempo y no dependen de qué ordenador o programa tenga delante.

Antes de medir nada, preparo el terreno:

- Limpio la pantalla, porque una huella justo donde apoyo el calibrador de monitores puede estropear la medición.
- Restablezco los ajustes manuales del monitor desde su menú.
- En el Mac mini desactivo el salvapantallas, *Night Shift* y el ahorro de energía.
- Dejo el monitor encendido **al menos media hora** para que los componentes se estabilicen térmicamente.
- Conecto el monitor al Mac con un cable HDMI y también con el cable USB de la caja. Sin ese cable USB, la calibración por *hardware* no funciona.

## Calibrar y perfilar el monitor

Para medir uso el calibrador de monitores **X-Rite i1Display Pro**, un aparato que se cuelga delante de la pantalla y mide la luz y el color que emite, y el software **BenQ Palette Master Element**. Mi guía es el magnífico tutorial de [Francesco Gola](https://www.francescogola.net/tutorial/monitor-calibration-and-profiling-with-benq-palette-master-element/), del que parten mis ajustes.

![Mi BenQ PhotoVue SW271C, con una de mis fotos en pantalla {"align": "left", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_monitor.jpg)

Tengo **tres calibraciones**, porque editar, imprimir y enseñar mis fotos piden cosas distintas:

- **Edición:** punto blanco D65, luminancia de 120 cd/m² y primarios nativos del panel.
- **Impresión:** el mismo D65, pero con la luminancia bajada hacia los 80 cd/m². Una pantalla demasiado brillante hace que luego la copia parezca oscura al compararla.
- **Visualización RGB:** pensada para ver mis fotos como las verá casi todo el mundo, en redes sociales o en una web, es decir, en una pantalla corriente. Es mi comprobación final de que la foto aguanta fuera de mi monitor.

Los ajustes, en cristiano:

- **Punto blanco, D65.** Un blanco no siempre es el mismo blanco. Puede tirar a cálido, como la luz de una bombilla, o a frío, como un cielo nublado. Esa tendencia se mide en kelvin. D65 equivale a unos 6500 K y representa la luz del día media. Es el estándar de internet, de la fotografía y del vídeo, así que es el blanco que da por hecho casi todo el mundo.
- **Luminancia, cd/m².** Es simplemente el brillo de la pantalla. Se mide en candelas por metro cuadrado, y la unidad viene de la luz que daba una vela. Con 120 cd/m² tengo un brillo cómodo para editar en una habitación con luz moderada. Para imprimir bajo a unos 80 porque un papel no emite luz, solo refleja la de la habitación. Si comparo una copia con una pantalla que brilla de más, la copia siempre parecerá apagada y acabaría editando demasiado claro.
- **Primarios nativos.** Los primarios son el rojo, el verde y el azul más puros que el panel sabe mostrar, y con ellos se construyen todos los demás colores. "Nativos" quiere decir que uso el panel a su capacidad completa, sin recortarlo a una caja más pequeña. Los programas ya se encargan de enseñar bien las fotos que están en sRGB o en Adobe RGB.
- **Gamma 2,2.** La gamma es la curva que reparte el brillo entre los tonos oscuros, medios y claros. Nuestros ojos notan mucho más los cambios en las sombras que en las luces, y las imágenes se guardan teniéndolo en cuenta. Con 2,2, el valor estándar de las pantallas, los tonos medios no se ven ni lavados ni demasiado cargados. Si la pantalla usa otra gamma, la foto cambia de aspecto aunque no la hayas tocado.
- **Perfil ICC y parches.** El perfil ICC es el archivo que describe cómo se comporta mi monitor, para que Lightroom y Photoshop sepan qué corregir. Elijo la versión 2 porque es la más compatible con programas. Los parches son los cuadros de color que el calibrador va midiendo, y cuantos más mida, más preciso es el perfil. Por eso uso el mayor número posible. El tipo "LUT de 16 bits" es el que aprovecha la tabla interna del monitor.

Al terminar, valido la calibración y no sigo hasta ver el resultado correcto.

## Editar con el color como referencia

Reviso y revelo en **Lightroom** y termino los retoques finos en **Photoshop**, siempre con la calibración de edición activa. Aquí no hay truco: si la pantalla miente, todo lo que decida después estará basado en una mentira.

Edito pensando ya en el papel. Cuido el contraste y las sombras con más cuidado que para una foto que solo se verá en pantalla, porque el papel no emite luz. La refleja, y su negro nunca será tan profundo como el de un monitor.

Cuando termino, cambio a la calibración de visualización RGB para comprobar cómo se verá en redes sociales y en la web. La edición la hago para el papel, pero la foto tiene que defenderse en las dos casas.

## Elegir papel y formato

El papel es la mitad del resultado. Imprimo sobre **Hahnemühle [Photo Pearl 310](https://www.hahnemuehle.com/es/papeles-de-impresion/hahnemuehle-photo/p/Product/show/37/649.html)**, y conviene entender qué tiene ese nombre:

- **Papel RC.** Las siglas vienen de *resin coated*, "recubierto de resina". La base del papel está plastificada y sobre ella lleva una capa microporosa pensada para absorber la tinta. La tinta se queda sujeta en esa capa en lugar de hundirse en las fibras, y eso se traduce en colores intensos, negros más profundos, una hoja que seca antes y que aguanta bien el manejo.
- **310 g.** Es el gramaje, lo gruesa que es la hoja. Con 310 gramos por metro cuadrado la copia es firme y no se dobla con facilidad, y se siente como una foto de verdad y no como un folio impreso.
- **Acabado perlado.** Está a medio camino entre el mate y el brillo. Conserva la viveza de los colores y la profundidad de las sombras, pero sin los reflejos molestos de un brillo total. La superficie es lisa, sin textura, así que nada compite con la imagen.
- **Blanco brillante y perfiles ICC.** El fabricante publica el perfil de color de este papel, y ese perfil es el que me permite simular la copia en pantalla antes de imprimir.

Lo elijo por equilibrio. Es un papel pensado para el uso diario, fiable y repetible, y eso es justo lo que busco: que la copia de hoy salga igual que la del mes pasado.

![Copias con borde y con mi firma, recién salidas de la impresora {"align": "right", "square": true}](/blog/2026-10-18_tutorial-del-monitor-al-papel_copias.jpg)

El formato lo marca la foto, no al revés. Trabajo en **A4, A3 y A2**, con borde o sin borde, y con mi firma si lo prefieres. Un formato bien elegido deja respirar la composición.

## Simular la copia en pantalla

Antes de gastar tinta, hago una **prueba de pantalla** (*soft proofing*). Activo la calibración de impresión del monitor y simulo en Lightroom o Photoshop el perfil ICC de este papel con mi impresora, con la opción de simular el color del papel y el negro de la tinta.

Esa vista previa muestra lo que el papel no puede reproducir: colores fuera de gama que se recortan y negros que se aclaran. Retoco lo justo para compensarlo y no más, porque el objetivo es acercar la copia a la edición, no reinventarla.

## Imprimir con el color bajo control

Imprimo con una **Canon imagePROGRAF PRO-1000** y con las **tintas originales de Canon**, la serie PFI-1000. No es un capricho. Tengo tres razones:

- **Son tintas pigmentadas.** Una tinta de tinte se disuelve en el líquido y penetra en el papel. El pigmento, en cambio, son partículas diminutas de color que se quedan sobre la superficie. Resisten mucho mejor la luz y la humedad y no se desvanecen con los años, algo que no quiero dejar al azar en una foto que alguien cuelga en su casa.
- **Son muchos colores.** La PRO-1000 trabaja con once tintas de color más un optimizador de croma (*Chroma Optimizer*), doce depósitos en total. Además del cian, el magenta y el amarillo hay versiones "foto" más claras de cian y magenta para los tonos suaves, un rojo y un azul que amplían los colores que puede alcanzar, y varios negros y grises. Los grises, por ejemplo, dan degradados neutros sin que se cuele ninguna dominante de color. El optimizador de croma no es un color, sino una capa transparente que ayuda a que el brillo sea uniforme sobre papeles satinados.
- **Perfil y tinta van de la mano.** Un perfil de color se crea midiendo impresiones hechas con una combinación exacta de impresora, papel y tinta. Con una tinta compatible esos números dejan de encajar y toda la calibración pierde el sentido. Con la original sé que lo que sale de los cabezales es lo que el perfil espera.

La regla de oro es que **solo un programa gestiona el color**. Lo hace Photoshop con el perfil del papel, y en el controlador de la impresora desactivo cualquier corrección. Si los dos tocan el color, se corrige dos veces y el resultado es impredecible.

Para el intento de renderizado parto del colorimétrico relativo con compensación del punto negro, y pruebo el perceptual si la prueba de pantalla enseña recortes importantes.

## Dejar reposar y valorar la copia

La copia recién impresa engaña. La tinta necesita unas horas para asentarse y el color termina de definirse con ellas, así que **no la juzgo al sacarla**.

La dejo reposar plana, sin tocar la superficie, y la valoro siempre bajo la misma luz neutra. Solo entonces la comparo con la pantalla. Si algo no me convence, vuelvo a la edición y ajusto, porque ese es el sentido de que todo sea un único flujo de trabajo.

## Cortar y revisar

El último paso es físico. Con la cizalla rotativa **Dahle 554** recorto el papel a medida y dejo los márgenes exactos. Su cuchilla se autoafila y la abrazadera automática sujeta la hoja mientras corto, así que el corte sale limpio, sin rebabas y de un solo gesto. Un borde mal cortado estropea una copia perfecta.

Reviso la superficie, los bordes y el color una última vez y solo entonces la doy por buena. Es un proceso lento, pero es el que me permite mirar la copia y reconocer, por fin, la foto que vi al editarla.

Si quieres tener una de mis fotos así, en la [tienda](/tienda/impresiones) tienes las impresiones con este mismo papel y este mismo cuidado.
