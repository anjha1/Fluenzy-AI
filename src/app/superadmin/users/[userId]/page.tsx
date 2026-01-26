"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Download, Eye } from "lucide-react";

interface UserActivity {
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    role: string;
    disabled: boolean;
    createdAt: string;
    renewalDate: string | null;
    lastActive: string | null;
    totalTimeSpent: number;
    totalSessions: number;
  };
  resume: {
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  } | null;
  englishLearning: {
    totalTimeSpent: number;
    totalLessons: number;
    completedLessons: number;
    pendingLessons: number;
    completionPercentage: number;
    lessons: any[];
  };
  hrInterview: {
    totalSessions: number;
    totalTimeSpent: number;
    averageScore: number;
    bestScore: number;
    sessions: any[];
  };
  technicalMastery: {
    totalSessions: number;
    totalTimeSpent: number;
    sessions: any[];
  };
  companyTracks: {
    totalSessions: number;
    totalTimeSpent: number;
    sessions: any[];
  };
  gdAgent: {
    totalSessions: number;
    totalTimeSpent: number;
    averageScore: number;
    sessions: any[];
  };
  timeAnalytics: {
    moduleBreakdown: Record<string, number>;
    totalTimeSpent: number;
  };
  recentActivity: any[];
  subscription: any;
  payments: any[];
}

export default function UserDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      router.push("/");
      return;
    }
    fetchUserActivity();
  }, [session, status, router, userId]);

  const fetchUserActivity = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activity`);
      if (res.ok) {
        const data = await res.json();
        setUserActivity(data);
      }
    } catch (error) {
      console.error("Failed to fetch user activity:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <div className="p-6">Loading...</div>;
  if (!userActivity) return <div className="p-6">User not found</div>;

  const { user, resume, englishLearning, hrInterview, technicalMastery, companyTracks, gdAgent, timeAnalytics, recentActivity, subscription, payments } = userActivity;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← Back to Users
        </Button>
        <h1 className="text-3xl font-bold">{user.name}'s Activity Dashboard</h1>
        <Badge variant="outline" className="mt-2">{user.email}</Badge>
      </div>

      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={user.plan === 'Pro' ? 'default' : 'secondary'}>
              {user.plan}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">
              Since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(timeAnalytics.totalTimeSpent / 60)}h</div>
            <p className="text-sm text-muted-foreground">Across all modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalSessions}</div>
            <p className="text-sm text-muted-foreground">Training sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume Section */}
      {resume && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{resume.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module-wise Activity */}
      <Tabs defaultValue="english" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="hr">HR Interview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="gd">GD Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="english">
          <Card>
            <CardHeader>
              <CardTitle>English Learning Progress</CardTitle>
              <CardDescription>
                {englishLearning.completedLessons}/{englishLearning.totalLessons} lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={englishLearning.completionPercentage} className="w-full" />
                <p className="text-sm text-muted-foreground mt-1">
                  {englishLearning.completionPercentage.toFixed(1)}% complete
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {englishLearning.lessons.map((lesson: any) => (
                    <TableRow key={lesson.lessonId}>
                      <TableCell>{lesson.lessonId}</TableCell>
                      <TableCell>
                        <Badge variant={lesson.isCompleted ? 'default' : 'secondary'}>
                          {lesson.isCompleted ? 'Completed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{lesson.score || '-'}</TableCell>
                      <TableCell>
                        {lesson.completedAt ? new Date(lesson.completedAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr">
          <Card>
            <CardHeader>
              <CardTitle>HR Interview Sessions</CardTitle>
              <CardDescription>
                {hrInterview.totalSessions} sessions • Avg Score: {hrInterview.averageScore.toFixed(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hrInterview.sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.targetCompany || '-'}</TableCell>
                      <TableCell>{session.role || '-'}</TableCell>
                      <TableCell>{session.aggregateScore || '-'}</TableCell>
                      <TableCell>{session.duration ? `${session.duration}min` : '-'}</TableCell>
                      <TableCell>{new Date(session.startTime).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Mastery Sessions</CardTitle>
              <CardDescription>{technicalMastery.totalSessions} sessions completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicalMastery.sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell>Technical Session</TableCell>
                      <TableCell>{session.aggregateScore || '-'}</TableCell>
                      <TableCell>{session.duration ? `${session.duration}min` : '-'}</TableCell>
                      <TableCell>{new Date(session.startTime).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Tracks Sessions</CardTitle>
              <CardDescription>{companyTracks.totalSessions} company-specific sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyTracks.sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.targetCompany || '-'}</TableCell>
                      <TableCell>{session.role || '-'}</TableCell>
                      <TableCell>{session.aggregateScore || '-'}</TableCell>
                      <TableCell>{session.duration ? `${session.duration}min` : '-'}</TableCell>
                      <TableCell>{new Date(session.startTime).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gd">
          <Card>
            <CardHeader>
              <CardTitle>GD Agent Sessions</CardTitle>
              <CardDescription>
                {gdAgent.totalSessions} group discussion sessions • Avg Score: {gdAgent.averageScore.toFixed(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gdAgent.sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell>GD Session</TableCell>
                      <TableCell>{session.aggregateScore || '-'}</TableCell>
                      <TableCell>{session.duration ? `${session.duration}min` : '-'}</TableCell>
                      <TableCell>{new Date(session.startTime).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}