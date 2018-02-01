# Pixel Canvas
This is a simple test project to try creating an in browser pixel-by-pixel image editing/creating application.  This utilizes Angular as the primary tool to interact with the browser.

The application can be run using the {code}npm run start{code} to run the application locally on port 4200.  Currently the application cannot be exported and integrated into other Angular applications because that effort seemed to mess some things in the code up and led to the removal of WebAssembly from the baseline.  Ideally, this will be resolved in the future so that the package is usable in other applications.

## Features
A quick list of features currently existing in the code

* Colorable image - Color for each "pixel" can be selected and colored individually on the canvas
* Zoomable image - The image can be zoomed in up to 4x.  It defaults to 1x zoom and zooms in at incremenets of .1
* Pannable image - The canvas may be panned while zoomed in.
* Image preview - Image preview on the bottom left of the component displays a preview of what the image will look like, along with an outline of the current visible view in the main screen
* Save - The image can be saved to a file at any time.  As is currently written, this will save an image with each "pixel" from the canvas being 10x10.  This may change in the future.
* Undo/Redo - Actions not involving display (zoom/pan) may be done or undone.  This is limited to the last 20 actions.
* Keyboard shortcuts - The component recognizes a few keyboard shortcuts for now (Ctrl+z & Ctrl+Shift+z for undo and redo, respectively)
