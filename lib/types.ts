// Simulated DB client for testing.

type User = {
  id: string;
  email: string;
  name: string;
};

const users: User[] = [];

export const db = {
  createUser(data: Omit<User, "id">) {
    const newUser = { ...data, id: crypto.randomUUID() };
    users.push(newUser);
    return newUser;
  },

  getUserByEmail(email: string) {
    return users.find((u) => u.email === email) ?? null;
  },
};
