# Obsidian Plugin to Create Inline Images

This is a plugin for Obsidian that adds commands to create an SVG at the cursor location, which is immediately opened for editing.

![](/assets/create_diagram_here_demo.gif)

>[!warning] This is currently a proof-of-concept plugin mostly for personal use - use at your own risk!

# Features

- create an SVG at the cursor location with a right click, command, or assigned keyboard shortcut
- open the SVG for editing (in default editor if none specified, otherwise in the editor indicated in the preferences)
- specify a custom SVG template, which is used when creating an SVG - allows for custom CSS to support light/dark mode, saving of Inkscape preferences, height, width, viewport, etc.

# Installation

Copy the folder to the `.obsidian/plugins` folder within your vault (note that this folder is hidden by default). Run `npm i`, then `npm run build` in the folder.

# ToDo

- [ ] Add support for operating systems besides MacOS (currently uses the `open` command to open the SVG editor)
- [ ] Set up plugin builds via github tasks
- [ ] Add to Obsidian plugin repository