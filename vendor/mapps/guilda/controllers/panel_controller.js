import { BaseController } from '/lib/volundir/base/base_controller.js';

export class PanelController extends BaseController {
  constructor() {
    super();

    this.container = null;
    this.logs = [];

    this.selectedInterfaceAdapter = null;
    this.selectedInterfaceCode    = null;

    this.defaultTemplatesPath  = `/vendor/mapps/guilda/views`;
    this.defaultStylePath      = `/vendor/mapps/guilda/assets/stylesheets`;
    this.selectedLayout        = 'mapplication';
    this.selectedLayoutPath    = `layouts/${this.selectedLayout}`;

    this.baseTemplatesPath  = null;
  }

  async init() {
    this.selectedInterfaceAdapter = this.modules.render.getSelectedInterfaceAdapter();
    this.selectedInterfaceCode    = this.modules.render.getSelectedInterfaceCode();

    this.baseTemplatesPath  = this.baseTemplatesPath || `${this.defaultTemplatesPath}/${this.selectedInterfaceCode}`;

    this.modules.render.loadStylesheet('style.css', this.defaultStylePath);

    this.container = await this.modules.render.find_or_create_element_from_template(
      'volundir-guilda-panel',
      this.selectedLayoutPath,
      this.baseTemplatesPath,
      { class: 'vgp' }
    );

    Log.debugger(' [init] this.container:', this.container);

    if (!this.container) return;

    const toggleBtn = this.container.querySelector(".vgp-button-toggle");
    const logContainer = this.container.querySelector(".vgp-logs");

    this.addLog("GuildaPanel loading...");

    toggleBtn.addEventListener("click", () => {
      this.container.classList.toggle("hidden");
      if (this.container.classList.contains("hidden")) {
        this.container.style.height = "24px";
      } else {
        this.container.style.height = "300px";
      }
    });

    this.logContainer = logContainer;
  }

  addLog(entry) {
    console.log(' ==> log controller called');
    this.logs.push(entry);
    if (!this.logContainer) return;

    const div = document.createElement("div");
    div.classList.add("vgp-log-entry");
    div.innerHTML = `
      [<span class="vgp-log-level-${entry.level}">${entry.level}</span>] <span class="vgp-log-file">${entry.file}:${entry.line}:${entry.column} <span class="vgp-log-class">${entry.class}.${entry.method}()</span></span>
      <span class="vgp-log-message">${entry.message}</span>

    `;
    this.logContainer.appendChild(div);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }
}

// export const GuildaPanel = new PanelController();

// GuildaPanel.init();

// Global instance (singleton)
// window.GuildaPanel = GuildaPanel;
// globalThis.Guilda = new GuildaModule();
