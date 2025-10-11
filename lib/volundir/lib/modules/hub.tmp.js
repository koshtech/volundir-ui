class HubFactory {
    constructor(nomeDoModulo) {
        this.nomeDoModulo = nomeDoModulo;
        this.instance = null;
    }

    // Método para carregar e instanciar o módulo
    async carregarEInstanciar() {
        // 1. Carrega o arquivo JS dinamicamente
        await this._carregarScript(`./modulos/${this.nomeDoModulo}Modulo.js`);

        // 2. Tenta obter a classe/função registrada (assumindo que o script carregado a registra)
        const ModuloClass = window.ModuleRegistry.get(this.nomeDoModulo);

        if (ModuloClass) {
            // 3. Instancia a classe e a armazena
            this.instance = new ModuloClass();

            // 4. (Opcional, mas útil) Copia métodos para a instância do Hub
            // Isso faz com que 'this' do Hub tenha acesso direto aos métodos do módulo.
            this._copiarMetodos(this.instance);

            console.log(`Módulo '${this.nomeDoModulo}' carregado e métodos integrados com sucesso.`);
            return this.instance;

        } else {
            throw new Error(`Módulo '${this.nomeDoModulo}' não encontrado no registro.`);
        }
    }

    // Método auxiliar para injetar a tag <script> e esperar o carregamento
    _carregarScript(caminho) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${caminho}"]`)) {
                // Já carregado, resolve imediatamente (pode precisar de lógica mais complexa para saber se o registro ocorreu)
                return resolve();
            }

            const script = document.createElement('script');
            script.src = caminho;
            script.type = 'text/javascript';
            script.onload = resolve; // Resolve a Promise quando o script terminar de carregar
            script.onerror = reject; // Rejeita em caso de erro no carregamento
            document.head.appendChild(script);
        });
    }

    // Método auxiliar para copiar os métodos da instância carregada para o 'this' do HubFactory
    _copiarMetodos(sourceInstance) {
        for (const prop in sourceInstance) {
            if (typeof sourceInstance[prop] === 'function' && prop !== 'constructor') {
                // Copia o método, garantindo que 'this' dentro do método aponte para a instância original.
                this[prop] = sourceInstance[prop].bind(sourceInstance);
            }
        }
    }
}
