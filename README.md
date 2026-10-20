# DSA Playground

A small, mobile-friendly project for learning common Data Structures and Algorithms through visual examples.

## Features
- Linear Search and Binary Search
- Bubble Sort and Selection Sort
- Step-by-step bar visualization
- Time and auxiliary space complexity notes
- Algorithm source code with a copy button
- Responsive layout for phones and desktops

## Run locally
No installation or build tools are required. Open `index.html` in a browser.

## Deploy with GitHub Pages
1. Open repository **Settings**.
2. Choose **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. After publishing, the site URL will be shown in the Pages section.

## Notes
- Binary Search requires sorted data. This visualizer sorts a copy automatically; indexes shown refer to that sorted copy.
- Bubble Sort and Selection Sort have worst-case time complexity `O(n²)` and auxiliary space complexity `O(1)`.
- Core Linear Search uses `O(1)` auxiliary space. Binary Search's sorting preparation is separate from the search operation.
