interface RankIconProps {
  index: number;
}

export const RankIcon = ({ index }: RankIconProps) => {
  if (index === 0)
    return (
      <span className="text-xl sm:text-2xl font-bold text-yellow-500">1</span>
    );
  if (index === 1)
    return (
      <span className="text-xl sm:text-2xl font-bold text-gray-400">2</span>
    );
  if (index === 2)
    return (
      <span className="text-xl sm:text-2xl font-bold text-amber-600">3</span>
    );
  return (
    <span className="text-base sm:text-lg font-medium text-muted-foreground">
      {index + 1}
    </span>
  );
};
