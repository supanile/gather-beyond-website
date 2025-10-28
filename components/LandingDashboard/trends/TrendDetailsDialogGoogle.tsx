// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   TrendingUp,
//   TrendingDown,
//   ExternalLink,
//   Search,
//   Globe,
//   Calendar,
//   Users,
// } from "lucide-react";
// import { TrendWithStats } from "@/types/trends";
// import { formatTweetVolume } from "@/lib/utils/mockData";
// import {
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Area,
//   AreaChart,
// } from "recharts";

// interface TrendDetailsDialogGoogleProps {
//   trend: TrendWithStats | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const TrendDetailsDialogGoogle: React.FC<TrendDetailsDialogGoogleProps> = ({
//   trend,
//   isOpen,
//   onClose,
// }) => {
//   if (!trend || trend.id === "others") return null;

//   // Mock data for Google Trends style chart
//   const generateTrendsData = () => {
//     const days = [];
//     const baseVolume = trend.tweet_volume || 1000;

//     for (let i = 29; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);

//       // Create more realistic Google Trends style data
//       const dayOfWeek = date.getDay();
//       const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
//       // Base trend with some realistic patterns
//       let trendMultiplier = 1;
//       if (i < 7) trendMultiplier = 1.2; // Recent spike
//       if (isWeekend) trendMultiplier *= 0.8; // Lower on weekends
      
//       const noise = (Math.random() - 0.5) * 0.4;
//       const seasonality = Math.sin((i / 30) * Math.PI * 2) * 0.2;
      
//       const normalizedValue = Math.max(0, Math.min(100, 
//         50 + (seasonality + noise) * 30 + (trendMultiplier - 1) * 20
//       ));

//       days.push({
//         date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//         fullDate: date.toISOString().split('T')[0],
//         value: Math.round(normalizedValue),
//         searches: Math.round(baseVolume * (normalizedValue / 100)),
//       });
//     }
//     return days;
//   };

//   const trendsData = generateTrendsData();
//   const maxValue = Math.max(...trendsData.map(d => d.value));
//   const avgValue = trendsData.reduce((sum, d) => sum + d.value, 0) / trendsData.length;

//   const getTrendDirection = () => {
//     const recent = trendsData.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7;
//     const previous = trendsData.slice(-14, -7).reduce((sum, d) => sum + d.value, 0) / 7;
//     return recent - previous;
//   };

//   const trendDirection = getTrendDirection();

//   interface GoogleTooltipProps {
//     active?: boolean;
//     payload?: Array<{ value: number; payload: { fullDate: string; value: number; searches: number } }>;
//     label?: string;
//   }

//   const GoogleTooltip = ({ active, payload }: GoogleTooltipProps) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-lg">
//           <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{data.fullDate}</p>
//           <p className="text-gray-900 dark:text-white font-semibold">
//             Search Interest: {data.value}
//           </p>
//           <p className="text-gray-600 dark:text-gray-400 text-xs">
//             ~{formatTweetVolume(data.searches)} searches
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="w-screen h-screen max-w-none max-h-none bg-white dark:bg-gray-950 border-0 p-0 rounded-none md:w-[95vw] md:h-[95vh] md:max-w-7xl md:rounded-lg md:border md:border-gray-200 dark:md:border-gray-800">
//         <div className="flex flex-col h-full w-full">
//           {/* Google Trends Style Header */}
//           <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
//             <DialogTitle className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <Search className="w-6 h-6 text-blue-600" />
//                   <span className="text-2xl font-normal text-gray-900 dark:text-white">
//                     {trend.name}
//                   </span>
//                 </div>
//                 <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
//                   Trending #{trend.rank}
//                 </Badge>
//               </div>
//             </DialogTitle>
//           </DialogHeader>

//           {/* Main Content */}
//           <div className="flex-1 overflow-y-auto px-6 py-6">
//             <div className="max-w-6xl mx-auto space-y-8">
              
//               {/* Search Interest Chart */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-medium text-gray-900 dark:text-white">
//                     Search Interest Over Time 
//                   </h2>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                     <Calendar className="w-4 h-4" />
//                     Last 30 days
//                   </div>
//                 </div>
                
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-6">
//                     <div className="h-80 w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart data={trendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                           <defs>
//                             <linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                               <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                             </linearGradient>
//                           </defs>
//                           <XAxis 
//                             dataKey="date" 
//                             axisLine={false}
//                             tickLine={false}
//                             tick={{ fill: '#6B7280', fontSize: 12 }}
//                             interval="preserveStartEnd"
//                           />
//                           <YAxis 
//                             axisLine={false}
//                             tickLine={false}
//                             tick={{ fill: '#6B7280', fontSize: 12 }}
//                             domain={[0, 100]}
//                           />
//                           <Tooltip content={<GoogleTooltip />} />
//                           <Area
//                             type="monotone"
//                             dataKey="value"
//                             stroke="#3B82F6"
//                             strokeWidth={2}
//                             fill="url(#searchGradient)"
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </div>
//                     <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
//                       <span>Numbers represent search interest relative to the highest point on the chart.</span>
//                       <span>Peak: {maxValue}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Insights Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Search Volume */}
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base font-medium">
//                       <Search className="w-5 h-5 text-blue-600" />
//                       Search Volume
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="text-3xl font-bold text-gray-900 dark:text-white">
//                         {formatTweetVolume(trend.tweet_volume)}
//                       </div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         Average daily searches
//                       </div>
//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                         <div 
//                           className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${(avgValue / 100) * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Trend Direction */}
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base font-medium">
//                       {trendDirection > 0 ? (
//                         <TrendingUp className="w-5 h-5 text-green-600" />
//                       ) : (
//                         <TrendingDown className="w-5 h-5 text-red-600" />
//                       )}
//                       Trend Direction
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className={`text-3xl font-bold ${
//                         trendDirection > 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {trendDirection > 0 ? '+' : ''}{trendDirection.toFixed(1)}
//                       </div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         7-day change in interest
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <span className={`px-2 py-1 rounded ${
//                           trendDirection > 0 
//                             ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
//                             : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
//                         }`}>
//                           {trendDirection > 0 ? 'Rising' : 'Declining'}
//                         </span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Global Reach */}
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base font-medium">
//                       <Globe className="w-5 h-5 text-purple-600" />
//                       Global Interest
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="text-3xl font-bold text-gray-900 dark:text-white">
//                         {trend.percentage.toFixed(1)}%
//                       </div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         Of total search volume
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Users className="w-4 h-4 text-gray-400" />
//                         <span className="text-gray-600 dark:text-gray-400">
//                           Worldwide trending
//                         </span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Related Information */}
//               <Card className="border-gray-200 dark:border-gray-800">
//                 <CardHeader>
//                   <CardTitle className="text-gray-900 dark:text-white">
//                     Trend Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <h4 className="font-medium text-gray-700 dark:text-gray-300">Search Details</h4>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600 dark:text-gray-400">Peak Interest:</span>
//                           <span className="text-gray-900 dark:text-white font-medium">{maxValue}/100</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600 dark:text-gray-400">Average Interest:</span>
//                           <span className="text-gray-900 dark:text-white font-medium">{avgValue.toFixed(1)}/100</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600 dark:text-gray-400">Trend Rank:</span>
//                           <span className="text-gray-900 dark:text-white font-medium">#{trend.rank}</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-3">
//                       <h4 className="font-medium text-gray-700 dark:text-gray-300">Data Source</h4>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
//                           <span className="text-gray-900 dark:text-white">{new Date().toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600 dark:text-gray-400">Region:</span>
//                           <span className="text-gray-900 dark:text-white">Worldwide</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <a
//                       href={trend.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
//                     >
//                       <span>Explore on Google Trends</span>
//                       <ExternalLink className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TrendDetailsDialogGoogle;
