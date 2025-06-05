import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTournamentSchema, insertTeamSchema, insertPaymentProofSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tournament routes
  app.get('/api/tournaments', async (req, res) => {
    try {
      const { status } = req.query;
      const tournaments = await storage.getTournaments(status as string);
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post('/api/tournaments', isAuthenticated, async (req: any, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });
      const tournament = await storage.createTournament(tournamentData);
      res.json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.post('/api/tournaments/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { teamId } = req.body;
      const participant = await storage.joinTournament(req.params.id, userId, teamId);
      res.json(participant);
    } catch (error) {
      console.error("Error joining tournament:", error);
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });

  // Team routes
  app.get('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getTeams(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const teamData = insertTeamSchema.parse({
        ...req.body,
        leaderId: req.user.claims.sub,
      });
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  // Wallet routes
  app.get('/api/wallet/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getWalletBalance(userId);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ message: "Failed to fetch wallet balance" });
    }
  });

  app.get('/api/wallet/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getWalletTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Payment proof routes
  app.post('/api/payments/proof', isAuthenticated, async (req: any, res) => {
    try {
      const proofData = insertPaymentProofSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      const proof = await storage.createPaymentProof(proofData);
      res.json(proof);
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      res.status(500).json({ message: "Failed to submit payment proof" });
    }
  });

  // Admin routes
  app.get('/api/admin/payments', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { status } = req.query;
      const payments = await storage.getPaymentProofs(status as string);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payment proofs:", error);
      res.status(500).json({ message: "Failed to fetch payment proofs" });
    }
  });

  app.patch('/api/admin/payments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { status, adminNotes } = req.body;
      const payment = await storage.updatePaymentProofStatus(
        req.params.id,
        status,
        adminNotes,
        req.user.claims.sub
      );

      // If approved, update wallet balance
      if (status === 'approved') {
        const currentBalance = await storage.getWalletBalance(payment.userId);
        const newBalance = (parseFloat(currentBalance) + parseFloat(payment.amount.toString())).toFixed(2);
        await storage.updateWalletBalance(payment.userId, newBalance);

        // Create wallet transaction
        await storage.createWalletTransaction({
          userId: payment.userId,
          type: 'deposit',
          amount: payment.amount,
          status: 'completed',
          description: `Deposit via ${payment.paymentMethod}`,
          referenceId: payment.id,
        });
      }

      res.json(payment);
    } catch (error) {
      console.error("Error updating payment proof:", error);
      res.status(500).json({ message: "Failed to update payment proof" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard/players', async (req, res) => {
    try {
      const { period } = req.query;
      const players = await storage.getTopPlayers(period as string);
      res.json(players);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get('/api/leaderboard/teams', async (req, res) => {
    try {
      const { period } = req.query;
      const teams = await storage.getTopTeams(period as string);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching team leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch team leaderboard" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        // Handle different message types (join room, tournament updates, etc.)
        console.log('WebSocket message:', data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Broadcast function for real-time updates
  app.locals.broadcast = (message: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  return httpServer;
}
