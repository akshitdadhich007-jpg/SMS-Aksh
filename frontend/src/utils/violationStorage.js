export const getViolations = () => {
    const data = localStorage.getItem("violations");
    return data ? JSON.parse(data) : [];
};

export const saveViolation = (violation) => {
    const existing = getViolations();
    const updated = [...existing, violation];
    localStorage.setItem("violations", JSON.stringify(updated));
};

export const updateViolationStatus = (id, status) => {
    const existing = getViolations();
    const updated = existing.map(v =>
        v.id === id ? { ...v, status } : v
    );
    localStorage.setItem("violations", JSON.stringify(updated));
};
