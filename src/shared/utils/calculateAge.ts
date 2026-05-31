export const calculateAge = (birthday: string | Date | null | undefined): number | undefined => {
  if (!birthday) return undefined;

  try {
    const birthDate = typeof birthday === 'string' ? new Date(birthday) : birthday;

    if (isNaN(birthDate.getTime())) {
      return undefined;
    }

    const today = new Date();

    if (birthDate >= today) {
      return undefined;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  } catch {
    return undefined;
  }
};
