/**
 * Retorna apenas o primeiro nome de uma string completa.
 * @param fullName Nome completo (ex: "Davis Pereira Vasconcellos")
 * @returns Primeiro nome ou string original (ex: "Davis")
 */
export const getFirstName = (fullName: string | null | undefined): string => {
  if (!fullName) return '---';
  const parts = fullName.trim().split(/\s+/);
  return parts[0];
};

/**
 * Abre o discador nativo do telefone.
 */
export const handlePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return;
  window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
};
