export const calculateHours = async (startTime, endTime) => {
  try {
    const [sh, sm, ss] = startTime.split(":").map(Number);
    const [eh, em, es] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sh, sm, ss);

    const end = new Date();
    end.setHours(eh, em, es);

    const diff = (end - start) / 1000 / 60 / 60; // in hours
    return diff.toFixed(2);
  } catch (err) {
    return 0;
  }
};

