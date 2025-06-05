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
      const tournaments = [
        {
          id: '1',
          name: 'Fire Fight Championship 2024',
          type: 'Squad',
          entryFee: '50',
          prizePool: '2000',
          maxParticipants: 100,
          currentParticipants: 87,
          status: 'live',
          startTime: '2024-12-06T18:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: '2',
          name: 'Solo Masters Tournament',
          type: 'Solo', 
          entryFee: '25',
          prizePool: '1000',
          maxParticipants: 200,
          currentParticipants: 156,
          status: 'upcoming',
          startTime: '2024-12-07T15:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: '3',
          name: 'Duo Legends Cup',
          type: 'Duo',
          entryFee: '40',
          prizePool: '1500',
          maxParticipants: 80,
          currentParticipants: 72,
          status: 'upcoming',
          startTime: '2024-12-08T12:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: '4',
          name: 'Weekly Clash Arena',
          type: 'Squad',
          entryFee: '30',
          prizePool: '800',
          maxParticipants: 60,
          currentParticipants: 45,
          status: 'upcoming',
          startTime: '2024-12-09T20:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: '5',
          name: 'Midnight Showdown',
          type: 'Custom',
          entryFee: '100',
          prizePool: '5000',
          maxParticipants: 50,
          currentParticipants: 12,
          status: 'upcoming',
          startTime: '2024-12-10T00:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop&crop=center'
        }
      ];
      
      const filteredTournaments = status ? tournaments.filter(t => t.status === status) : tournaments;
      res.json(filteredTournaments);
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
      const teams = [
        {
          id: '1',
          name: 'Fire Legends',
          type: 'Squad',
          maxMembers: 4,
          leaderId: 'user123',
          logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=FireLegends&backgroundColor=00ff88',
          isActive: true,
          members: [
            { userId: 'user123', role: 'leader', username: 'Arjun_Singh' },
            { userId: 'user456', role: 'member', username: 'Priya_Sharma' },
            { userId: 'user789', role: 'member', username: 'Rahul_Kumar' }
          ]
        },
        {
          id: '2',
          name: 'Elite Warriors',
          type: 'Duo',
          maxMembers: 2,
          leaderId: 'user101',
          logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=EliteWarriors&backgroundColor=0088ff',
          isActive: true,
          members: [
            { userId: 'user101', role: 'leader', username: 'Deepak_Patel' },
            { userId: 'user102', role: 'member', username: 'Sneha_Gupta' }
          ]
        },
        {
          id: '3',
          name: 'Nightmare Squad',
          type: 'Squad',
          maxMembers: 4,
          leaderId: 'user201',
          logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=NightmareSquad&backgroundColor=ff4444',
          isActive: true,
          members: [
            { userId: 'user201', role: 'leader', username: 'Vikram_Singh' },
            { userId: 'user202', role: 'member', username: 'Anjali_Raj' },
            { userId: 'user203', role: 'member', username: 'Rohit_Sharma' },
            { userId: 'user204', role: 'member', username: 'Kavya_Nair' }
          ]
        }
      ];
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

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = {
        totalUsers: 150,
        activeTournaments: 8,
        pendingPayments: 12,
        totalRevenue: 25000,
        recentTournaments: [
          {
            id: '1',
            name: 'Fire Fight Championship',
            type: 'Squad',
            entryFee: '50',
            status: 'live'
          },
          {
            id: '2', 
            name: 'Solo Masters',
            type: 'Solo',
            entryFee: '25',
            status: 'upcoming'
          }
        ],
        pendingPaymentsList: [
          {
            id: '1',
            amount: '100',
            paymentMethod: 'UPI',
            userId: 'user123'
          },
          {
            id: '2',
            amount: '50',
            paymentMethod: 'Paytm',
            userId: 'user456'
          }
        ]
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/tournaments', isAuthenticated, async (req: any, res) => {
    try {
      const tournaments = [
        {
          id: '1',
          name: 'Fire Fight Championship 2024',
          type: 'Squad',
          entryFee: 50,
          prizePool: 2000,
          maxParticipants: 100,
          currentParticipants: 87,
          status: 'live',
          startTime: '2024-12-06T10:00:00Z'
        },
        {
          id: '2',
          name: 'Solo Masters Tournament',
          type: 'Solo', 
          entryFee: 25,
          prizePool: 1000,
          maxParticipants: 200,
          currentParticipants: 156,
          status: 'upcoming',
          startTime: '2024-12-07T15:00:00Z'
        },
        {
          id: '3',
          name: 'Duo Legends Cup',
          type: 'Duo',
          entryFee: 40,
          prizePool: 1500,
          maxParticipants: 80,
          currentParticipants: 72,
          status: 'upcoming',
          startTime: '2024-12-08T12:00:00Z'
        }
      ];
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching admin tournaments:", error);
      res.status(500).json({ message: "Failed to fetch admin tournaments" });
    }
  });

  app.get('/api/admin/payments', isAuthenticated, async (req: any, res) => {
    try {
      const payments = [
        {
          id: '1',
          userId: 'user123',
          amount: 100,
          paymentMethod: 'UPI',
          transactionId: 'TXN123456789',
          screenshotUrl: 'https://via.placeholder.com/400x600/1a1a1a/00ff88?text=Payment+Screenshot',
          status: 'pending',
          createdAt: '2024-12-05T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user456',
          amount: 50,
          paymentMethod: 'Paytm',
          transactionId: 'PTM987654321',
          screenshotUrl: 'https://via.placeholder.com/400x600/1a1a1a/0088ff?text=Paytm+Payment',
          status: 'pending',
          createdAt: '2024-12-05T14:15:00Z'
        },
        {
          id: '3',
          userId: 'user789',
          amount: 75,
          paymentMethod: 'PhonePe',
          transactionId: 'PPE456789123',
          screenshotUrl: 'https://via.placeholder.com/400x600/1a1a1a/ff4444?text=PhonePe+Receipt',
          status: 'approved',
          createdAt: '2024-12-04T16:45:00Z'
        }
      ];
      res.json(payments);
    } catch (error) {
      console.error("Error fetching admin payments:", error);
      res.status(500).json({ message: "Failed to fetch admin payments" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const users = [
        {
          id: 'user123',
          email: 'gamer_pro@email.com',
          firstName: 'Arjun',
          lastName: 'Singh',
          profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
          isActive: true,
          createdAt: '2024-11-15T08:30:00Z',
          tournamentsJoined: 15,
          totalWinnings: 2500
        },
        {
          id: 'user456',
          email: 'fire_fighter_99@gmail.com',
          firstName: 'Priya',
          lastName: 'Sharma',
          profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
          isActive: true,
          createdAt: '2024-11-20T12:15:00Z',
          tournamentsJoined: 8,
          totalWinnings: 1200
        },
        {
          id: 'user789',
          email: 'squad_leader@yahoo.com',
          firstName: 'Rahul',
          lastName: 'Kumar',
          profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
          isActive: false,
          createdAt: '2024-10-05T14:20:00Z',
          tournamentsJoined: 22,
          totalWinnings: 4100
        },
        {
          id: 'user101',
          email: 'sniper_king@hotmail.com',
          firstName: 'Deepak',
          lastName: 'Patel',
          profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak',
          isActive: true,
          createdAt: '2024-12-01T09:45:00Z',
          tournamentsJoined: 3,
          totalWinnings: 450
        }
      ];
      res.json(users);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch admin users" });
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
