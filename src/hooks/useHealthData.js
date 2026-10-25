import { useMemo } from 'react';
import { useHealth } from '../context/HealthContext';

/**
 * Custom Hook: useHealthData
 * Computes calculated values for Today's Schedule, Adherence %,
 * Weekly Trends, and Pending doses from real state.
 */
export const useHealthData = () => {
  const { medicines, doseLogs, diaryEntries, userProfile, isLoading } = useHealth();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Today's schedule computed from active medicines
  const todaySchedule = useMemo(() => {
    const list = [];
    medicines.forEach((med) => {
      // Check if medicine is active today
      const startValid = !med.startDate || med.startDate <= todayStr;
      const endValid = !med.endDate || med.endDate >= todayStr;

      if (startValid && endValid && Array.isArray(med.times)) {
        med.times.forEach((time) => {
          // Check if dose has already been recorded today
          const matchingLog = doseLogs.find(
            (log) =>
              log.medicineId === med.id &&
              log.scheduledTime === time &&
              log.date === todayStr
          );

          list.push({
            id: `${med.id}-${time}`,
            medicineId: med.id,
            name: med.name,
            dosage: med.dosage,
            type: med.type,
            instructions: med.instructions,
            time,
            category: med.category,
            status: matchingLog ? matchingLog.status : 'pending', // 'taken', 'skipped', or 'pending'
            loggedAt: matchingLog ? matchingLog.loggedAt : null,
          });
        });
      }
    });

    // Sort by scheduled time
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [medicines, doseLogs, todayStr]);

  // Statistics for Today
  const todayStats = useMemo(() => {
    const total = todaySchedule.length;
    const taken = todaySchedule.filter((d) => d.status === 'taken').length;
    const skipped = todaySchedule.filter((d) => d.status === 'skipped').length;
    const pending = total - (taken + skipped);
    const completionRate = total > 0 ? Math.round((taken / total) * 100) : 0;

    return { total, taken, skipped, pending, completionRate };
  }, [todaySchedule]);

  // Past 7 Days Adherence Data for Chart
  const weeklyAdherence = useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = dayNames[d.getDay()];

      const dayLogs = doseLogs.filter((l) => l.date === dateStr);
      const takenCount = dayLogs.filter((l) => l.status === 'taken').length;
      const skippedCount = dayLogs.filter((l) => l.status === 'skipped').length;
      const totalCount = takenCount + skippedCount;
      const rate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : (i === 0 ? todayStats.completionRate : 100);

      days.push({
        date: dateStr,
        day: dayLabel,
        isToday: i === 0,
        taken: takenCount,
        skipped: skippedCount,
        percentage: rate,
      });
    }

    return days;
  }, [doseLogs, todayStats.completionRate]);

  // Next Upcoming Reminder
  const nextReminder = useMemo(() => {
    const pendingDoses = todaySchedule.filter((d) => d.status === 'pending');
    if (pendingDoses.length === 0) return null;

    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Find first pending dose strictly in the future, or first pending of the day
    const futureDose = pendingDoses.find((d) => d.time >= currentHourMin);
    return futureDose || pendingDoses[0];
  }, [todaySchedule]);

  return {
    medicines,
    doseLogs,
    diaryEntries,
    userProfile,
    isLoading,
    todaySchedule,
    todayStats,
    weeklyAdherence,
    nextReminder,
  };
};
