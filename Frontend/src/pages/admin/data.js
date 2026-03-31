export const users = [
  { id: "U-1001", name: "Ahmed Khan", email: "ahmed@example.com", phone: "0300-1234567", role: "admin", status: "Active", createdAt: "2026-01-05", updatedAt: "2026-02-05" },
  { id: "U-1002", name: "Sara Ali", email: "sara@example.com", phone: "0311-9876543", role: "user", status: "Active", createdAt: "2026-01-07", updatedAt: "2026-02-07" },
  { id: "U-1003", name: "Usman Tariq", email: "usman@example.com", phone: "0321-5551234", role: "user", status: "Blocked", createdAt: "2026-01-09", updatedAt: "2026-02-09" },
  { id: "U-1004", name: "Fatima Noor", email: "fatima@example.com", phone: "0333-1112233", role: "user", status: "Active", createdAt: "2026-01-11", updatedAt: "2026-02-11" },
  { id: "U-1005", name: "Admin User", email: "admin@rebook.com", phone: "0300-0000000", role: "admin", status: "Active", createdAt: "2026-01-13", updatedAt: "2026-02-13" },
];

export const books = [
  {
    id: "B-2001",
    title: "Atomic Habits",
    owner: "Ahmed Khan",
    category: "Self Help",
    condition: "Like New",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-15",
    updatedAt: "2026-02-20",
  },
  {
    id: "B-2002",
    title: "Sapiens",
    owner: "Sara Ali",
    category: "History",
    condition: "Good",
    status: "Under Review",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-16",
    updatedAt: "2026-02-22",
  },
  {
    id: "B-2003",
    title: "Deep Work",
    owner: "Usman Tariq",
    category: "Productivity",
    condition: "Good",
    status: "Rejected",
    image: "https://images.unsplash.com/photo-1544939571-1bb1317d2dc8?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-18",
    updatedAt: "2026-02-24",
  },
  {
    id: "B-2004",
    title: "The Alchemist",
    owner: "Fatima Noor",
    category: "Fiction",
    condition: "Fair",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-20",
    updatedAt: "2026-02-26",
  },
];

export const categories = [
  {
    id: "C-5001",
    name: "Self Help",
    description: "Habits, productivity, and personal growth titles.",
    status: "Active",
    createdAt: "2026-01-05",
    updatedAt: "2026-02-05",
  },
  {
    id: "C-5002",
    name: "History",
    description: "Historical accounts and biographies.",
    status: "Active",
    createdAt: "2026-01-07",
    updatedAt: "2026-02-08",
  },
  {
    id: "C-5003",
    name: "Fiction",
    description: "Modern and classic fiction novels.",
    status: "Active",
    createdAt: "2026-01-09",
    updatedAt: "2026-02-10",
  },
  {
    id: "C-5004",
    name: "Productivity",
    description: "Work, focus, and efficiency reads.",
    status: "Inactive",
    createdAt: "2026-01-11",
    updatedAt: "2026-02-12",
  },
];

export const exchangeRequests = [
  {
    id: "ER-3001",
    requester: "Ayesha Khan",
    owner: "Ahmed Khan",
    offeredBook: {
      title: "Deep Work",
      image: "https://images.unsplash.com/photo-1544939571-1bb1317d2dc8?auto=format&fit=crop&w=200&q=80",
    },
    requestedBook: {
      title: "Atomic Habits",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=200&q=80",
    },
    date: "2026-02-20",
    status: "Pending",
    createdAt: "2026-02-20",
    updatedAt: "2026-02-25",
  },
  {
    id: "ER-3002",
    requester: "Bilal Ahmed",
    owner: "Sara Ali",
    offeredBook: {
      title: "Rich Dad Poor Dad",
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=200&q=80",
    },
    requestedBook: {
      title: "The Psychology of Money",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
    },
    date: "2026-02-22",
    status: "Accepted",
    createdAt: "2026-02-22",
    updatedAt: "2026-02-27",
  },
  {
    id: "ER-3003",
    requester: "Hassan Raza",
    owner: "You",
    offeredBook: {
      title: "Ikigai",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=200&q=80",
    },
    requestedBook: {
      title: "The Alchemist",
      image: "https://images.unsplash.com/photo-1455884981818-54cb785db6fc?auto=format&fit=crop&w=200&q=80",
    },
    date: "2026-02-24",
    status: "Rejected",
    createdAt: "2026-02-24",
    updatedAt: "2026-03-01",
  },
];

export const orders = [
  { id: "O-4001", buyer: "Ahmed Khan", bookTitle: "Atomic Habits", price: 750, date: "2026-03-05", status: "Completed", createdAt: "2026-03-05", updatedAt: "2026-03-10" },
  { id: "O-4002", buyer: "Sara Ali", bookTitle: "Sapiens", price: 920, date: "2026-03-08", status: "Pending", createdAt: "2026-03-08", updatedAt: "2026-03-12" },
  { id: "O-4003", buyer: "Usman Tariq", bookTitle: "Deep Work", price: 640, date: "2026-03-12", status: "Shipped", createdAt: "2026-03-12", updatedAt: "2026-03-18" },
  { id: "O-4004", buyer: "Fatima Noor", bookTitle: "The Alchemist", price: 480, date: "2026-03-15", status: "Cancelled", createdAt: "2026-03-15", updatedAt: "2026-03-20" },
];

export const analytics = {
  booksPerMonth: [
    { month: "Jan", value: 12 },
    { month: "Feb", value: 18 },
    { month: "Mar", value: 25 },
    { month: "Apr", value: 22 },
    { month: "May", value: 30 },
    { month: "Jun", value: 28 },
  ],
  exchangeTrend: [
    { month: "Jan", value: 4 },
    { month: "Feb", value: 7 },
    { month: "Mar", value: 9 },
    { month: "Apr", value: 11 },
    { month: "May", value: 10 },
    { month: "Jun", value: 13 },
  ],
};
