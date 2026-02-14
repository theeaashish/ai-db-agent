import { validateEmail } from "../utils/validateEmail";
import { slugify } from "../utils/slugify";

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: Date;
};

export class UserService {
  private users = new Map<string, User>();

  // Create new user with validation + transformation.

  createUser(name: string, email: string): User {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const existing = [...this.users.values()].find(
      (u) => u.email === email
    );

    if (existing) {
      throw new Error("Email already exists");
    }

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      username: slugify(name),
      isActive: true,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  // Deactivate user account.

  deactivateUser(id: string) {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");

    user.isActive = false;
    return user;
  }

  // Search users by partial match.

  search(query: string): User[] {
    const lower = query.toLowerCase();

    return [...this.users.values()].filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
  }

  // Get active users only.

  getActiveUsers(): User[] {
    return [...this.users.values()].filter((u) => u.isActive);
  }
}
