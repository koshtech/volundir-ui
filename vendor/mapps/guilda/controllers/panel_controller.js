export class PanelController {
  constructor() {
    this.container = null;
    this.logs = [];
  }

  init() {
    this.container = document.getElementById("volundir-guilda-panel");
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
    this.logs.push(entry);
    if (!this.logContainer) return;

    const div = document.createElement("div");
    div.classList.add("vgp-log-entry");
    div.innerHTML = `
      <span class="vgp-log-file">[<span class="vgp-log-level">${entry.level}</span>] ${entry.file}:${entry.line}:${entry.column} <span class="vgp-log-class">${entry.class}.${entry.method}()</span></span>
      <span class="vgp-log-message">${entry.message}</span>

    `;
    this.logContainer.appendChild(div);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }
}

export const GuildaPanel = new PanelController();

GuildaPanel.init();

// Global instance (singleton)
window.GuildaPanel = GuildaPanel;
// globalThis.Guilda = new GuildaModule();
