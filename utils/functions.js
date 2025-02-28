const getTodayDateForSql = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const dateFormater = (date) => {
  const result = new Date(date);
  return result.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const dateFormaterToSql = (date) => {
  const [day, month, year] = date.split('.');
  return `${year}-${month}-${day}`;
};

const daysUntill = (dateString) => {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate - today;

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateNextExpiration = (arr) => {
  let nextExpiration = {
    site: arr[0].name,
    days: daysUntill(arr[0].domain_exp_date),
    type: 'domain',
  };

  arr.forEach((site) => {
    const daysTillDomainEnds = daysUntill(site.domain_exp_date);
    const daysTillHostingEnds = daysUntill(site.hosting_exp_date);

    if (daysTillDomainEnds < nextExpiration.days) {
      nextExpiration.days = daysTillDomainEnds;
      nextExpiration.site = site.name;
    }

    if (daysTillHostingEnds < nextExpiration.days) {
      nextExpiration.days = daysTillHostingEnds;
      nextExpiration.type = 'hosting';
      nextExpiration.site = site.name;
    }
  });

  return nextExpiration;
};

export default getTodayDateForSql;
export { dateFormater, dateFormaterToSql, calculateNextExpiration };
