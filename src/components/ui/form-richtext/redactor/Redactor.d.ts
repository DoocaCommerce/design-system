export type AutosaveCallbackRedactor = (name: string, data: object, response: any) => void;

export type ImageUploadCallbackRedactor = (formData: unknown, files: unknown[], event: Event) => string | object;

export interface ConfigCallbacksRedactor {
  /** Se você deseja salvar o texto automaticamente a cada alteração, basta definir o caminho para um script que manipulará os dados recebidos. */
  autosave: AutosaveCallbackRedactor;
  /** Callback executada ao ocorrer o evento focus no campo de texto */
  focus: () => void;
  /** Callback executada ao ocorrer o evento blur no campo de texto */
  blur: () => void;
  /** Callback executada ao ocorrer o evento keyup, em que algum valor é digitado no campo de texto */
  changed: (html: string) => string;
  /** Permite outras callbacks "com nomes a descobrir" */
  [key: string]: (...args: any[]) => void;
}

export type ConfigRedactor = {
  /** Permite a configuração de múltiplas callbacks executadas em resposta as ações configuradas */
  callbacks: ConfigCallbacksRedactor;
  /** Define se vai mostrar o código primeiro em vez da camada visual */
  showSource: boolean;
  /**
   * Define o caminho para o arquivo script responsável pelo upload ou a função que
   * manipulará os arquivos
   * {@link https://imperavi.com/legacy/redactor-classic/docs/how-to/upload-images/ Documentação Redactor}.
   */
  imageUpload: string | ImageUploadCallbackRedactor;
  /** Lista de plugins a serem utilizados pelo editor */
  plugins: string[];
  /** Tags de linha permitidas no editor */
  inlineTags: string[];
  /** Tags de bloco permitidas no editor */
  blockTags: string[];
  /** Define se deve inserir uma quebra de linha ao pressionar Enter */
  breakline: boolean;
  /** Esta configuração remove a tag script e o padrão é `true` */
  removeScript: boolean;
  /**
   * Configura a substituição de tags. E por padrão, o seguinte é definido para
   * acontecer: as tags 'b', 'i' e 'strike' são substituídas pelas tags 'strong', 'em' e
   * 'del'.
   */
  replaceTags: boolean | Record<string, string>;
  /** Define se o código fonte deve ser exibido, ou configura o modo do mesmo. */
  source:
    | boolean
    | {
        codemirror?: boolean;
        codemirrorSrc?: string;
        lineNumbers?: boolean;
      };
  /** Lista de formatações permitidas no editor */
  formatting: string[] | boolean;
  /** Lista de botões a serem exibidos na barra de ferramentas */
  buttons: string[];
  /** HTML a ser exibido quando o editor estiver vazio */
  emptyHtml: string;
  /** Define o tamanho da tabulação em espaços */
  tabAsSpaces: number;
  markup: string;
  /** Define a linguagem do editor */
  lang: string;
  /** Esta configuração desativa a conversão padrão de URLs de vídeo (youtube/vimeo) e imagem em vídeos e imagens incorporados, e desativa a conversão automática de URLs de texto em links clicáveis. */
  autoparse: boolean;
  /** Permite outras configurações não identificadas/documentadas */
  [key: string]: any;
};

export interface RedactorPluginConfig {
  /** Permite definir linguagens para os textos do plugin */
  translations?: Record<string, string | object>;
  /** Configura a inicialização do plugin */
  init: (app: unknown) => void;
  /** Configura a execução do plugin */
  start: (app: unknown) => void;
  /** Permite outras configs não identificadas/documentadas */
  [key: string]: any;
}

export type RedactorLibraryType = {
  editor: {
    /** Define o foco no editor. */
    focus(): void;
    /** Verifica se o conteúdo do editor está vazio. */
    isEmpty(): boolean;
    source: {
      /** Define o código HTML a ser exibido no editor */
      setCode(val: string): void;
    };
  };
  /** Inicie o aplicativo manualmente. */
  start(): void;
  /** Pare o aplicativo manualmente. */
  stop(): void;
  /** Verifique se o aplicativo foi iniciado. */
  isStarted(): boolean;
  /** Verifique se o aplicativo foi parado. */
  isStopped(): boolean;
  /** Adiciona um plugin ao aplicativo. */
  add(type: 'plugin', pluginName: string, plugin: RedactorPluginConfig): void;
  /**
   * Permite a configuração de plugins personalizados
   */
  plugin: {
    [pluginName: string]: unknown;
  };
  /** Permite outros métodos não identificados/documentados */
  [key: string]: any;
} | null;
