import { exec } from 'child_process';
import { App, FileSystemAdapter, Plugin, PluginSettingTab, Setting, moment } from 'obsidian';

const defaultNewSVGText = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="500"
   height="250"
   viewBox="0 0 500 250"
   version="1.1"
   id="svg1"
   inkscape:version="1.3.2 (091e20e, 2023-11-25)"
   sodipodi:docname="drawing.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
   <style>
        @media (prefers-color-scheme: light) {
            svg {
                filter: invert(1);
            }
        }
    </style>
    <sodipodi:namedview
        id="namedview1"
        pagecolor="#505050"
        bordercolor="#eeeeee"
        borderopacity="1"
        inkscape:showpageshadow="0"
        inkscape:pageopacity="0"
        inkscape:pagecheckerboard="0"
        inkscape:deskcolor="#505050"
        inkscape:document-units="mm"
        inkscape:zoom="0.78751403"
        inkscape:cx="397.45324"
        inkscape:cy="553.64093"
        inkscape:window-width="1392"
        inkscape:window-height="1027"
        inkscape:window-x="0"
        inkscape:window-y="25"
        inkscape:window-maximized="0"
        inkscape:current-layer="layer1" />
    <defs
        id="defs1" />
    <g
        inkscape:label="Layer 1"
        inkscape:groupmode="layer"
        id="layer1" />
</svg>`

interface CreateImageHerePluginSettings {
    pathToImageEditor: string;
    newSVGTemplate: string;
}

const DEFAULT_SETTINGS: CreateImageHerePluginSettings = {
    pathToImageEditor: '',
    newSVGTemplate: defaultNewSVGText
}

export default class CreateImageHerePlugin extends Plugin {
    settings: CreateImageHerePluginSettings;

    editImage(imagePath: string) {
        if (this.app.vault.adapter instanceof FileSystemAdapter) {
            const imageFullPath = this.app.vault.adapter.getFullPath(imagePath);
            exec(`open "${imageFullPath}"`, (error, stdout, sterr) => {
				if (error) {
					console.error(`Error opening SVG: ${error}`);
					return;
				}
			});
        }
    }

    async createAndOpenImage() {
        if (this.app.workspace.activeEditor?.editor != null) {
            const pathForSVG = await this.app.fileManager.getAvailablePathForAttachment(
                `New image ${moment().format('YYYYMMDDHHmmss')}.svg`
            );

            await this.app.vault.create(pathForSVG, this.settings.newSVGTemplate);
            this.app.workspace.activeEditor?.editor?.replaceSelection(`![[${pathForSVG}]]`);

            this.editImage(pathForSVG);
        }
    }

    async onload() {
        await this.loadSettings();

        // Adds a command to create a new image at the cursor and open it for editing
        this.addCommand({
            id: 'create-diagram-here',
            name: 'Create image here',
            callback: async () => {
                this.createAndOpenImage();
            }
        });

        this.registerEvent(
            this.app.workspace.on("editor-menu", (menu, editor, view) => {
                menu.addItem((item) => {
                    item
                        .setTitle("Create diagram here 📈")
                        .setIcon("image")
                        .onClick(async () => {
                            this.createAndOpenImage();
                        });
                });
            })
        );

        this.registerEvent(
            this.app.workspace.on("file-menu", (menu, file) => {
                menu.addItem((item) => {
                    item
                        .setTitle("Open diagram for editing 📝")
                        .setIcon("document")
                        .setDisabled(!file.path.endsWith(".svg"))
                        .onClick(async () => {
                            this.editImage(file.path);
                        });
                });
            })
        );

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new CreateImageHereSettingTab(this.app, this));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class CreateImageHereSettingTab extends PluginSettingTab {
    plugin: CreateImageHerePlugin;

    constructor(app: App, plugin: CreateImageHerePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Path to Image Editor')
            .setDesc('Absolute path to desired image editor on your computer. If left empty, the default image editor for SVGs will be used.')
            .setClass('block-setting-item')
            .addText(text => text
                .setValue(this.plugin.settings.pathToImageEditor)
                .onChange(async (value) => {
                    this.plugin.settings.pathToImageEditor = value;
                    await this.plugin.saveSettings();
                })
                .inputEl.setCssProps({
                    "width": "100%",
                    "margin-top": "1em"
                })
            );

        new Setting(containerEl)
            .setName('SVG Template')
            .setDesc('Template to use when creating a new diagram.')
            .setClass('block-setting-item')
            .addTextArea(textArea => textArea
                .setValue(this.plugin.settings.newSVGTemplate)
                .onChange(async (value) => {
                    this.plugin.settings.newSVGTemplate = value;
                    await this.plugin.saveSettings();
                })
                .inputEl.setCssProps({
                    "width": "100%",
                    "height": "350px",
                    "margin-top": "1em"
                })
            );
    }
}
