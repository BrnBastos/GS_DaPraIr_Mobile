# Serviços de aplicação

- `mock.ts`: serviço assíncrono com oito locais fictícios, 32 informações de características, 16 relatos iniciais e três avisos. Datas são relativas à primeira execução bem-sucedida.
- `application.ts`: inicialização única de SQLite, migrações e carga inicial. Fecha a conexão em caso de falha e permite nova tentativa.
- `AppProvider.tsx`: disponibiliza o estado persistido às telas, executa comandos do repositório e recarrega o estado após gravações. Reavalia o tempo ao retornar ao app e no próximo vencimento conhecido. Impede envios duplicados no mesmo controle e apresenta confirmação após salvar.
- `place-images.ts`: referências locais às fotografias ilustrativas incluídas no bundle.

Regras de compatibilidade e validade ficam em `domain/compatibility.ts`. Não há API externa de locais, sincronização entre aparelhos, IA em execução ou publicação de contribuições.
