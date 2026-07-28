export function maskCompanyTaxId(taxId: string): string {
  return taxId.replace(/\d/g, '*') + taxId.slice(-3);
}
