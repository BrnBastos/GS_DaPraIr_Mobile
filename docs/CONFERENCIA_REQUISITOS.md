# Conferência do enunciado CitizenTech

Conferência realizada em 17/11/2026 sobre a versão 0.2.0, com base no enunciado enviado pela equipe. A rubrica completa da tarefa não foi fornecida; este relatório não estima nota nem presume pesos para os seis critérios.

**Resultado:** o núcleo técnico e a jornada da Ficha estão implementados. O README identifica a equipe, mostra as telas da versão 0.2.0 e indica o repositório de entrega. Permanecem pendentes o link público do vídeo, o envio no Teams e a validação prática completa no aparelho.

## Os seis critérios

| Critério | Situação | Evidência e limite |
| --- | --- | --- |
| Telas e navegação | Implementado; validação nativa parcial | React Native com TypeScript estrito, Expo Router, três abas e rotas de detalhes, preferências, guia, visita e contribuições. Há estados de carregamento, erro e vazio. A jornada completa ainda precisa ser percorrida pela interface no aparelho. |
| Consumo de dados | Atende ao requisito de mock | `loadMockPlaces` é assíncrono, fornece oito locais e é consumido na inicialização do repositório. As telas recebem os registros persistidos pela camada de aplicação. O enunciado aceita API **ou mock**; uma API externa não é obrigatória pelo texto recebido. |
| Banco de dados | Atende, com testes aprovados | SQLite real, migração versionada, transações, carga inicial única e consultas parametrizadas. Preferências, visitas, checklist, relatos, avisos e retomada são persistidos. Os testes incluem fechamento/reabertura do arquivo e recuperação de falha na carga inicial. |
| Acessibilidade | Implementada em parte; validação prática pendente | Há rótulos, papéis e estados acessíveis, áreas de toque, contraste calculado, adaptação à fonte ampliada e navegação por botões. Ainda faltam testes com VoiceOver/TalkBack, fonte máxima e telas pequenas. A simplicidade para pessoas não especialistas precisa de avaliação de uso. |
| Aderência ao problema | Atende ao escopo da Ficha do README | A família escolhe preferências, consulta informações, conhece as etapas, salva seu roteiro, acompanha a visita e registra a experiência. Informações insuficientes e vencidas são explicitadas. A colaboração é simulada no aparelho, conforme o recorte declarado. |
| Documentação | Parcial | O README contém a Ficha, integrantes e RMs, organização, versões, instruções, capturas atuais e o link do GitHub. Falta o link público do vídeo. |

Evidências principais: [rotas](../src/app/_layout.tsx), [abas](../src/app/(tabs)/_layout.tsx), [mock](../src/services/mock.ts), [repositório SQLite](../src/db/repository.ts), [componentes de formulário](../src/components/ui/controls.tsx), [testes](../tests/journey.test.mts) e [jornada de dados completa](../tests/full-journey.test.mts).

## Entregáveis

| Entregável do enunciado | Conferência |
| --- | --- |
| Código organizado | Presente, separado em rotas, componentes, funcionalidades, domínio, serviços, banco e tema. |
| README com Ficha | Presente com problema, público, solução, recorte, colaboração e identificação da equipe. |
| Instruções para executar | Presentes: Node 24, instalação, inicialização e comandos de verificação. |
| Prints no README | Seis [capturas da versão 0.2.0](../README.md#telas-do-app), feitas no simulador iOS. |
| Link de vídeo de até três minutos com o app rodando | A demonstração foi gravada. O link será incluído após a publicação do vídeo. |
| Repositório no GitHub com a versão entregue | [BrnBastos/GS_DaPraIr_Mobile](https://github.com/BrnBastos/GS_DaPraIr_Mobile). |
| Link enviado no Teams por um integrante até 19/11, às 23h55 | Não comprovado. É uma ação de entrega da equipe, distinta da implementação local. |

## Verificações repetidas nesta conferência

- `npm run test`: oito testes aprovados, nenhum ignorado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, sem avisos.
- `git diff --check`: aprovado.
- Inspeção do README em 18/11: cinco integrantes identificados, seis imagens incorporadas e link do GitHub incluído; link do vídeo a preencher.

Em 18/11, o simulador voltou a responder e foi possível capturar as telas. O teste no aparelho físico e a validação com leitor de tela permanecem pendentes em [VALIDACAO.md](VALIDACAO.md).

## O que concluir antes de entregar

1. Percorrer a jornada completa em um celular: consultar, preparar, salvar, fechar/reabrir, retomar, finalizar e contribuir.
2. Conferir fonte ampliada, teclado, foco e VoiceOver/TalkBack; corrigir problemas encontrados.
3. Publicar o vídeo, inserir o link no README e conferir o acesso.
4. Enviar o link no Teams por um único integrante até o prazo informado.

O texto recebido não exige notificações push, API externa, backend compartilhado ou agendamento real. Esses recursos não foram tratados como lacunas obrigatórias nesta conferência.
