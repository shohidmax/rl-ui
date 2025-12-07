
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Sector } from 'recharts';
import { BarChart, Users, ShoppingCart, Activity, ArrowRight, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock Data Generation
const generateLast30DaysData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: Math.floor(Math.random() * (1500 - 500 + 1)) + 500,
    });
  }
  return data;
};

const trafficSourcesData = [
  { source: 'Facebook', visitors: 4500, fill: 'hsl(var(--chart-1))' },
  { source: 'Google', visitors: 3200, fill: 'hsl(var(--chart-2))' },
  { source: 'Direct', visitors: 2100, fill: 'hsl(var(--chart-3))' },
  { source: 'Instagram', visitors: 1800, fill: 'hsl(var(--chart-4))' },
  { source: 'Others', visitors: 900, fill: 'hsl(var(--chart-5))' },
];

const topPagesData = [
  { page: '/', name: 'Homepage', views: 12500, unique: 8900, avgTime: '2m 15s' },
  { page: '/product/elegant-floral-three-piece', name: 'Elegant Floral Three-Piece', views: 9800, unique: 7200, avgTime: '3m 45s' },
  { page: '/checkout', name: 'Checkout', views: 4500, unique: 3100, avgTime: '1m 30s' },
  { page: '/category/hijab', name: 'Hijab Category', views: 7600, unique: 5400, avgTime: '2m 05s' },
  { page: '/product/classic-cotton-three-piece', name: 'Classic Cotton Three-Piece', views: 6500, unique: 4800, avgTime: '3m 10s' },
];

const topLocationsData = [
    { location: 'Dhaka', visitors: '45%', flag: '🇧🇩' },
    { location: 'Chittagong', visitors: '25%', flag: '🇧🇩' },
    { location: 'Sylhet', visitors: '15%', flag: '🇧🇩' },
    { location: 'New York', visitors: '5%', flag: '🇺🇸' },
    { location: 'London', visitors: '4%', flag: '🇬🇧' },
];


const trafficChartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const sourcesChartConfig = {
  visitors: {
    label: "Visitors",
  },
  Facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-1))",
  },
  Google: {
    label: "Google",
    color: "hsl(var(--chart-2))",
  },
  Direct: {
    label: "Direct",
    color: "hsl(var(--chart-3))",
  },
  Instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-4))",
  },
  Others: {
    label: "Others",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig


export default function AdminAnalyticsPage() {
  const [liveUsers, setLiveUsers] = useState(0);
  const trafficData = useMemo(() => generateLast30DaysData(), []);

  useState(() => {
    const updateLiveUsers = () => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 21) - 10;
        const newUsers = prev + change;
        return newUsers < 20 ? 20 : newUsers > 150 ? 150 : newUsers;
      });
    };
    const interval = setInterval(updateLiveUsers, 2500);
    updateLiveUsers();
    return () => clearInterval(interval);
  });
  

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Analytics Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,420</div>
            <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43,980</div>
            <p className="text-xs text-muted-foreground">+12.1% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">+8.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                {liveUsers}
            </div>
            <p className="text-xs text-muted-foreground">Users currently on site</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitors for the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={trafficChartConfig} className="h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={trafficData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="visitors"
                  type="natural"
                  fill="var(--color-visitors)"
                  fillOpacity={0.4}
                  stroke="var(--color-visitors)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
         <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             <ChartContainer
                config={sourcesChartConfig}
                className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={trafficSourcesData}
                  dataKey="visitors"
                  nameKey="source"
                  innerRadius={60}
                  strokeWidth={5}
                >
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="source" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
            <CardDescription>Your most popular pages by views.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Unique Visitors</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPagesData.map((page) => (
                  <TableRow key={page.page}>
                    <TableCell>
                      <Link href={page.page} className="font-medium hover:underline flex items-center gap-2" target="_blank">
                        {page.name} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right">{page.unique.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{page.avgTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Visitor distribution by city.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {topLocationsData.map((loc) => (
                        <div key={loc.location} className="flex items-center">
                            <span className="text-xl mr-3">{loc.flag}</span>
                            <span className="font-medium">{loc.location}</span>
                            <Badge variant="secondary" className="ml-auto">{loc.visitors}</Badge>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
