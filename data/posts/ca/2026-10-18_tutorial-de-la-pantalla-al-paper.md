---
title: 'Tutorial: De la pantalla al paper'
excerpt: "El meu procés pas a pas per imprimir una foto, des de calibrar el monitor fins a tallar el paper, cuidant que el color hi arribe intacte."
author: 'kiko-ruiz'
tags: 'photography, tutorial'
---

Una foto no està acabada fins que la tens a les mans. I perquè el que tens a les mans s'assemble al que vas veure a la pantalla, **l'edició i la impressió han de ser una mateixa feina**, no dos oficis que es passen el testimoni.

Per això la meua manera d'imprimir és la més artesana i delicada que sé. No busque rapidesa. Busque que el color que vaig decidir en editar siga el que acabe al paper. Tota la resta (el paper, el format, el tall) està al servei d'això, i tot comença en un lloc que molta gent es salta: **calibrar**.

Ací va el meu pas a pas, tal com el faig. Els papers i formats que esmente són els mateixos que oferisc a la [botiga d'impressions](/tienda/impresiones). I com sé que açò està ple de sigles que fan arrere, vaig explicant cada una amb paraules senzilles segons apareix.

![La meua Canon imagePROGRAF PRO-1000 en plena impressió {"priority": true, "align": "right", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_impresora.jpg)

## Preparar el monitor i l'entorn

Treballe amb un **BenQ PhotoVue SW271C**, un monitor de 27" amb resolució 4K pensat per a fotografia. Segons la seua fitxa cobreix el 99% d'Adobe RGB, el 100% de sRGB i el 90% de DCI-P3, i porta una LUT 3D de 16 bits. Dit així sona a jeroglífic, així que ho traduïsc:

- **Espais de color (sRGB, Adobe RGB, DCI-P3).** Un espai de color és el conjunt de colors que un dispositiu és capaç de mostrar o imprimir. Pensa en caixes de llapis: unes tenen més tons que altres. sRGB és la caixa estàndard d'internet, la que quasi totes les pantalles i navegadors donen per feta. Adobe RGB és una caixa més gran, sobretot en verds i blaus turquesa, i m'interessa perquè una impressora aconsegueix tons que sRGB no té. DCI-P3 és la del cinema digital, i també l'usen moltes pantalles de mòbils i portàtils moderns. Que el meu monitor cobrisca el 99% d'Adobe RGB significa que pot ensenyar-me quasi tots eixos colors, i per tant edite veient la foto completa.
- **LUT 3D de 16 bits.** LUT ve de *look-up table*, "taula de consulta". És una taula que el monitor du per dins i que funciona com un traductor: cada vegada que rep un color de l'ordinador, mira a la taula quin senyal exacte ha d'enviar al panell perquè es veja correcte. És "3D" perquè corregeix alhora el roig, el verd i el blau, així que pot arreglar un to sense espatllar-ne un altre. I "16 bits" compta quants escalons té cada color (65.536), cosa que dona degradats suaus, sense eixes bandes que a vegades es veuen en un cel.
- **Calibrar per *hardware*.** Amb eixa taula interna, les correccions de la calibració s'escriuen al propi monitor i no a la targeta gràfica de l'ordinador. Per això són més estables en el temps i no depenen de quin ordinador o programa tinga davant.

Abans de mesurar res, prepare el terreny:

- Netege la pantalla, perquè una empremta just on recolze el calibrador de monitors pot fer malbé la mesura.
- Restablisc els ajustos manuals del monitor des del seu menú.
- Al Mac mini desactive l'estalvi de pantalla, *Night Shift* i l'estalvi d'energia.
- Deixe el monitor encés **almenys mitja hora** perquè els components s'estabilitzen tèrmicament.
- Connecte el monitor al Mac amb un cable HDMI i també amb el cable USB de la caixa. Sense eixe cable USB, la calibració per *hardware* no funciona.

## Calibrar i perfilar el monitor

Per mesurar faig servir el calibrador de monitors **X-Rite i1Display Pro**, un aparell que es penja davant de la pantalla i mesura la llum i el color que emet, i el programari **BenQ Palette Master Element**. La meua guia és l'excel·lent tutorial de [Francesco Gola](https://www.francescogola.net/tutorial/monitor-calibration-and-profiling-with-benq-palette-master-element/), del qual parteixen els meus ajustos.

![El meu BenQ PhotoVue SW271C, amb una de les meues fotos en pantalla {"align": "left", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_monitor.jpg)

Tinc **tres calibracions**, perquè editar, imprimir i ensenyar les meues fotos demanen coses diferents:

- **Edició:** punt blanc D65, lluminància de 120 cd/m² i primaris natius del panell.
- **Impressió:** el mateix D65, però amb la lluminància abaixada cap als 80 cd/m². Una pantalla massa lluminosa fa que després la còpia semble fosca en comparar-la.
- **Visualització RGB:** pensada per a veure les meues fotos com les veurà quasi tothom, en xarxes socials o en una web, és a dir, en una pantalla corrent. És la meua comprovació final que la foto aguanta fora del meu monitor.

Els ajustos, amb paraules senzilles:

- **Punt blanc, D65.** Un blanc no sempre és el mateix blanc. Pot tirar a càlid, com la llum d'una bombeta, o a fred, com un cel ennuvolat. Eixa tendència es mesura en kelvin. D65 equival a uns 6500 K i representa la llum del dia mitjana. És l'estàndard d'internet, de la fotografia i del vídeo, així que és el blanc que dona per fet quasi tothom.
- **Lluminància, cd/m².** És simplement la brillantor de la pantalla. S'expressa en candeles per metre quadrat, i la unitat ve de la llum que donava una espelma. Amb 120 cd/m² tinc una brillantor còmoda per a editar en una habitació amb llum moderada. Per a imprimir baixe a uns 80 perquè un paper no emet llum, només reflecteix la de l'habitació. Si compare una còpia amb una pantalla que brilla de més, la còpia sempre semblarà apagada i acabaria editant massa clar.
- **Primaris natius.** Els primaris són el roig, el verd i el blau més purs que el panell sap mostrar, i amb ells es construeixen tots els altres colors. "Natius" vol dir que faig servir el panell a la seua capacitat completa, sense retallar-lo a una caixa més xicoteta. Els programes ja s'encarreguen d'ensenyar bé les fotos que estan en sRGB o en Adobe RGB.
- **Gamma 2,2.** La gamma és la corba que reparteix la brillantor entre els tons foscos, mitjans i clars. Els nostres ulls noten molt més els canvis en les ombres que en les llums, i les imatges es guarden tenint-ho en compte. Amb 2,2, el valor estàndard de les pantalles, els tons mitjans no es veuen ni descolorits ni massa carregats. Si la pantalla usa una altra gamma, la foto canvia d'aspecte encara que no l'hages tocada.
- **Perfil ICC i pegats.** El perfil ICC és l'arxiu que descriu com es comporta el meu monitor, perquè Lightroom i Photoshop sàpiguen què corregir. Trie la versió 2 perquè és la més compatible amb programes. Els pegats són els quadres de color que el calibrador va mesurant, i com més en mesura, més precís és el perfil. Per això faig servir el major nombre possible. El tipus "LUT de 16 bits" és el que aprofita la taula interna del monitor.

En acabar, valide la calibració i no continue fins a veure el resultat correcte.

## Editar amb el color com a referència

Revise i revele a **Lightroom** i acabe els retocs fins a **Photoshop**, sempre amb la calibració d'edició activa. Ací no hi ha truc: si la pantalla menteix, tot el que decidisca després estarà basat en una mentida.

Edite pensant ja en el paper. Cuide el contrast i les ombres amb més atenció que per a una foto que només es veurà en pantalla, perquè el paper no emet llum. La reflecteix, i el seu negre mai serà tan profund com el d'un monitor.

Quan acabe, canvie a la calibració de visualització RGB per a comprovar com es veurà en xarxes socials i a la web. L'edició la faig per al paper, però la foto ha de defendre's en les dues cases.

## Triar paper i format

El paper és la meitat del resultat. Imprimisc sobre **Hahnemühle [Photo Pearl 310](https://www.hahnemuehle.com/es/papeles-de-impresion/hahnemuehle-photo/p/Product/show/37/649.html)**, i convé entendre què té eixe nom:

- **Paper RC.** Les sigles vénen de *resin coated*, "recobert de resina". La base del paper està plastificada i damunt du una capa microporosa pensada per a absorbir la tinta. La tinta es queda subjecta en eixa capa en lloc d'enfonsar-se en les fibres, i això es tradueix en colors intensos, negres més profunds, un full que s'asseca abans i que aguanta bé el maneig.
- **310 g.** És el gramatge, el gruix del full. Amb 310 grams per metre quadrat la còpia és ferma i no es dobla amb facilitat, i se sent com una foto de veritat i no com un foli imprés.
- **Acabat perlat.** Està a mig camí entre el mat i el brillant. Conserva la vivacitat dels colors i la profunditat de les ombres, però sense els reflexos molestos d'un brillant total. La superfície és llisa, sense textura, així que res competeix amb la imatge.
- **Blanc brillant i perfils ICC.** El fabricant publica el perfil de color d'aquest paper, i eixe perfil és el que em permet simular la còpia en pantalla abans d'imprimir.

El trie per equilibri. És un paper pensat per a l'ús diari, fiable i repetible, i això és just el que busque: que la còpia d'hui isca igual que la del mes passat.

![Còpies amb vora i amb la meua signatura, acabades d'eixir de la impressora {"align": "right", "square": true}](/blog/2026-10-18_tutorial-del-monitor-al-papel_copias.jpg)

El format el marca la foto, no al revés. Treballe en **A4, A3 i A2**, amb vora o sense, i amb la meua signatura si ho prefereixes. Un format ben triat deixa respirar la composició.

## Simular la còpia en pantalla

Abans de gastar tinta, faig una **prova de pantalla** (*soft proofing*). Active la calibració d'impressió del monitor i simule a Lightroom o Photoshop el perfil ICC d'aquest paper amb la meua impressora, amb l'opció de simular el color del paper i el negre de la tinta.

Aquesta vista prèvia mostra el que el paper no pot reproduir: colors fora de gamma que es retallen i negres que s'aclareixen. Retoque el just per compensar-ho i no més, perquè l'objectiu és acostar la còpia a l'edició, no reinventar-la.

## Imprimir amb el color sota control

Imprimisc amb una **Canon imagePROGRAF PRO-1000** i amb les **tintes originals de Canon**, la sèrie PFI-1000. No és un caprici. Tinc tres raons:

- **Són tintes pigmentades.** Una tinta de tint es dissol en el líquid i penetra en el paper. El pigment, en canvi, són partícules diminutes de color que es queden damunt de la superfície. Resisteixen molt millor la llum i la humitat i no es desdibuixen amb els anys, cosa que no vull deixar a l'atzar en una foto que algú penja a casa seua.
- **Són molts colors.** La PRO-1000 treballa amb onze tintes de color més un optimitzador de croma (*Chroma Optimizer*), dotze dipòsits en total. A més del cian, el magenta i el groc hi ha versions "foto" més clares de cian i magenta per als tons suaus, un roig i un blau que amplien els colors que pot aconseguir, i diversos negres i grisos. Els grisos, per exemple, donen degradats neutres sense que s'hi cole cap dominant de color. L'optimitzador de croma no és un color, sinó una capa transparent que ajuda que la brillantor siga uniforme sobre papers satinats.
- **Perfil i tinta van de la mà.** Un perfil de color es crea mesurant impressions fetes amb una combinació exacta d'impressora, paper i tinta. Amb una tinta compatible eixos números deixen d'encaixar i tota la calibració perd el sentit. Amb l'original sé que el que ix dels capçals és el que el perfil espera.

La regla d'or és que **només un programa gestiona el color**. Ho fa Photoshop amb el perfil del paper, i al controlador de la impressora desactive qualsevol correcció. Si tots dos toquen el color, es corregeix dues vegades i el resultat és impredictible.

Per a la intenció de renderitzat parte del colorimètric relatiu amb compensació del punt negre, i prove el perceptual si la prova de pantalla mostra retalls importants.

## Deixar reposar i valorar la còpia

La còpia acabada d'imprimir enganya. La tinta necessita unes hores per assentar-se i el color acaba de definir-se amb elles, així que **no la jutge en traure-la**.

La deixe reposar plana, sense tocar la superfície, i la valore sempre sota la mateixa llum neutra. Només llavors la compare amb la pantalla. Si alguna cosa no em convenç, torne a l'edició i ajuste, perquè eixe és el sentit que tot siga un únic flux de treball.

## Tallar i revisar

L'últim pas és físic. Amb la cisalla rotativa **Dahle 554** retalle el paper a mida i deixe els marges exactes. La seua fulla s'autoafila i la subjecció automàtica sosté el full mentre tale, així que el tall ix net, sense rebaves i d'un sol gest. Una vora mal tallada fa malbé una còpia perfecta.

Revise la superfície, les vores i el color una última vegada i només llavors la done per bona. És un procés lent, però és el que em permet mirar la còpia i reconéixer, per fi, la foto que vaig veure en editar-la.

Si vols tindre una de les meues fotos així, a la [botiga](/tienda/impresiones) tens les impressions amb aquest mateix paper i aquesta mateixa cura.
