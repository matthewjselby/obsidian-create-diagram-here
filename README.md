# Obsidian Plugin to Create Inline Diagrams

This is a plugin for Obsidian that adds commands to create an SVG at the cursor location, which is immediately opened for editing. I use this to quickly add diagrams to my notes.

![](/assets/create_diagram_here_demo.gif)

> [!WARNING]
> This is currently a proof-of-concept plugin that I developed mostly for personal use - use at your own risk!

# Features

- create an SVG at the cursor location with a right click, command, or assigned keyboard shortcut
- open the SVG for editing (in default editor if none specified, otherwise in the editor indicated in the preferences)
- specify a custom SVG template, which is used when creating an SVG - allows for custom CSS to support light/dark mode, saving of Inkscape preferences, height, width, viewport, etc.

# Installation

For manual installation, create a folder in `{your_vault_folder}/.obsidian/plugins`, add the `main.js` and `manifest.json` files from a release to the folder, and enable the plugin in Obsidian preferences.

Once this plugin is sufficiently developed, I will submit to the [official list](https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json).

# ToDo

- [ ] Add support for operating systems besides MacOS (currently uses the `open` command to open the SVG editor)
- [ ] Set up plugin builds via github tasks
- [ ] Add to Obsidian plugin repository