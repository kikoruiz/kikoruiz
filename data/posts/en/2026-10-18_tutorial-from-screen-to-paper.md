---
title: 'Tutorial: From screen to paper'
excerpt: 'My step by step process for printing a photo, from calibrating the monitor to cutting the paper, making sure the colour arrives intact.'
author: 'kiko-ruiz'
tags: 'photography, tutorial'
---

A photo is not finished until you hold it in your hands. And for what you hold to look like what you saw on screen, **editing and printing have to be one and the same job**, not two crafts passing a baton.

That is why my way of printing is as hand-made and careful as I know how to make it. I am not after speed; I want the colour I decided on while editing to be the colour that ends up on the paper. Everything else (the paper, the size, the cut) serves that, and it all starts at a place many people skip: **calibration**.

Here is my process, step by step, exactly as I do it. The papers and sizes I mention are the same ones I offer in the [prints store](/tienda/impresiones).

![My Canon imagePROGRAF PRO-1000 in the middle of a print {"priority": true, "align": "right", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_impresora.jpg)

## Preparing the monitor and the room

I work on a **BenQ PhotoVue SW271C**, a 27" 4K display covering 99% of Adobe RGB, 100% of sRGB and 90% of DCI-P3, with a 16-bit 3D LUT. What matters about that LUT is that it allows **hardware calibration**: the corrections are written to the monitor itself, not to the graphics card, which makes them more stable over time.

Before measuring anything, I set the stage:

- I clean the screen, because a fingerprint right where the probe sits can ruin the reading.
- I reset any manual settings on the monitor from its own menu.
- On the Mac mini I turn off the screensaver, Night Shift and energy saving.
- I leave the monitor on for **at least half an hour** so its components settle thermally.
- I connect the monitor to the Mac with the video cable and also with the USB cable from the box; without it, hardware calibration does not work.

## Calibrating and profiling the monitor

To measure I use an **X-Rite i1Display Pro** probe and **BenQ Palette Master Element** software. My guide is the excellent tutorial by [Francesco Gola](https://www.francescogola.net/tutorial/monitor-calibration-and-profiling-with-benq-palette-master-element/), which my settings are based on.

I keep **two calibrations**, because editing and printing ask for different things:

- **Editing:** D65 white point, 120 cd/m² luminance and the panel's native primaries.
- **Printing:** the same D65, but with luminance lowered towards 80 cd/m². A screen that is too bright makes the print look dark by comparison.

In both I leave gamma at 2.2, choose a version 2 profile for compatibility, of the 16-bit LUT type and with the highest number of patches available. When it finishes, I validate the calibration and do not move on until I see a successful result.

## Editing with colour as the reference

I review and develop in **Lightroom** and finish the fine retouching in **Photoshop**, always with the editing calibration on. There is no trick here: if the screen lies, everything I decide afterwards rests on a lie.

I edit with the paper already in mind. I treat contrast and shadows with more care than for a photo that will only be seen on screen, because paper does not emit light: it reflects it, and its black will never be as deep as a monitor's.

## Choosing paper and size

Paper is half of the result. I print on **Hahnemühle [Photo Pearl 310](https://www.hahnemuehle.com/en/digital-fineart/hahnemuehle-photo/p/Product/show/37/649.html)**, a 310 gsm paper with a pearl finish that respects colours and gives the shadows depth without the reflections of a full gloss.

The photo sets the size, not the other way round. I work in **A4, A3 and A2**, with or without a border, and signed if you wish. A well-chosen size lets the composition breathe.

## Previewing the print on screen

Before spending any ink, I do a **soft proof**. I switch the monitor to the printing calibration and, in Lightroom or Photoshop, simulate the ICC profile of this paper with my printer, with the option to simulate paper colour and black ink turned on.

That preview shows what the paper cannot reproduce: out-of-gamut colours that get clipped and blacks that lift. I adjust just enough to compensate and no more, because the goal is to bring the print closer to the edit, not to reinvent it.

## Printing with the colour under control

I print with a **Canon imagePROGRAF PRO-1000** and its **original Canon pigment inks**. I do not use compatible inks: the whole calibration loses its meaning if what comes out of the print heads changes.

The golden rule is that **only one program manages colour**. Photoshop does it, with the paper profile, and in the printer driver I turn off any correction. If both touch the colour, it is corrected twice and the result is unpredictable.

For the rendering intent I start with relative colorimetric with black point compensation, and try perceptual if the soft proof shows significant clipping.

## Letting it rest and judging the print

A freshly printed sheet is deceiving. The ink needs a few hours to settle and the colour finishes defining itself during that time, so **I never judge it straight out of the printer**.

I let it rest flat, without touching the surface, and always judge it under the same neutral light. Only then do I compare it with the screen. If something does not convince me, I go back to the edit and adjust, because that is the point of everything being a single workflow.

## Cutting and checking

The last step is a physical one. With the **Dahle Bis A2** cutter I trim the paper to size and leave exact margins, with a clean cut in a single motion. A badly cut edge ruins a perfect print.

I check the surface, the edges and the colour one last time, and only then do I call it good. It is a slow process, but it is the one that lets me look at the print and finally recognise the photo I saw while editing it.

If you would like one of my photos this way, the [store](/tienda/impresiones) has prints on this same paper and with this same care.
