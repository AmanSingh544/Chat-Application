export const getRelativeDateLabels = (utctime) => {
    const inputdate = new Date(utctime);

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);  // sets to midnight

    const yesterdayStart = new Date(todayStart)  // same as today i.e., midnight
    yesterdayStart.setDate(todayStart.getDate() - 1)  // sets to midnight 1 day before

    if(inputdate > todayStart)  return 'Today';
    if(inputdate > yesterdayStart)  return 'Yesterday'

    return inputdate.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};