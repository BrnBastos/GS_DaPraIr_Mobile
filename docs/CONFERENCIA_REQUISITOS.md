# Conferência do enunciado CitizenTech

Conferência da versão 0.2.0, atualizada em 18/11/2026 com base no enunciado enviado pela equipe. A rubrica completa da tarefa não foi fornecida.

A versão de entrega está em `develop`. O app foi executado no Expo Go e o README reúne a Ficha, as instruções, as capturas e o vídeo. O envio do repositório pelo Teams fica com a equipe.

## Os seis critérios

| Critério | Situação | Evidência e limite |
| --- | --- | --- |
| Telas e navegação | Jornada principal verificada no simulador iOS | React Native com TypeScript estrito, Expo Router, três abas e rotas de detalhes, preferências, guia, visita e contribuições. Há estados de carregamento, erro e vazio. |
| Consumo de dados | Atende ao requisito de mock | `loadMockPlaces` fornece oito locais de forma assíncrona na inicialização do repositório. As telas recebem os dados persistidos pela camada de aplicação. |
| Banco de dados | Atende, com testes aprovados | SQLite real, migração versionada, transações, carga inicial única e consultas parametrizadas. Preferências, visitas, checklist, relatos, avisos e retomada são persistidos. Os testes incluem fechamento/reabertura do arquivo e recuperação de falha na carga inicial. |
| Acessibilidade | Implementada e verificada em parte no simulador iOS | Há rótulos, papéis e estados acessíveis, áreas de toque, contraste calculado e navegação por botões. Busca, abas, cabeçalhos e preferências foram verificados com a maior fonte do iOS. Voz, foco e leitura com VoiceOver/TalkBack ainda precisam ser avaliados. |
| Aderência ao problema | Atende ao escopo da Ficha do README | A família escolhe preferências, consulta informações, conhece as etapas, salva seu roteiro, acompanha a visita e registra a experiência. Informações insuficientes e vencidas são explicitadas. A colaboração é simulada no aparelho, conforme o recorte declarado. |
| Documentação | Completa para o enunciado recebido | O README contém a Ficha, integrantes e RMs, organização, versões, instruções, capturas e links para o repositório e a demonstração. |

Evidências principais: [rotas](../src/app/_layout.tsx), [abas](../src/app/(tabs)/_layout.tsx), [mock](../src/services/mock.ts), [repositório SQLite](../src/db/repository.ts), [componentes de formulário](../src/components/ui/controls.tsx), [testes](../tests/journey.test.mts) e [jornada de dados completa](../tests/full-journey.test.mts).

## Entregáveis

| Entregável do enunciado | Conferência |
| --- | --- |
| Código organizado | Presente, separado em rotas, componentes, funcionalidades, domínio, serviços, banco e tema. |
| README com Ficha | Presente com problema, público, solução, recorte, colaboração e identificação da equipe. |
| Instruções para executar | Presentes: Node 24, instalação, inicialização e comandos de verificação. |
| Prints no README | Seis capturas incorporadas à [galeria](../README.md#telas-do-app) e uma captura vinculada da ficha do local, todas feitas no simulador iOS. |
| Link de vídeo de até três minutos com o app rodando | [Demonstração narrada de 1min35s no Expo Go](https://github.com/BrnBastos/GS_DaPraIr_Mobile/releases/download/v0.2.0/Da-Pra-Ir-com-narracao.mp4). |
| Repositório no GitHub com a versão entregue | [BrnBastos/GS_DaPraIr_Mobile](https://github.com/BrnBastos/GS_DaPraIr_Mobile). |
| Link enviado no Teams por um integrante até 19/11, às 23h55 | A cargo da equipe. |

## Verificações repetidas nesta conferência

- `npm run test`: oito testes aprovados, nenhum ignorado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, sem avisos.
- `npx expo-doctor`: 21 verificações aprovadas.
- Exportação Expo para iOS, Android e Web: aprovada.
- `git diff --check`: aprovado.

A cobertura da jornada, da persistência e da acessibilidade está em [VALIDACAO.md](VALIDACAO.md).
