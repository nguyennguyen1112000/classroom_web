export function authHeader() {
  const token = JSON.parse(localStorage.getItem("token"));
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
export function logOut() {
  localStorage.setItem("user", null);
  localStorage.setItem("token", null);
}
export function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export const findDaysDifferent = (fromDate) => {
  let CreatedDate = new Date(fromDate);
  let today = new Date();
  let requiredDiffrentDays;

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((CreatedDate - today) / oneDay));

  if (diffDays >= 360) {
    requiredDiffrentDays = `${Math.floor(diffDays / 365)} năm trước`;
  } else if (diffDays >= 30) {
    requiredDiffrentDays = `${Math.floor(diffDays / 30)} tháng trước`;
  } else if (diffDays >= 7) {
    requiredDiffrentDays = `${Math.floor(diffDays / 7)} tuần trước`;
  } else if (diffDays >= 1) {
    requiredDiffrentDays = `${diffDays} ngày trước`;
  } else {
    const oneHour = 60 * 60 * 1000;
    const diffHours = Math.round(Math.abs((CreatedDate - today) / oneHour));
    if (diffHours == 0) {
      const oneMinute = 60 * 1000;
      const diffMinutes = Math.round(
        Math.abs((CreatedDate - today) / oneMinute)
      );
      requiredDiffrentDays = `${diffMinutes} phút trước`;
    } else requiredDiffrentDays = `${diffHours} giờ trước`;
  }

  return requiredDiffrentDays;
};
