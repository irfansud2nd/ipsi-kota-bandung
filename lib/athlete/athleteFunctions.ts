export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};
