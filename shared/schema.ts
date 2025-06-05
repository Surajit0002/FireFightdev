import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Gaming profile fields
  gameId: varchar("game_id"), // Free Fire UID
  displayName: varchar("display_name"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  totalMatches: integer("total_matches").default(0),
  totalWins: integer("total_wins").default(0),
  totalKills: integer("total_kills").default(0),
  isAdmin: boolean("is_admin").default(false),
  isBanned: boolean("is_banned").default(false),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
});

// Teams table
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: varchar("logo_url"),
  type: varchar("type", { length: 20 }).notNull(), // 'duo', 'squad'
  maxMembers: integer("max_members").notNull(),
  leaderId: varchar("leader_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role", { length: 20 }).default("member"), // 'leader', 'member'
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull(), // 'solo', 'duo', 'squad', 'custom'
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  status: varchar("status", { length: 20 }).default("upcoming"), // 'upcoming', 'live', 'completed', 'cancelled'
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  rules: text("rules"),
  imageUrl: varchar("image_url"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tournament participants table
export const tournamentParticipants = pgTable("tournament_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").notNull(),
  userId: varchar("user_id"),
  teamId: uuid("team_id"),
  registeredAt: timestamp("registered_at").defaultNow(),
  status: varchar("status", { length: 20 }).default("registered"), // 'registered', 'playing', 'completed'
});

// Match results table
export const matchResults = pgTable("match_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").notNull(),
  participantId: uuid("participant_id").notNull(),
  rank: integer("rank"),
  kills: integer("kills").default(0),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0.00"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet transactions table
export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'deposit', 'withdrawal', 'tournament_fee', 'tournament_win', 'referral_bonus'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'completed', 'failed', 'cancelled'
  description: text("description"),
  referenceId: varchar("reference_id"), // Tournament ID, payment proof ID, etc.
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Payment proofs table (for manual QR payments)
export const paymentProofs = pgTable("payment_proofs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  transactionId: varchar("transaction_id"),
  screenshotUrl: varchar("screenshot_url").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'approved', 'rejected'
  adminNotes: text("admin_notes"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'tournament', 'payment', 'match_result', 'general'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  teamMemberships: many(teamMembers),
  ledTeams: many(teams),
  tournamentParticipations: many(tournamentParticipants),
  walletTransactions: many(walletTransactions),
  paymentProofs: many(paymentProofs),
  notifications: many(notifications),
  matchResults: many(matchResults),
  referrer: one(users, {
    fields: [users.referredBy],
    references: [users.referralCode],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
  }),
  members: many(teamMembers),
  tournamentParticipations: many(tournamentParticipants),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  creator: one(users, {
    fields: [tournaments.createdBy],
    references: [users.id],
  }),
  participants: many(tournamentParticipants),
  results: many(matchResults),
}));

export const tournamentParticipantsRelations = relations(tournamentParticipants, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [tournamentParticipants.tournamentId],
    references: [tournaments.id],
  }),
  user: one(users, {
    fields: [tournamentParticipants.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [tournamentParticipants.teamId],
    references: [teams.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const insertTournamentSchema = createInsertSchema(tournaments).omit({ id: true, createdAt: true, currentParticipants: true });
export const insertPaymentProofSchema = createInsertSchema(paymentProofs).omit({ id: true, createdAt: true, status: true, reviewedBy: true, reviewedAt: true });
export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({ id: true, createdAt: true, completedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
export type MatchResult = typeof matchResults.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type PaymentProof = typeof paymentProofs.$inferSelect;
export type InsertPaymentProof = z.infer<typeof insertPaymentProofSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
