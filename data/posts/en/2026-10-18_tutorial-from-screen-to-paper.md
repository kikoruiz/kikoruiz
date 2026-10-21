---
title: 'Tutorial: From screen to paper'
excerpt: 'My step by step process for printing a photo, from calibrating the monitor to cutting the paper, making sure the colour arrives intact.'
author: 'kiko-ruiz'
tags: 'photography, tutorial'
---

A photo is not finished until you hold it in your hands. And for what you hold to look like what you saw on screen, **editing and printing have to be one and the same job**, not two crafts passing a baton.

That is why my way of printing is as hand-made and careful as I know how to make it. I am not after speed. I want the colour I decided on while editing to be the colour that ends up on the paper. Everything else (the paper, the size, the cut) serves that, and it all starts at a place many people skip: **calibration**.

Here is my process, step by step, exactly as I do it. The papers and sizes I mention are the same ones I offer in the [prints store](/tienda/impresiones). And since this is full of acronyms that put people off, I explain each one in plain words as it comes up.

![My Canon imagePROGRAF PRO-1000 in the middle of a print {"priority": true, "align": "right", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_impresora.jpg)

## Preparing the monitor and the room

I work on a **BenQ PhotoVue SW271C**, a 27" display with 4K resolution made for photography. According to its datasheet it covers 99% of Adobe RGB, 100% of sRGB and 90% of DCI-P3, and it has a 16-bit 3D LUT. Put like that it sounds like gibberish, so here is the translation:

- **Colour spaces (sRGB, Adobe RGB, DCI-P3).** A colour space is the set of colours a device is able to show or print. Think of boxes of pencils: some have more shades than others. sRGB is the standard box of the internet, the one almost every screen and browser takes for granted. Adobe RGB is a bigger box, especially in greens and turquoise blues, and it matters to me because a printer reaches shades that sRGB does not have. DCI-P3 is the one from digital cinema, and many modern phone and laptop screens use it too. My monitor covering 99% of Adobe RGB means it can show me almost all of those colours, so I edit while seeing the whole photo.
- **16-bit 3D LUT.** LUT stands for look-up table. It is a table the monitor carries inside and that works like a translator: every time it receives a colour from the computer, it looks in the table for the exact signal it has to send to the panel for the colour to look right. It is "3D" because it corrects red, green and blue at the same time, so it can fix one shade without spoiling another. And "16-bit" counts how many steps each colour has (65,536), which gives smooth gradients without the banding you sometimes see in a sky.
- **Hardware calibration.** With that internal table, the corrections from the calibration are written to the monitor itself and not to the computer's graphics card. That makes them more stable over time and independent of which computer or program is in front of it.

Before measuring anything, I set the stage:

- I clean the screen, because a fingerprint right where the monitor calibrator sits can ruin the reading.
- I reset any manual settings on the monitor from its own menu.
- On the Mac mini I turn off the screensaver, *Night Shift* and energy saving.
- I leave the monitor on for **at least half an hour** so its components settle thermally.
- I connect the monitor to the Mac with an HDMI cable and also with the USB cable from the box. Without that USB cable, hardware calibration does not work.

## Calibrating and profiling the monitor

To measure I use an **X-Rite i1Display Pro** monitor calibrator, a device that hangs in front of the screen and measures the light and colour it gives off, and **BenQ Palette Master Element** software. My guide is the excellent tutorial by [Francesco Gola](https://www.francescogola.net/tutorial/monitor-calibration-and-profiling-with-benq-palette-master-element/), which my settings are based on.

![My BenQ PhotoVue SW271C, with one of my photos on screen {"align": "left", "orientation": "vertical"}](/blog/2026-10-18_tutorial-del-monitor-al-papel_monitor.jpg)

I keep **three calibrations**, because editing, printing and showing my photos each ask for different things:

- **Editing:** D65 white point, 120 cd/m² luminance and the panel's native primaries.
- **Printing:** the same D65, but with luminance lowered towards 80 cd/m². A screen that is too bright makes the print look dark by comparison.
- **RGB viewing:** made to see my photos the way almost everyone else will, on social media or on a website, that is, on an ordinary screen. It is my final check that the photo holds up outside my own monitor.

The settings, in plain words:

- **White point, D65.** A white is not always the same white. It can lean warm, like the light of a bulb, or cool, like an overcast sky. That lean is measured in kelvin. D65 is about 6500 K and stands for average daylight. It is the standard of the internet, photography and video, so it is the white almost everyone takes for granted.
- **Luminance, cd/m².** This is simply how bright the screen is. It is measured in candelas per square metre, and the unit comes from the light a candle gives. At 120 cd/m² I get a comfortable brightness for editing in a room with moderate light. For printing I go down to about 80 because paper does not emit light, it only reflects the light of the room. If I compare a print with a screen that is too bright, the print will always look dull and I would end up editing too light.
- **Native primaries.** The primaries are the purest red, green and blue the panel can show, and every other colour is built from them. "Native" means I use the panel at its full capacity, without cutting it down to a smaller box. The programs already take care of showing photos that are in sRGB or Adobe RGB correctly.
- **Gamma 2.2.** Gamma is the curve that shares brightness out between dark, middle and light tones. Our eyes notice changes in the shadows far more than in the highlights, and images are stored with that in mind. With 2.2, the standard value for screens, the midtones look neither washed out nor too heavy. If a screen uses another gamma, the photo changes its look even though you have not touched it.
- **ICC profile and patches.** The ICC profile is the file that describes how my monitor behaves, so Lightroom and Photoshop know what to correct. I choose version 2 because it is the most compatible with programs. The patches are the squares of colour the calibrator measures one by one, and the more it measures, the more precise the profile. That is why I use the highest number available. The "16-bit LUT" type is the one that makes use of the monitor's internal table.

When it finishes, I validate the calibration and do not move on until I see a successful result.

## Editing with colour as the reference

I review and develop in **Lightroom** and finish the fine retouching in **Photoshop**, always with the editing calibration on. There is no trick here: if the screen lies, everything I decide afterwards rests on a lie.

I edit with the paper already in mind. I treat contrast and shadows with more care than for a photo that will only be seen on screen, because paper does not emit light. It reflects it, and its black will never be as deep as a monitor's.

When I am done, I switch to the RGB viewing calibration to check how it will look on social media and on the web. I edit for paper, but the photo has to hold its own in both homes.

## Choosing paper and size

Paper is half of the result. I print on **Hahnemühle [Photo Pearl 310](https://www.hahnemuehle.com/en/digital-papers/hahnemuehle-photo/p/Product/show/37/649.html)**, and it helps to understand what that name carries:

- **RC paper.** The letters stand for resin coated. The base of the paper is plasticised and carries a microporous layer designed to take the ink. The ink stays held in that layer instead of sinking into the fibres, which translates into intense colours, deeper blacks, and a sheet that dries sooner and handles well.
- **310 gsm.** That is the weight, how thick the sheet is. At 310 grams per square metre the print is firm and does not bend easily, and it feels like a real photograph and not like a printed sheet of office paper.
- **Pearl finish.** It sits halfway between matt and gloss. It keeps the liveliness of the colours and the depth of the shadows, but without the annoying reflections of a full gloss. The surface is smooth, with no texture, so nothing competes with the image.
- **Bright white and ICC profiles.** The manufacturer publishes the colour profile of this paper, and that profile is what lets me preview the print on screen before printing.

I choose it for balance. It is a paper made for daily use, reliable and repeatable, and that is exactly what I am after: that today's print comes out just like last month's.

![Prints with a border and my signature, fresh out of the printer {"align": "right", "square": true}](/blog/2026-10-18_tutorial-del-monitor-al-papel_copias.jpg)

The photo sets the size, not the other way round. I work in **A4, A3 and A2**, with or without a border, and signed if you wish. A well-chosen size lets the composition breathe.

## Previewing the print on screen

Before spending any ink, I do a **soft proof**. I switch the monitor to the printing calibration and, in Lightroom or Photoshop, simulate the ICC profile of this paper with my printer, with the option to simulate paper colour and black ink turned on.

That preview shows what the paper cannot reproduce: out-of-gamut colours that get clipped and blacks that lift. I adjust just enough to compensate and no more, because the goal is to bring the print closer to the edit, not to reinvent it.

## Printing with the colour under control

I print with a **Canon imagePROGRAF PRO-1000** and the **original Canon inks**, the PFI-1000 series. It is not a whim. I have three reasons:

- **They are pigment inks.** A dye ink dissolves in the liquid and soaks into the paper. Pigment, on the other hand, is made of tiny particles of colour that stay on the surface. They resist light and humidity far better and do not fade over the years, something I do not want to leave to chance in a photo someone hangs at home.
- **There are many colours.** The PRO-1000 works with eleven colour inks plus a *Chroma Optimizer*, twelve tanks in total. Besides cyan, magenta and yellow there are lighter "photo" versions of cyan and magenta for soft tones, a red and a blue that widen the colours it can reach, and several blacks and greys. The greys, for example, give neutral gradients without any colour cast sneaking in. The *Chroma Optimizer* is not a colour but a clear coat that helps the gloss stay even on satin papers.
- **Profile and ink go hand in hand.** A colour profile is created by measuring prints made with an exact combination of printer, paper and ink. With a compatible ink those numbers stop fitting and the whole calibration loses its meaning. With the original I know that what comes out of the print heads is what the profile expects.

The golden rule is that **only one program manages colour**. Photoshop does it, with the paper profile, and in the printer driver I turn off any correction. If both touch the colour, it is corrected twice and the result is unpredictable.

For the rendering intent I start with relative colorimetric with black point compensation, and try perceptual if the soft proof shows significant clipping.

## Letting it rest and judging the print

A freshly printed sheet is deceiving. The ink needs a few hours to settle and the colour finishes defining itself during that time, so **I never judge it straight out of the printer**.

I let it rest flat, without touching the surface, and always judge it under the same neutral light. Only then do I compare it with the screen. If something does not convince me, I go back to the edit and adjust, because that is the point of everything being a single workflow.

## Cutting and checking

The last step is a physical one. With the **Dahle 554** rotary trimmer I trim the paper to size and leave exact margins. Its blade sharpens itself as it cuts and the automatic clamp holds the sheet in place, so the cut comes out clean and burr-free in a single motion. A badly cut edge ruins a perfect print.

I check the surface, the edges and the colour one last time, and only then do I call it good. It is a slow process, but it is the one that lets me look at the print and finally recognise the photo I saw while editing it.

If you would like one of my photos this way, the [store](/tienda/impresiones) has prints on this same paper and with this same care.
