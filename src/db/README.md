# Persistência SQLite

`schema.ts` contém migrações sequenciais por `PRAGMA user_version`. `repository.ts` executa consultas assíncronas com parâmetros e serializa leituras e gravações. Escritas usam transações; uma carga inicial incompleta é revertida e pode ser tentada novamente.

O marcador `firstRunAt` e a carga mock são gravados na mesma transação. Abrir novamente o aplicativo não reaplica a carga nem sobrescreve preferências ou contribuições. Os registros usam identificadores e relações com chaves estrangeiras; conteúdo de cada registro é serializado em JSON, com validação `json_valid` no banco. Há índices para local, visita e eventos de aviso.

Tabelas: `meta`, `places`, `evidence`, `preferences`, `visits`, `checklist_items`, `reports`, `notices`, `notice_events` e `guide_positions`.

A posição no guia é independente da etapa física registrada na visita. Preferências são copiadas ao criar um roteiro e atualizadas somente por ação explícita. Itens pessoais removidos recebem `deleted_at`. Avisos e seus eventos permanecem no histórico após expirar ou serem resolvidos.

A interface consome a camada de serviços. O acesso nativo é aberto por `services/application.ts`; os testes exercitam o mesmo repositório com SQLite real do Node 24, inclusive fechamento e reabertura de arquivo.
