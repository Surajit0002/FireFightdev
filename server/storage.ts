import {
  users,
  teams,
  teamMembers,
  tournaments,
  tournamentParticipants,
  matchResults,
  walletTransactions,
  paymentProofs,
  notifications,
  type User,
  type UpsertUser,
  type Team,
  type InsertTeam,
  type Tournament,
  type InsertTournament,
  type TournamentParticipant,
  type MatchResult,
  type WalletTransaction,
  type InsertWalletTransaction,
  type PaymentProof,
  type InsertPaymentProof,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, updates: Partial<User>): Promise<User>;
  
  // Tournament operations
  getTournaments(status?: string): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament>;
  joinTournament(tournamentId: string, userId: string, teamId?: string): Promise<TournamentParticipant>;
  getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]>;
  
  // Team operations
  getTeams(userId?: string): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  joinTeam(teamId: string, userId: string): Promise<void>;
  leaveTeam(teamId: string, userId: string): Promise<void>;
  
  // Wallet operations
  getWalletBalance(userId: string): Promise<string>;
  createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
  getWalletTransactions(userId: string): Promise<WalletTransaction[]>;
  updateWalletBalance(userId: string, amount: string): Promise<void>;
  
  // Payment operations
  createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof>;
  getPaymentProofs(status?: string): Promise<PaymentProof[]>;
  updatePaymentProofStatus(id: string, status: string, adminNotes?: string, reviewedBy?: string): Promise<PaymentProof>;
  
  // Match results
  getMatchResults(tournamentId: string): Promise<MatchResult[]>;
  createMatchResult(result: Partial<MatchResult>): Promise<MatchResult>;
  
  // Leaderboard
  getTopPlayers(period?: string): Promise<User[]>;
  getTopTeams(period?: string): Promise<Team[]>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Tournament operations
  async getTournaments(status?: string): Promise<Tournament[]> {
    let query = db.select().from(tournaments);
    if (status) {
      query = query.where(eq(tournaments.status, status));
    }
    return await query.orderBy(desc(tournaments.startTime));
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [newTournament] = await db
      .insert(tournaments)
      .values(tournament)
      .returning();
    return newTournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const [tournament] = await db
      .update(tournaments)
      .set(updates)
      .where(eq(tournaments.id, id))
      .returning();
    return tournament;
  }

  async joinTournament(tournamentId: string, userId: string, teamId?: string): Promise<TournamentParticipant> {
    const [participant] = await db
      .insert(tournamentParticipants)
      .values({
        tournamentId,
        userId,
        teamId,
      })
      .returning();

    // Update tournament participant count
    await db
      .update(tournaments)
      .set({ currentParticipants: sql`${tournaments.currentParticipants} + 1` })
      .where(eq(tournaments.id, tournamentId));

    return participant;
  }

  async getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]> {
    return await db
      .select()
      .from(tournamentParticipants)
      .where(eq(tournamentParticipants.tournamentId, tournamentId));
  }

  // Team operations
  async getTeams(userId?: string): Promise<Team[]> {
    if (userId) {
      return await db
        .select({
          id: teams.id,
          name: teams.name,
          logoUrl: teams.logoUrl,
          type: teams.type,
          maxMembers: teams.maxMembers,
          leaderId: teams.leaderId,
          isActive: teams.isActive,
          createdAt: teams.createdAt,
        })
        .from(teams)
        .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
        .where(eq(teamMembers.userId, userId));
    }
    return await db.select().from(teams).where(eq(teams.isActive, true));
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    
    // Add leader as team member
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: team.leaderId,
      role: "leader",
    });

    return newTeam;
  }

  async joinTeam(teamId: string, userId: string): Promise<void> {
    await db.insert(teamMembers).values({
      teamId,
      userId,
      role: "member",
    });
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
  }

  // Wallet operations
  async getWalletBalance(userId: string): Promise<string> {
    const [user] = await db
      .select({ walletBalance: users.walletBalance })
      .from(users)
      .where(eq(users.id, userId));
    return user?.walletBalance || "0.00";
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const [newTransaction] = await db
      .insert(walletTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    return await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt));
  }

  async updateWalletBalance(userId: string, amount: string): Promise<void> {
    await db
      .update(users)
      .set({ walletBalance: amount })
      .where(eq(users.id, userId));
  }

  // Payment operations
  async createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof> {
    const [newProof] = await db
      .insert(paymentProofs)
      .values(proof)
      .returning();
    return newProof;
  }

  async getPaymentProofs(status?: string): Promise<PaymentProof[]> {
    let query = db.select().from(paymentProofs);
    if (status) {
      query = query.where(eq(paymentProofs.status, status));
    }
    return await query.orderBy(desc(paymentProofs.createdAt));
  }

  async updatePaymentProofStatus(
    id: string,
    status: string,
    adminNotes?: string,
    reviewedBy?: string
  ): Promise<PaymentProof> {
    const [proof] = await db
      .update(paymentProofs)
      .set({
        status,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(paymentProofs.id, id))
      .returning();
    return proof;
  }

  // Match results
  async getMatchResults(tournamentId: string): Promise<MatchResult[]> {
    return await db
      .select()
      .from(matchResults)
      .where(eq(matchResults.tournamentId, tournamentId))
      .orderBy(matchResults.rank);
  }

  async createMatchResult(result: Partial<MatchResult>): Promise<MatchResult> {
    const [newResult] = await db
      .insert(matchResults)
      .values(result as any)
      .returning();
    return newResult;
  }

  // Leaderboard
  async getTopPlayers(period?: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isBanned, false))
      .orderBy(desc(users.totalEarnings))
      .limit(10);
  }

  async getTopTeams(period?: string): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .where(eq(teams.isActive, true))
      .orderBy(desc(teams.createdAt))
      .limit(10);
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(or(eq(notifications.userId, userId), eq(notifications.userId, null)))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
