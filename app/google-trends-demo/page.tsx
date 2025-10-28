import React from "react";
import GoogleTrendsTable from "@/components/GoogleTrendsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GoogleTrendsDemo() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Google Trends Dashboard</h1>
        <p className="text-gray-600 text-lg">
          ติดตามเทรนด์ที่กำลังมาแรงในประเทศไทยแบบเรียลไทม์จาก Google Trends
        </p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>เกี่ยวกับข้อมูล</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">ช่วงเวลา</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><strong>4H:</strong> เทรนด์ล่าสุด 4 ชั่วโมง</li>
                  <li><strong>24H:</strong> เทรนด์ในวันนี้</li>
                  <li><strong>48H:</strong> เทรนด์ 2 วันที่ผ่านมา</li>
                  <li><strong>7D:</strong> เทรนด์สัปดาห์นี้</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">หมวดหมู่</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs mr-2">VIRAL</span> &gt;1M การค้นหา</li>
                  <li><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mr-2">HIGH</span> 100K-1M การค้นหา</li>
                  <li><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs mr-2">MEDIUM</span> 10K-100K การค้นหา</li>
                  <li><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs mr-2">LOW</span> &lt;10K การค้นหา</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GoogleTrendsTable limit={20} showMetrics={true} />
    </div>
  );
}
