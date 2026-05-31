interface IFormateDate {
  date: Date;
  format: 'дд.мм.гггг' | 'гггг.мм.дд';
}

export const formateDate = ({ date, format }: IFormateDate) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  switch (format) {
    case 'дд.мм.гггг':
      return `${day}.${month}.${year}`;
    case 'гггг.мм.дд':
      return `${year}.${month}.${day}`;
  }
};
