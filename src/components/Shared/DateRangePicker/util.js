const nextMonth = (date) => {
  const passYear = date.getMonth() === 11;
  const newMonth = passYear ? 0 : date.getMonth() + 1;
  const year = passYear ? date.getFullYear() + 1 : date.getFullYear();
  return new Date(year, newMonth, 1);
};

const prevMonth = (date) => {
  const passYear = date.getMonth() === 0;
  const newMonth = passYear ? 11 : date.getMonth() - 1;
  const year = passYear ? date.getFullYear() - 1 : date.getFullYear();
  return new Date(year, newMonth, 1);
};

export { nextMonth, prevMonth };
