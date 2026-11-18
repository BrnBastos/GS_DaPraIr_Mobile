# Etapa 1 — estrutura e navegação

Data da verificação: **17/11/2026**.

## O que foi entregue

Projeto `da-pra-ir`, criado a partir de `default@sdk-57`, com as três abas
solicitadas e rotas fora das abas para detalhes e formulários. O bairro de
referência escolhido foi Vila Mariana, São Paulo.

As telas são estruturas de navegação. O identificador `previa` não representa
um local ou visita cadastrado. Formulários, dados, persistência e regras de
compatibilidade serão implementados nas próximas etapas do plano.

A base visual utiliza Inter Regular, Medium e SemiBold, importadas por peso para
evitar incluir a família inteira. Há alternativa para a fonte do sistema em caso
de falha. A interface usa áreas seguras, rolagem, controles de pelo menos 48 pontos
e texto sem limite de ampliação imposto pelo aplicativo. As abas não têm altura
fixa e podem crescer com a fonte. Não há animações de transição.

## Verificações técnicas

| Verificação                          | Resultado                          |
| ------------------------------------ | ---------------------------------- |
| `npm run typecheck` (`tsc --noEmit`) | Aprovado                           |
| `npm run lint`                       | Aprovado                           |
| `npx expo-doctor`                    | 21/21 checks aprovados             |
| `npx expo export --platform all`     | Bundles iOS, Android e web gerados |
| `git diff --check`                   | Sem erros de espaços em branco     |

## Navegação conferida em execução

Ambiente nativo: **iPhone 17e, iOS 26.4, Expo Go 57.0.9**, no simulador do Xcode.
O app foi iniciado com `npx expo start --ios --port 8081` e abriu a aba Explorar.

Foram acionados os controles das telas e conferidos os destinos pela árvore de
acessibilidade do simulador e por capturas de tela:

- Explorar → Minhas visitas → Preferências.
- Minhas visitas → Nova visita sem local → Voltar para Minhas visitas.
- Preferências → estrutura de edição → Voltar para Preferências.
- Explorar → ficha de demonstração.
- Ficha → Nova visita com `localId=previa` → estrutura do plano → ficha.
- Ficha → Novo relato → retorno à ficha.
- Ficha → Novo aviso.

A revisão nativa identificou uma incompatibilidade entre `Link asChild` e
funções de estilo de `Pressable`: o Slot descartava o estilo do controle.
A superfície compartilhada de interação foi ajustada para receber um objeto
de estilo e aplicar o estado pressionado internamente. Os controles foram
revisados novamente após a correção.

Ambiente web complementar: **Safari, prévia local do Metro**. Foram conferidos:

- Abertura direta de `/locais/previa` e rolagem da ficha.
- Local inexistente → “Local não encontrado”.
- Visita inexistente → “Visita não encontrada”.
- Relato sem local → “Escolha um local primeiro”.
- Aviso com `localId` repetido → “Escolha um local primeiro”.
- Caminho inexistente → tela de recuperação → Explorar.

## Capturas reais

Capturas da janela do simulador, incluindo a moldura do aparelho. O botão azul
flutuante pertence às ferramentas do Expo Go.

| Tela            | Captura                                                  |
| --------------- | -------------------------------------------------------- |
| Explorar        | [explorar-ios.png](screenshots/explorar-ios.png)         |
| Preferências    | [preferencias-ios.png](screenshots/preferencias-ios.png) |
| Ficha do local  | [ficha-local-ios.png](screenshots/ficha-local-ios.png)   |
| Plano de visita | [plano-visita-ios.png](screenshots/plano-visita-ios.png) |

## Limites desta verificação

- O app abriu em simulador iOS. Não foi possível verificar o celular físico do
  usuário nem executar Android em emulador neste ambiente. A exportação Android
  confirma o bundle, sem substituir um teste de execução no aparelho.
- Os gestos de rolagem no iOS não foram confirmados pela automação disponível;
  a rolagem foi conferida na prévia web. Os destinos nativos foram acionados por
  seus elementos de acessibilidade, inclusive os que estavam fora da área visível.
- A inspeção da árvore de acessibilidade não equivale a testar com VoiceOver ou
  TalkBack. A revisão completa em tela pequena e com fonte grande continua
  prevista nas etapas 4 e 5.
- Não há persistência para testar nesta etapa. Não foi simulada confirmação de
  salvamento nem recomendação de acessibilidade.
- A auditoria npm do template SDK 57 apresentou seis alertas transitivos, três
  moderados e três altos, nas cadeias `@expo/fingerprint`/`minimatch` e
  `expo-router`/`query-string`/`decode-uri-component`. As correções sugeridas pelo
  npm mudam versões principais do Expo ou Router. A compatibilidade com Expo Go
  foi preservada, sem executar `npm audit fix --force`. Reavaliar essas cadeias
  antes de uma entrega de produção.

## Próxima etapa

Implementar serviços mock assíncronos, oito locais fictícios com imagens locais,
migrações SQLite, carga única e validade das informações, conforme o
[plano](PLANO_DA_PRA_IR.md). `src/services` e `src/db` já estão reservados e
documentados, sem abstrações ou banco provisório que precisem ser descartados.
