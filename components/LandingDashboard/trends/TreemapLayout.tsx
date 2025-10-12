import React, { useEffect, useRef, useState } from 'react';
import { TrendWithStats } from '@/types/trends';

export interface TreemapNode {
  name: string;
  value: number;
  trend: TrendWithStats;
}

export interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
  data: TreemapNode;
}

class TreemapLayout {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // Squarified treemap algorithm
  squarify(data: TreemapNode[], x = 0, y = 0, width = this.width, height = this.height): TreemapRect[] {
    if (data.length === 0) return [];

    // Sort data by value descending, but put Others at the end with smallest value
    const sortedData = [...data].sort((a, b) => {
      if (a.trend.id === 'others') return 1; // Others goes to end
      if (b.trend.id === 'others') return -1; // Others goes to end
      return b.value - a.value; // Normal sorting for others
    });
    
    // Give Others the smallest possible value (much smaller than others)
    const othersIndex = sortedData.findIndex(d => d.trend.id === 'others');
    if (othersIndex !== -1) {
      const minRegularValue = Math.min(...sortedData.filter(d => d.trend.id !== 'others').map(d => d.value));
      sortedData[othersIndex].value = Math.max(1, minRegularValue * 0.1); // 10% of smallest regular value
    }
    
    // Normalize values
    const totalValue = sortedData.reduce((sum, d) => sum + d.value, 0);
    if (totalValue === 0) return [];

    const normalizedData = sortedData.map(d => ({
      ...d,
      value: (d.value / totalValue) * width * height
    }));

    return this.squarifyRecursive(normalizedData, x, y, width, height);
  }

  private squarifyRecursive(
    data: TreemapNode[],
    x: number,
    y: number,
    width: number,
    height: number
  ): TreemapRect[] {
    if (data.length === 0) return [];
    if (data.length === 1) {
      return [{
        x,
        y,
        width,
        height,
        data: data[0]
      }];
    }

    // Find the best split
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    
    let bestSplit = 1;
    let bestRatio = Infinity;

    for (let i = 1; i <= data.length; i++) {
      const firstGroupValue = data.slice(0, i).reduce((sum, d) => sum + d.value, 0);
      const ratio = width / height;
      
      if (ratio >= 1) {
        // Wider than tall - split vertically
        const firstWidth = (firstGroupValue / totalValue) * width;
        const avgHeight = height / i;
        const currentRatio = Math.max(firstWidth / avgHeight, avgHeight / firstWidth);
        
        if (currentRatio < bestRatio) {
          bestRatio = currentRatio;
          bestSplit = i;
        }
      } else {
        // Taller than wide - split horizontally
        const firstHeight = (firstGroupValue / totalValue) * height;
        const avgWidth = width / i;
        const currentRatio = Math.max(avgWidth / firstHeight, firstHeight / avgWidth);
        
        if (currentRatio < bestRatio) {
          bestRatio = currentRatio;
          bestSplit = i;
        }
      }
    }

    const firstGroup = data.slice(0, bestSplit);
    const secondGroup = data.slice(bestSplit);
    
    const firstGroupValue = firstGroup.reduce((sum, d) => sum + d.value, 0);
    
    let rects: TreemapRect[] = [];

    if (width >= height) {
      // Split vertically
      const firstWidth = (firstGroupValue / totalValue) * width;
      rects = this.layoutGroup(firstGroup, x, y, firstWidth, height);
      if (secondGroup.length > 0) {
        rects = rects.concat(
          this.squarifyRecursive(secondGroup, x + firstWidth, y, width - firstWidth, height)
        );
      }
    } else {
      // Split horizontally
      const firstHeight = (firstGroupValue / totalValue) * height;
      rects = this.layoutGroup(firstGroup, x, y, width, firstHeight);
      if (secondGroup.length > 0) {
        rects = rects.concat(
          this.squarifyRecursive(secondGroup, x, y + firstHeight, width, height - firstHeight)
        );
      }
    }

    return rects;
  }

  private layoutGroup(
    group: TreemapNode[],
    x: number,
    y: number,
    width: number,
    height: number
  ): TreemapRect[] {
    const totalValue = group.reduce((sum, d) => sum + d.value, 0);
    
    if (width >= height) {
      // Layout horizontally
      let currentX = x;
      return group.map(node => {
        const nodeWidth = Math.max(20, (node.value / totalValue) * width); // Minimum width
        const rect = {
          x: currentX,
          y,
          width: nodeWidth,
          height: Math.max(15, height), // Minimum height
          data: node
        };
        currentX += nodeWidth;
        return rect;
      });
    } else {
      // Layout vertically
      let currentY = y;
      return group.map(node => {
        const nodeHeight = Math.max(15, (node.value / totalValue) * height); // Minimum height
        const rect = {
          x,
          y: currentY,
          width: Math.max(20, width), // Minimum width
          height: nodeHeight,
          data: node
        };
        currentY += nodeHeight;
        return rect;
      });
    }
  }
}

export interface TreemapLayoutProps {
  data: TrendWithStats[];
  width: number;
  height: number;
  children: (rects: TreemapRect[]) => React.ReactNode;
}

const TreemapLayoutComponent: React.FC<TreemapLayoutProps> = ({
  data,
  width: propWidth,
  height: propHeight,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: propWidth || 800, height: propHeight || 384 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Ensure we have valid dimensions
        const newWidth = propWidth > 0 ? propWidth : Math.max(300, rect.width);
        const newHeight = propHeight > 0 ? propHeight : Math.max(200, rect.height);
        
        // Only update if dimensions actually changed to prevent infinite loops
        if (Math.abs(newWidth - dimensions.width) > 1 || Math.abs(newHeight - dimensions.height) > 1) {
          setDimensions({ width: newWidth, height: newHeight });
        }
      }
    };

    // Initial measurement with a small delay to ensure container is rendered
    const timeoutId = setTimeout(updateDimensions, 0);

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the resize updates
      clearTimeout(timeoutId);
      setTimeout(updateDimensions, 50);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [propWidth, propHeight, dimensions.width, dimensions.height]);

  const treemapNodes: TreemapNode[] = data.map(trend => ({
    name: trend.name,
    value: trend.tweet_volume || 1, // Use 1 for null values to still show them
    trend
  }));

  const layout = new TreemapLayout(dimensions.width, dimensions.height);
  const rects = layout.squarify(treemapNodes);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {children(rects)}
    </div>
  );
};

export default TreemapLayoutComponent;
