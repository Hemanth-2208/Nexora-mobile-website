'use client';

import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from "recharts";

interface StockChartItem {
  name: string;
  value: number;
  color: string;
}

interface ReviewChartItem {
  rating: string;
  count: number;
}

interface TimelineChartItem {
  date: string;
  count: number;
}

interface ChartsProps {
  stockData: StockChartItem[];
  reviewData: ReviewChartItem[];
  mobileTimelineData: TimelineChartItem[];
}

export default function Charts({ stockData, reviewData, mobileTimelineData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 1. Stock Distribution Pie Chart (lg:col-span-4) */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.002)]">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider mb-6">
          Stock Distribution
        </h3>
        
        <div className="h-64 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 mt-4 border-t border-zinc-50 dark:border-zinc-800/80 pt-4">
          {stockData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-55">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Reviews Distribution Bar Chart (lg:col-span-4) */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.002)]">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider mb-6">
          Reviews Star Ratings
        </h3>

        <div className="h-64 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="rating" 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Timeline Added Area Chart (lg:col-span-4) */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.002)]">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider mb-6">
          Recently Added Timeline
        </h3>

        <div className="h-64 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mobileTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#888888" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
