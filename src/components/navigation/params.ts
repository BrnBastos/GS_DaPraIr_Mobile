export function singleParam(value: string | string[] | undefined): string | undefined {
  // Parâmetros repetidos não devem selecionar silenciosamente outro registro.
  return typeof value === 'string' ? value : undefined;
}
