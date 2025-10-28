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
//   BarChart3,
//   ExternalLink,
//   Clock,
//   Hash,
//   Activity,
// } from "lucide-react";
// import { TrendWithStats } from "@/types/trends";
// import { formatTweetVolume } from "@/lib/utils/mockData";
// import {
//   Bar,
//   BarChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Cell,
// } from "recharts";

// interface TrendDetailsDialogProps {
//   trend: TrendWithStats | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const TrendDetailsDialog: React.FC<TrendDetailsDialogProps> = ({
//   trend,
//   isOpen,
//   onClose,
// }) => {
//   if (!trend || trend.id === "others") return null;

//   // Mock data for 24-hour chart
//   const generateHourlyData = () => {
//     const hours = [];
//     const baseVolume = trend.tweet_volume || 1000;

//     for (let i = 23; i >= 0; i--) {
//       const hour = new Date();
//       hour.setHours(hour.getHours() - i);

//       const variation =
//         (Math.sin((i / 24) * Math.PI * 2) + Math.random() - 0.5) * 0.3;
//       const volume = Math.max(0, Math.round(baseVolume * (1 + variation)));

//       hours.push({
//         time: hour.getHours().toString().padStart(2, "0") + ":00",
//         volume,
//         hour: hour.getHours(),
//       });
//     }
//     return hours;
//   };

//   const hourlyData = generateHourlyData();

//   const getTrendIcon = () => {
//     if (trend.volume_change_24h === undefined)
//       return <BarChart3 className="w-4 h-4" />;
//     if (trend.volume_change_24h > 0) return <TrendingUp className="w-4 h-4" />;
//     if (trend.volume_change_24h < 0)
//       return <TrendingDown className="w-4 h-4" />;
//     return <BarChart3 className="w-4 h-4" />;
//   };

//   const getChangeColor = () => {
//     if (trend.volume_change_24h === undefined)
//       return {
//         text: "text-gray-500",
//         bg: "bg-gray-500/10",
//         border: "border-gray-500/20",
//       };
//     if (trend.volume_change_24h > 10)
//       return {
//         text: "text-green-500",
//         bg: "bg-green-500/10",
//         border: "border-green-500/20",
//       };
//     if (trend.volume_change_24h > 0)
//       return {
//         text: "text-green-400",
//         bg: "bg-green-400/10",
//         border: "border-green-400/20",
//       };
//     if (trend.volume_change_24h > -10)
//       return {
//         text: "text-red-400",
//         bg: "bg-red-400/10",
//         border: "border-red-400/20",
//       };
//     return {
//       text: "text-red-500",
//       bg: "bg-red-500/10",
//       border: "border-red-500/20",
//     };
//   };

//   const getBarColor = (volume: number) => {
//     const maxVolume = Math.max(...hourlyData.map((d) => d.volume));
//     const intensity = volume / maxVolume;

//     if (
//       trend.volume_change_24h === undefined ||
//       trend.volume_change_24h === 0
//     ) {
//       return `hsl(210, ${Math.round(20 + intensity * 30)}%, ${Math.round(
//         40 + intensity * 20
//       )}%)`;
//     } else if (trend.volume_change_24h > 0) {
//       return `hsl(142, ${Math.round(50 + intensity * 20)}%, ${Math.round(
//         45 + intensity * 15
//       )}%)`;
//     } else {
//       return `hsl(0, ${Math.round(50 + intensity * 20)}%, ${Math.round(
//         45 + intensity * 15
//       )}%)`;
//     }
//   };

//   interface TooltipProps {
//     active?: boolean;
//     payload?: Array<{ value: number }>;
//     label?: string;
//   }

//   const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-md px-3 py-2 shadow-xl">
//           <p className="text-gray-300 font-medium text-xs mb-1">{label}</p>
//           <p className="text-white font-bold text-sm">
//             {formatTweetVolume(payload[0].value)} tweets
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const changeColors = getChangeColor();

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="w-screen h-screen max-w-none max-h-none bg-gray-50 dark:bg-gray-950 backdrop-blur-xl border-0 text-gray-900 dark:text-white p-0 rounded-none md:w-[95vw] md:h-[95vh] md:max-w-6xl md:rounded-lg md:border md:border-gray-200 dark:md:border-gray-800/50 shadow-2xl">
//         <div className="flex flex-col h-full w-full">
//           {/* Header - Fixed */}
//           <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800/50 flex-shrink-0 bg-white dark:bg-gray-900">
//             <DialogTitle className="flex items-center justify-between gap-3 flex-wrap">
//               <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//                 <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
//                 <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
//                   {trend.name}
//                 </span>
//                 <Badge
//                   variant="outline"
//                   className="bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 flex-shrink-0 font-semibold"
//                 >
//                   #{trend.rank}
//                 </Badge>
//               </div>
//             </DialogTitle>
//           </DialogHeader>

//           {/* Main Content - Scrollable but organized */}
//           <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6">
//             <div className="space-y-4">
//               {/* Stats Grid - 3 columns */}
//               <div className="grid grid-cols-3 gap-2 sm:gap-3">
//                 {/* Volume Card */}
//                 <Card className="bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/50 shadow-lg">
//                   <CardHeader className="pb-2 pt-2 sm:pt-3 px-2 sm:px-4">
//                     <CardTitle className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs font-medium">
//                       <Activity className="w-3 h-3 flex-shrink-0" />
//                       <span className="truncate">Volume</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="px-2 sm:px-4 pb-2 sm:pb-3">
//                     <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
//                       {formatTweetVolume(trend.tweet_volume)}
//                     </div>
//                     <div className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-500 truncate">
//                       searches 24h
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Change Card */}
//                 <Card
//                   className={`bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border shadow-lg ${changeColors.border}`}
//                 >
//                   <CardHeader className="pb-2 pt-2 sm:pt-3 px-2 sm:px-4">
//                     <CardTitle className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs font-medium">
//                       <Clock className="w-3 h-3 flex-shrink-0" />
//                       <span className="truncate">24h Change</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="px-2 sm:px-4 pb-2 sm:pb-3">
//                     <div
//                       className={`flex items-center gap-1 text-lg sm:text-2xl font-bold ${changeColors.text}`}
//                     >
//                       {getTrendIcon()}
//                       {trend.volume_change_24h !== undefined ? (
//                         <span className="truncate">
//                           {trend.volume_change_24h > 0 ? "+" : ""}
//                           {trend.volume_change_24h.toFixed(1)}%
//                         </span>
//                       ) : (
//                         <span>--</span>
//                       )}
//                     </div>
//                     <div className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-500">
//                       change
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Percentage Card */}
//                 <Card className="bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/50 shadow-lg">
//                   <CardHeader className="pb-2 pt-2 sm:pt-3 px-2 sm:px-4">
//                     <CardTitle className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs font-medium">
//                       <BarChart3 className="w-3 h-3 flex-shrink-0" />
//                       <span className="truncate">Market</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="px-2 sm:px-4 pb-2 sm:pb-3">
//                     <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
//                       {trend.percentage.toFixed(2)}%
//                     </div>
//                     <div className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-500 truncate">
//                       of trends
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Chart Section */}
//               <Card className="bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/50 shadow-lg">
//                 <CardHeader className="pb-2 pt-2 sm:pt-3 px-2 sm:px-4">
//                   <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2 text-xs sm:text-sm">
//                     <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
//                     24 Hour Volume Trend
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent
//                   className="px-2 sm:px-4 pb-2 sm:pb-3"
//                   style={{ height: "220px" }}
//                 >
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={hourlyData}
//                       margin={{ top: 5, right: 5, left: -20, bottom: 20 }}
//                     >
//                       <XAxis
//                         dataKey="time"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6B7280", fontSize: 9 }}
//                         interval={3}
//                       />
//                       <YAxis
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6B7280", fontSize: 9 }}
//                         tickFormatter={(value) => formatTweetVolume(value)}
//                         width={45}
//                       />
//                       <Tooltip content={<CustomTooltip />} />
//                       <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
//                         {hourlyData.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={getBarColor(entry.volume)}
//                           />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>

//               {/* Category and Additional Info */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4 bg-gray-100/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-200/40 dark:border-gray-800/30">
//                 <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 text-[10px] sm:text-xs w-full">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     <span className="text-gray-600 dark:text-gray-500 font-medium">Updated:</span>
//                     <span className="text-gray-500 dark:text-gray-400">
//                       {new Date().toLocaleTimeString()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* External Link */}
//                 <a
//                   href={trend.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-md transition-colors font-medium text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0"
//                 >
//                   <span>View on Twitter</span>
//                   <ExternalLink className="w-3 h-3" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TrendDetailsDialog;
