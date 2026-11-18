# Validação da versão 0.2

Registro atualizado em 18/11/2026. A implementação segue o [update do plano](UPDATE_PLANO_DA_PRA_IR.md).

## Ambiente

- macOS, Node 24.20.0 e Expo SDK 57.0.33.
- Simulador iPhone 17e, iOS 26.4, Expo Go 57.0.9.
- SQLite nativo via `expo-sqlite`; testes de dados com SQLite real do Node 24.
- Oito locais fictícios, imagens ilustrativas locais e colaboração restrita ao aparelho.

## Checks executados

| Verificação | Resultado |
| --- | --- |
| `npm run test` | 8 testes aprovados; nenhum ignorado |
| `npm run typecheck` | Aprovado, sem erros |
| `npm run lint` | Aprovado, sem erros ou avisos |
| `npx expo-doctor` | 21 de 21 verificações aprovadas |
| `npx expo export --platform all --output-dir <diretório-temporário>` | Bundles iOS, Android e Web exportados com sucesso |
| `git diff --check` | Sem erros de espaços em branco |
| Cópias dos planos | Documentos de `docs/` preservam o conteúdo dos planos originais |

A instalação com `npm ci`, os testes, o TypeScript, o lint e o Expo Doctor também foram verificados em um clone novo de `develop`. A exportação verifica o empacotamento do código e dos recursos.

O runner do Node emite um aviso sobre detecção de módulos TypeScript. Os testes terminam com código zero; o projeto mantém seus arquivos de configuração CommonJS.

## Regras e persistência cobertas pelos testes

Os arquivos [journey.test.mts](../tests/journey.test.mts) e [full-journey.test.mts](../tests/full-journey.test.mts) usam o mesmo repositório de dados consumido pelo aplicativo.

1. **Compatibilidade:** três resultados, precedência das barreiras, ausência de preferências, informações ausentes, confirmação futura, limite exato de validade e guia desatualizado. Busca ignora acentos.
2. **Avisos:** expiração mantém a pendência e o histórico; confirmar renova por 24 horas; resolver exige uma ação distinta; um aviso resolvido não é reativado.
3. **Reabertura:** preferências, preparativos, etapa da visita e posição de leitura permanecem após fechar e reabrir um arquivo SQLite. A carga inicial não é repetida.
4. **Checklist:** inclusão concorrente, edição, conclusão e remoção não alteram evidências públicas.
5. **Leitura e retorno:** percorrer o guia não conclui a visita; relato positivo geral não confirma acessibilidade; o retorno vinculado à visita é atualizado sem duplicação; uma visita concluída não volta a ficar em andamento.
6. **Recuperação:** falha induzida durante a carga inicial reverte a transação e permite tentar novamente.
7. **Agenda:** formato, datas inexistentes, horário sem data e preservação do instante informado no fuso de São Paulo.
8. **Jornada de dados:** preferências → visita com horário → aviso que muda a avaliação → confirmação → resolução → guia → etapa manual → conclusão → relato → nova inicialização. Histórico e integridade do banco preservados.

Esses testes verificam comandos e regras; não substituem a interação com todos os controles na interface nativa.

## Verificação nativa realizada

O app abriu no Expo Go do simulador iOS. Foram inspecionados Explorar, as abas, a lista com fotos e a edição de preferências. A seleção de entrada sem degraus e menos ruído foi salva; a tela mostrou as escolhas e a confirmação de salvamento.

Uma consulta somente de leitura no banco do simulador confirmou:

| Dado | Resultado |
| --- | --- |
| `PRAGMA integrity_check` | `ok` |
| Versão do esquema | 1 |
| Locais / características | 8 / 32 |
| Relatos / avisos / eventos iniciais | 16 / 3 / 3 |
| Preferências salvas pela interface | `stepFree`, `quiet` |
| Marcador de primeira carga | Presente |

Com a interface ilustrada, foi possível abrir Explorar e Preferências, consultar a ficha da Clínica Jardim, navegar pelas cenas de **Ver junto**, salvar uma visita fictícia, registrar a etapa **Esperar**, finalizar a visita e salvar um retorno. Após fechar e abrir o Expo Go, foi possível consultar novamente a visita concluída e seu relato. As capturas estão na [galeria do README](../README.md#telas-do-app). A [demonstração narrada](ROTEIRO_VIDEO.md) registra a jornada no Expo Go.

## Design e acessibilidade

Implementados: áreas interativas com mínimo de 48, rótulos persistentes, estados selecionados anunciados, botões de navegação por passo, cabeçalho fora da rolagem, áreas seguras, formulário com proteção contra envio duplicado e mensagens de erro que preservam o preenchimento. A interface não depende de animações ou gestos laterais para avançar.

Na configuração de texto máxima do iOS, foram conferidos os cabeçalhos, os rótulos das abas, os filtros e o campo de busca. A edição de preferências abriu e exibiu o retorno de salvamento. Os textos de conteúdo e os campos aumentam até 2×, com limites próprios de 1,6× para os títulos do cabeçalho e 1,4× para os rótulos da barra de abas. O limite de texto inclui a altura da linha nos componentes de texto do app.

Contraste calculado a partir dos tokens, por luminância relativa sRGB:

| Par | Razão |
| --- | --- |
| Branco sobre verde principal | 6,29:1 |
| Texto principal, menor razão entre as superfícies usadas | 10,02:1 |
| Texto secundário, menor razão entre as superfícies usadas | 4,89:1 |
| Verde principal, menor razão entre as superfícies usadas | 4,83:1 |
| Texto de erro, menor razão entre as superfícies usadas | 5,60:1 |
| Contorno de campo sobre branco | 3,67:1 |

O cálculo dos tokens não comprova acessibilidade da experiência completa. Não foi realizada avaliação de usabilidade com famílias.

## Validação adicional em dispositivos

- Percorrer a jornada inteira pela interface em celular físico, incluindo fechamento e reabertura.
- Conferir também no Android o seletor de data/horário, teclado, botão de voltar e retomada.
- Conferir rodapés e diálogos em telas menores com fonte ampliada.
- Conferir VoiceOver/TalkBack: ordem de leitura, foco após navegação, seleções e anúncio de erros.

## Dependências

`npm audit` registrou seis pacotes afetados: três de severidade moderada e três alta, propagados pelas cadeias `expo → @expo/fingerprint → minimatch` e `expo-router → query-string → decode-uri-component`. Os avisos descrevem negação de serviço e incluem [minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249) e [decode-uri-component](https://github.com/advisories/GHSA-qr28-fpjm-wq7f).

As correções automáticas propostas pela auditoria alteram versões principais de Expo/Router fora da combinação SDK 57 validada. Não foi aplicado `npm audit fix --force`. A equipe deve acompanhar as correções compatíveis e repetir os checks antes de uma publicação de produção.
