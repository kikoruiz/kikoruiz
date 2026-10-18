---
title: 'Tutorial: De la pantalla al paper'
excerpt: "El meu procés pas a pas per imprimir una foto, des de calibrar el monitor fins a tallar el paper, cuidant que el color hi arribe intacte."
author: 'kiko-ruiz'
tags: 'photography, tutorial'
---

Una foto no està acabada fins que la tens a les mans. I perquè el que tens a les mans s'assemble al que vas veure a la pantalla, **l'edició i la impressió han de ser una mateixa feina**, no dos oficis que es passen el testimoni.

Per això la meua manera d'imprimir és la més artesana i delicada que sé. No busque rapidesa; busque que el color que vaig decidir en editar siga el que acabe al paper. Tota la resta (el paper, el format, el tall) està al servei d'això, i tot comença en un lloc que molta gent se salta: **calibrar**.

Ací va el meu pas a pas, tal com el faig. Els papers i formats que esmente són els mateixos que oferisc a la [botiga d'impressions](/tienda/impresiones).

![La meua Canon imagePROGRAF PRO-1000 en plena impressió {"priority": true, "align": "right", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_impresora.jpg)

## Preparar el monitor i l'entorn

Treballe amb un **BenQ PhotoVue SW271C**, un 27" 4K que cobreix el 99 % d'Adobe RGB, el 100 % de sRGB i el 90 % de DCI-P3, amb una LUT 3D de 16 bits. El que importa d'aquesta LUT és que permet calibrar **per maquinari**: les correccions s'escriuen al propi monitor, no a la targeta gràfica, i per això són més estables en el temps.

Abans de mesurar res, prepare el terreny:

- Netege la pantalla, perquè una empremta just on recolze la sonda pot fer malbé la mesura.
- Restablisc els ajustos manuals del monitor des del seu menú.
- Al Mac mini desactive l'estalvi de pantalla, Night Shift i l'estalvi d'energia.
- Deixe el monitor encés **almenys mitja hora** perquè els components s'estabilitzen tèrmicament.
- Connecte el monitor al Mac amb el cable de vídeo i també amb el cable USB de la caixa; sense ell, la calibració per maquinari no funciona.

## Calibrar i perfilar el monitor

Per mesurar faig servir la sonda **X-Rite i1Display Pro** i el programari **BenQ Palette Master Element**. La meua guia és l'excel·lent tutorial de [Francesco Gola](https://www.francescogola.net/tutorial/monitor-calibration-and-profiling-with-benq-palette-master-element/), del qual parteixen els meus ajustos.

Tinc **dues calibracions**, perquè editar i imprimir demanen coses diferents:

- **Edició:** punt blanc D65, lluminància de 120 cd/m² i primaris natius del panell.
- **Impressió:** el mateix D65, però amb la lluminància abaixada cap als 80 cd/m². Una pantalla massa lluminosa fa que després la còpia semble fosca en comparar-la.

En ambdues deixe la gamma en 2,2, trie perfil de versió 2 per compatibilitat, de tipus LUT de 16 bits i amb el major nombre de pegats possible. En acabar, valide la calibració i no continue fins a veure el resultat correcte.

## Editar amb el color com a referència

Revise i revele a **Lightroom** i acabe els retocs fins a **Photoshop**, sempre amb la calibració d'edició activa. Ací no hi ha truc: si la pantalla menteix, tot el que decidisca després estarà basat en una mentida.

Edite pensant ja en el paper. Cuide el contrast i les ombres amb més atenció que per a una foto que només es veurà en pantalla, perquè el paper no emet llum: la reflecteix, i el seu negre mai serà tan profund com el d'un monitor.

## Triar paper i format

El paper és la meitat del resultat. Imprimisc sobre **Hahnemühle [Photo Pearl 310](https://www.hahnemuehle.com/es/digital-fineart/hahnemuehle-photo/p/Product/show/37/649.html)**, un paper de 310 g amb acabat perlat que respecta els colors i dona profunditat a les ombres sense els reflexos d'un brillant total.

El format el marca la foto, no al revés. Treballe en **A4, A3 i A2**, amb vora o sense, i amb la meua signatura si ho prefereixes. Un format ben triat deixa respirar la composició.

## Simular la còpia en pantalla

Abans de gastar tinta, faig una **prova de pantalla** (soft proofing). Active la calibració d'impressió del monitor i simule a Lightroom o Photoshop el perfil ICC d'aquest paper amb la meua impressora, amb l'opció de simular el color del paper i el negre de la tinta.

Aquesta vista prèvia mostra el que el paper no pot reproduir: colors fora de gamma que es retallen i negres que s'aclareixen. Retoque el just per compensar-ho i no més, perquè l'objectiu és acostar la còpia a l'edició, no reinventar-la.

## Imprimir amb el color sota control

Imprimisc amb una **Canon imagePROGRAF PRO-1000** i les seues **tintes pigmentades originals Canon**. No faig servir tintes compatibles: tota la calibració perd el sentit si canvia el que ix pels capçals.

La regla d'or és que **només un programa gestiona el color**. Ho fa Photoshop amb el perfil del paper, i al controlador de la impressora desactive qualsevol correcció. Si tots dos toquen el color, es corregeix dues vegades i el resultat és impredictible.

Per a la intenció de renderitzat parte del colorimètric relatiu amb compensació del punt negre, i prove el perceptual si la prova de pantalla mostra retalls importants.

## Deixar reposar i valorar la còpia

La còpia acabada d'imprimir enganya. La tinta necessita unes hores per assentar-se i el color acaba de definir-se amb elles, així que **no la jutge en traure-la**.

La deixe reposar plana, sense tocar la superfície, i la valore sempre sota la mateixa llum neutra. Només llavors la compare amb la pantalla. Si alguna cosa no em convenç, torne a l'edició i ajuste, perquè eixe és el sentit que tot siga un únic flux de treball.

## Tallar i revisar

L'últim pas és físic. Amb el tallador **Dahle Bis A2** retalle el paper a mida i deixe els marges exactes, amb un tall net d'un sol gest. Una vora mal tallada fa malbé una còpia perfecta.

Revise la superfície, les vores i el color una última vegada i només llavors la done per bona. És un procés lent, però és el que em permet mirar la còpia i reconéixer, per fi, la foto que vaig veure en editar-la.

Si vols tindre una de les meues fotos així, a la [botiga](/tienda/impresiones) tens les impressions amb aquest mateix paper i aquesta mateixa cura.
