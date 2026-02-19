export const getDB = () => {
    const db = localStorage.getItem("tracebackDB");
    return db ? JSON.parse(db) : {
        items: [],
        matches: [],
        claims: [],
        tokens: []
    };
};

export const saveDB = (db) => {
    localStorage.setItem("tracebackDB", JSON.stringify(db));
};
