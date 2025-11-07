import {
  GoogleTrendItem,
  GoogleTrendsData,
  GoogleTrendWithStats,
  GoogleTrendsMetrics,
  GoogleTrendsInsights,
} from "@/types/googleTrends";
import { LocationFilter } from "@/types/trends";
import { getLocationConfig } from "@/config/locations";

// Mock Google Trends data based on provided CSV files
const mockGoogleTrends4H: GoogleTrendItem[] = [
  {
    term: "เช็คสิทธิ์โครงการคนละครึ่งพลัส",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เช็คสิทธิ์โครงการคนละครึ่งพลัส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8A%E0%B9%87%E0%B8%84%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B8%99%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%AA&geo=TH&hl=th"
  },
  {
    term: "warriors vs nuggets",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "warriors vs nuggets",
    exploreLink: "https://trends.google.com/trends/explore?q=warriors%20vs%20nuggets&geo=TH&hl=th"
  },
  {
    term: "ดูบาสสด",
    searchVolume: "2K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ดูบาสสด,เฟส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B9%E0%B8%9A%E0%B8%B2%E0%B8%AA%E0%B8%AA%E0%B8%94&geo=TH&hl=th"
  },
  {
    term: "เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 16",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 16",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%84%E0%B8%B8%E0%B8%93%20%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%81%E0%B8%B1%E0%B8%9A%20%E0%B8%AD%E0%B8%B5%20%E0%B8%99%E0%B8%B2%E0%B8%87%20%E0%B8%84%E0%B9%8D%E0%B8%B2%20%E0%B8%94%E0%B8%A7%E0%B8%87%20ep.%2016&geo=TH&hl=th"
  },
  {
    term: "มาดามแป้ง",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มาดามแป้ง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%9B%E0%B9%89%E0%B8%87&geo=TH&hl=th"
  },
  {
    term: "classroom",
    searchVolume: "2K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "classroom",
    exploreLink: "https://trends.google.com/trends/explore?q=classroom&geo=TH&hl=th"
  },
  {
    term: "streaming",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "streaming",
    exploreLink: "https://trends.google.com/trends/explore?q=streaming&geo=TH&hl=th"
  },
  {
    term: "f",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "f",
    exploreLink: "https://trends.google.com/trends/explore?q=f&geo=TH&hl=th"
  },
  {
    term: "กรรมกรข่าวคุยนอกจอ",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "กรรมกรข่าวคุยนอกจอ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%81%E0%B8%A3%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%84%E0%B8%B8%E0%B8%A2%E0%B8%99%E0%B8%AD%E0%B8%81%E0%B8%88%E0%B8%AD&geo=TH&hl=th"
  },
  {
    term: "lec",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th"
  },
  {
    term: "ธนาคารออมสิน",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารออมสิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B8%B4%E0%B8%99&geo=TH&hl=th"
  },
  {
    term: "bbl",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "bbl",
    exploreLink: "https://trends.google.com/trends/explore?q=bbl&geo=TH&hl=th"
  },
  {
    term: "ราคาน้ำมันวันนี้",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ราคาน้ำมันวันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th"
  }
];

const mockGoogleTrends24H: GoogleTrendItem[] = [
  {
    term: "คายา พบ บีจีพียู",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "คายา พบ บีจีพียู,บีจี,kaya fc vs bg pathum united,บีจีปทุมยูไนเต็ด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%B2%E0%B8%A2%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%9A%E0%B8%B5%E0%B8%88%E0%B8%B5%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%B9&geo=TH&hl=th"
  },
  {
    term: "โก อะเฮด อีเกิ้ลส์ พบ แอสตันวิลลา",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "โก อะเฮด อีเกิ้ลส์ พบ แอสตันวิลลา,ดูบาสสด,ยูโรป้าลีก,ยูฟ่ายูโรปาลีก,เฟส,แอสตันวิลล่า,แอสตัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%81%20%E0%B8%AD%E0%B8%B0%E0%B9%80%E0%B8%AE%E0%B8%94%20%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B9%89%E0%B8%A5%E0%B8%AA%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%AD%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "คริสตัลพาเลซ พบ เออีเค ลาร์นาก้า",
    searchVolume: "10K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "คริสตัลพาเลซ พบ เออีเค ลาร์นาก้า,ยูโรปาคอนเฟอเรนซ์ลีก,คริสตัลพาเลซ,ยูฟ่าคอนเฟอเรนซ์ลีก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%A3%E0%B8%B4%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%A5%E0%B8%9E%E0%B8%B2%E0%B9%80%E0%B8%A5%E0%B8%8B%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%AD%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%84%20%E0%B8%A5%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "น้องวินภาสวินเสียชีวิต",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "น้องวินภาสวินเสียชีวิต,น้องวินภาสวินป่วยเป็นอะไร,วินภาสวิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%AA%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95&geo=TH&hl=th"
  },
  {
    term: "แบงค็อก ยูไนเต็ด พบ ไลอ้อน ซิตี้ เซเลอร์ส",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "แบงค็อก ยูไนเต็ด พบ ไลอ้อน ซิตี้ เซเลอร์ส,แบงค็อก ยูไนเต็ด,แบงค็อกยูไนเต็ด,bangkok united",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%9A%E0%B8%87%E0%B8%84%E0%B9%87%E0%B8%AD%E0%B8%81%20%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94%20%E0%B8%9E%E0%B8%9A%20%E0%B9%84%E0%B8%A5%E0%B8%AD%E0%B9%89%E0%B8%AD%E0%B8%99%20%E0%B8%8B%E0%B8%B4%E0%B8%95%E0%B8%B5%E0%B9%89%20%E0%B9%80%E0%B8%8B%E0%B9%80%E0%B8%A5%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA&geo=TH&hl=th"
  },
  {
    term: "พลอยเฌอมาลย์",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "พลอยเฌอมาลย์,พลอย เฌอมาลย์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A5%E0%B8%AD%E0%B8%A2%E0%B9%80%E0%B8%8C%E0%B8%AD%E0%B8%A1%E0%B8%B2%E0%B8%A5%E0%B8%A2%E0%B9%8C&geo=TH&hl=th"
  },
  {
    term: "เป๋าตังคนละครึ่งพลัสสิทธิ",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "เป๋าตังคนละครึ่งพลัสสิทธิ,เช็คสิทธิ์โครงการคนละครึ่งพลัส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9B%E0%B9%8B%E0%B8%B2%E0%B8%95%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%99%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%AA%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4&geo=TH&hl=th"
  },
  {
    term: "คุณพี่กับอีนางคําดวง ep 16",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 00 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "คุณพี่กับอีนางคําดวง ep 16,เจ้าคุณพี่กับอีนางคําดวง ep. 16,เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 16,เจ้าคุณพี่ ep 15,เจ้าคุณพี่กับอีนางคําดวง ep. ล่าสุด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B5%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8D%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%87%20ep%2016&geo=TH&hl=th"
  },
  {
    term: "ทายาทหมายเลข 1 ep 20",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "ทายาทหมายเลข 1 ep 20,ทายาท หมายเลข 1 ep 20,ทายาทหมายเลข 1 ล่าสุด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%B2%E0%B8%A2%E0%B8%B2%E0%B8%97%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%A5%E0%B8%82%201%20ep%2020&geo=TH&hl=th"
  },
  {
    term: "warriors vs nuggets",
    searchVolume: "500",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "warriors vs nuggets",
    exploreLink: "https://trends.google.com/trends/explore?q=warriors%20vs%20nuggets&geo=TH&hl=th"
  },
  {
    term: "คอนเสิร์ต blackpink",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "คอนเสิร์ต blackpink,blackpink",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%20blackpink&geo=TH&hl=th"
  },
  {
    term: "เฟเยนูร์ด",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เฟเยนูร์ด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9F%E0%B9%80%E0%B8%A2%E0%B8%99%E0%B8%B9%E0%B8%A3%E0%B9%8C%E0%B8%94&geo=TH&hl=th"
  },
  {
    term: "classroom",
    searchVolume: "2K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "classroom",
    exploreLink: "https://trends.google.com/trends/explore?q=classroom&geo=TH&hl=th"
  },
  {
    term: "กัน จอมพลัง",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "กัน จอมพลัง,กรรมการมูลนิธิกันจอมพลัง,ข่าวกันจอมพลังล่าสุด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%88%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%87&geo=TH&hl=th"
  },
  {
    term: "มาดามแป้ง",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "",
    relatedTerms: "มาดามแป้ง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%9B%E0%B9%89%E0%B8%87&geo=TH&hl=th"
  },
  {
    term: "23 ตุลาคมวันปิยมหาราชธนาคารหยุดไหม",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "23 ตุลาคมวันปิยมหาราชธนาคารหยุดไหม",
    exploreLink: "https://trends.google.com/trends/explore?q=23%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AB%E0%B8%A2%E0%B8%B8%E0%B8%94%E0%B9%84%E0%B8%AB%E0%B8%A1&geo=TH&hl=th"
  },
  {
    term: "เฟิร์นสุชาดาผู้ประกาศข่าว",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เฟิร์นสุชาดาผู้ประกาศข่าว,กรรมกรข่าวคุยนอกจอ,ช่อง3,เฟิร์นสุชาดานิ่มนวล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7&geo=TH&hl=th"
  },
  {
    term: "ตรวจหวยลาวงวด 22 ตุลาคม 2568",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ตรวจหวยลาวงวด 22 ตุลาคม 2568,ผลหวยลาว 22 ตุลาคม 2568",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B8%A5%E0%B8%B2%E0%B8%A7%E0%B8%87%E0%B8%A7%E0%B8%94%2022%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th"
  },
  {
    term: "ลีลล์",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ลีลล์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B5%E0%B8%A5%E0%B8%A5%E0%B9%8C&geo=TH&hl=th"
  },
  {
    term: "nottm forest vs porto",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "nottm forest vs porto,europa league",
    exploreLink: "https://trends.google.com/trends/explore?q=nottm%20forest%20vs%20porto&geo=TH&hl=th"
  },
  {
    term: "โบโลญญ่า",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "โบโลญญ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "โรม่า",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "โรม่า,ฟอเรสต์,น็อตติ้งแฮม ฟอเรสต์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B9%88%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "go ahead eagles vs aston villa",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "go ahead eagles vs aston villa,aston villa",
    exploreLink: "https://trends.google.com/trends/explore?q=go%20ahead%20eagles%20vs%20aston%20villa&geo=TH&hl=th"
  },
  {
    term: "เซลติก",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลติก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%81&geo=TH&hl=th"
  },
  {
    term: "ไฟร์บวร์ก",
    searchVolume: "500",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฟร์บวร์ก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9F%E0%B8%A3%E0%B9%8C%E0%B8%9A%E0%B8%A7%E0%B8%A3%E0%B9%8C%E0%B8%81&geo=TH&hl=th"
  },
  {
    term: "เอฟซีเอสบี พบ โบโลญญ่า",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "เอฟซีเอสบี พบ โบโลญญ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%E0%B9%80%E0%B8%AD%E0%B8%AA%E0%B8%9A%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "streaming",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "streaming",
    exploreLink: "https://trends.google.com/trends/explore?q=streaming&geo=TH&hl=th"
  },
  {
    term: "บราก้า",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "บราก้า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%A3%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "f",
    searchVolume: "500",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "f",
    exploreLink: "https://trends.google.com/trends/explore?q=f&geo=TH&hl=th"
  },
  {
    term: "lec",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th"
  },
  {
    term: "india vs australia",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "india vs australia,ind vs aus",
    exploreLink: "https://trends.google.com/trends/explore?q=india%20vs%20australia&geo=TH&hl=th"
  },
  {
    term: "มัลโม่",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "มัลโม่",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B9%82%E0%B8%A1%E0%B9%88&geo=TH&hl=th"
  },
  {
    term: "ธนาคารออมสิน",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารออมสิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B8%B4%E0%B8%99&geo=TH&hl=th"
  },
  {
    term: "นีซ",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "นีซ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B8%B5%E0%B8%8B&geo=TH&hl=th"
  },
  {
    term: "bbl",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "bbl",
    exploreLink: "https://trends.google.com/trends/explore?q=bbl&geo=TH&hl=th"
  },
  {
    term: "สภาพอากาศวันนี้",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "สภาพอากาศวันนี้,อากาศวันนี้,อากาศ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th"
  },
  {
    term: "ช่องวัน",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่องวัน,ช่องวัน 31",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B1%E0%B8%99&geo=TH&hl=th"
  },
  {
    term: "เซลต้า บีโก้",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลต้า บีโก้,เซลต้าบีโก้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B9%89%E0%B8%B2%20%E0%B8%9A%E0%B8%B5%E0%B9%82%E0%B8%81%E0%B9%89&geo=TH&hl=th"
  },
  {
    term: "มุกดา",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "มุกดา,เข้ม หัสวีร์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B8%E0%B8%81%E0%B8%94%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "ทางด่วนฟรี 23 ตุลาคม",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ทางด่วนฟรี 23 ตุลาคม",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%94%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%9F%E0%B8%A3%E0%B8%B5%2023%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1&geo=TH&hl=th"
  },
  {
    term: "ราคาน้ำมันวันนี้",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ราคาน้ำมันวันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th"
  },
  {
    term: "afc champions league 2",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "afc champions league 2",
    exploreLink: "https://trends.google.com/trends/explore?q=afc%20champions%20league%202&geo=TH&hl=th"
  },
  {
    term: "ฟุตบอลลิเวอร์พูล",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 00 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ฟุตบอลลิเวอร์พูล,ช่อง3 ออนไลน์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5&geo=TH&hl=th"
  },
  {
    term: "crystal palace vs aek larnaca",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "crystal palace vs aek larnaca",
    exploreLink: "https://trends.google.com/trends/explore?q=crystal%20palace%20vs%20aek%20larnaca&geo=TH&hl=th"
  },
  {
    term: "ต้าห์อู๋",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ต้าห์อู๋",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B9%8C%E0%B8%AD%E0%B8%B9%E0%B9%8B&geo=TH&hl=th"
  },
  {
    term: "แม่ซื้อ",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 00 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "แม่ซื้อ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD&geo=TH&hl=th"
  },
  {
    term: "anthony hudson",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "anthony hudson",
    exploreLink: "https://trends.google.com/trends/explore?q=anthony%20hudson&geo=TH&hl=th"
  },
  {
    term: "สแกมเมอร์คืออะไร",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "สแกมเมอร์คืออะไร",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B9%81%E0%B8%81%E0%B8%A1%E0%B9%80%E0%B8%A1%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3&geo=TH&hl=th"
  },
  {
    term: "สุกี้ตี๋น้อย",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "สุกี้ตี๋น้อย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%B8%E0%B8%81%E0%B8%B5%E0%B9%89%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2&geo=TH&hl=th"
  },
  {
    term: "asian youth games 2025",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "asian youth games 2025",
    exploreLink: "https://trends.google.com/trends/explore?q=asian%20youth%20games%202025&geo=TH&hl=th"
  },
  {
    term: "ไฟดับ",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฟดับ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9F%E0%B8%94%E0%B8%B1%E0%B8%9A&geo=TH&hl=th"
  },
  {
    term: "twitch",
    searchVolume: "200",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "twitch",
    exploreLink: "https://trends.google.com/trends/explore?q=twitch&geo=TH&hl=th"
  },
  {
    term: "ยูโร ยศวรรธน์",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ยูโร ยศวรรธน์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A2%E0%B8%B9%E0%B9%82%E0%B8%A3%20%E0%B8%A2%E0%B8%A8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%98%E0%B8%99%E0%B9%8C&geo=TH&hl=th"
  },
  {
    term: "nyt connections hints",
    searchVolume: "200",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "nyt connections hints",
    exploreLink: "https://trends.google.com/trends/explore?q=nyt%20connections%20hints&geo=TH&hl=th"
  },
  {
    term: "ดาวโจนส์วันนี้",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ดาวโจนส์วันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B9%82%E0%B8%88%E0%B8%99%E0%B8%AA%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th"
  },
  {
    term: "รังสิมันต์โรม",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "รังสิมันต์โรม",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C%E0%B9%82%E0%B8%A3%E0%B8%A1&geo=TH&hl=th"
  },
  {
    term: "ragnarok twilight",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ragnarok twilight",
    exploreLink: "https://trends.google.com/trends/explore?q=ragnarok%20twilight&geo=TH&hl=th"
  },
  {
    term: "แพทองธารชินวัตร",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "แพทองธารชินวัตร,พงศ์กวิน จึงรุ่งเรืองกิจ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B8%B4%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%A3&geo=TH&hl=th"
  },
  {
    term: "netflix ราคา",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "netflix ราคา",
    exploreLink: "https://trends.google.com/trends/explore?q=netflix%20%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2&geo=TH&hl=th"
  },
  {
    term: "y",
    searchVolume: "500",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 40 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "y",
    exploreLink: "https://trends.google.com/trends/explore?q=y&geo=TH&hl=th"
  },
  {
    term: "central world",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "central world",
    exploreLink: "https://trends.google.com/trends/explore?q=central%20world&geo=TH&hl=th"
  },
  {
    term: "bg",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "bg",
    exploreLink: "https://trends.google.com/trends/explore?q=bg&geo=TH&hl=th"
  },
  {
    term: "harry potter",
    searchVolume: "100",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 30 นาที 00 วินาที UTC+7",
    endTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "harry potter",
    exploreLink: "https://trends.google.com/trends/explore?q=harry%20potter&geo=TH&hl=th"
  },
  {
    term: "3",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "3",
    exploreLink: "https://trends.google.com/trends/explore?q=3&geo=TH&hl=th"
  },
  {
    term: "ตํานานนทีมืด",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ตํานานนทีมืด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B9%8D%E0%B8%B2%E0%B8%99%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B8%A1%E0%B8%B7%E0%B8%94&geo=TH&hl=th"
  },
  {
    term: "ธนาคารออมสิน",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารออมสิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B8%B4%E0%B8%99&geo=TH&hl=th"
  },
  {
    term: "pakistan vs south africa",
    searchVolume: "100",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    endTime: "23 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "pakistan vs south africa",
    exploreLink: "https://trends.google.com/trends/explore?q=pakistan%20vs%20south%20africa&geo=TH&hl=th"
  }
];

export const mockGoogleTrends48H: GoogleTrendItem[] = [
  {
    term: "ไอน์ทรัค แฟร้งค์เฟิร์ต พบ ลิเวอร์พูล",
    searchVolume: "100K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "ไอน์ทรัค แฟร้งค์เฟิร์ต พบ ลิเวอร์พูล,ลิเวอร์พูล,ลิเวอร์พูลล่าสุด,ไอน์ทรัค แฟร้งค์เฟิร์ต vs ลิเวอร์พูล,ผลบอลยูฟ่าแชมเปียนส์ลีก,ฟุตบอลลิเวอร์พูล,ผลบอลลิเวอร์พูล,ลิเวอร์พูลวันนี้,ช่อง3 ออนไลน์,ผลบอลสด,ผลบอลเมื่อคืน,บอลสด ลิเวอร์พูล วันนี้,ดูบาสสด,tv ดูบอลสด,ดูบอลสด ลิเวอร์พูล,ผลบอลยูฟ่า,ดูบอลสดวันนี้,บอลออนไลน์,ดูบอลออนไลน์ยูฟ่า,แฟร้งเฟิต พบ ลิเวอร์พูล,แฟร้งค์เฟิร์ต,บอลยูฟ่า,ดูบอลยูฟ่า,บอลสด วันนี้,แชมเปียนส์ลีก,ดูบอลลิเวอร์พูล,ตารางบอลวันนี้,ผลบอล,ดูบอลสดลิเวอร์พูลวันนี้,เว็บดูบอลสด,ตารางบอล,ลิเวอร์พูล สด,บอลสดวันนี้,ดูบอลสดลิเวอร์พูล,ไอน์ทรัค แฟร้งค์เฟิร์ต,บอลลิเวอร์พูล,ดู,แฟร้งเฟิต พบ ลิเวอร์พูล รายชื่อผู้เล่น,ตารางแข่งลิเวอร์พูล,ลิเวอ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%AD%E0%B8%99%E0%B9%8C%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%84%20%E0%B9%81%E0%B8%9F%E0%B8%A3%E0%B9%89%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "เจ้าคุณพี่กับอีนางคําดวง ep 15",
    searchVolume: "20K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms:
      "เจ้าคุณพี่กับอีนางคําดวง ep 15,คุณพี่กับอีนางคําดวง ep 15,เจ้าคุณ พี่ กับ อี นาง คํา ดวง ep 16,เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 15,เจ้าคุณ พี่ กับ อี นาง คํา ดวง ep 15,คุณพี่กับอีนางคําดวง ep 16,เจ้าคุณพี่กับอีนางคําดวง ep. 16,เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 16,เจ้าคุณพี่ ep 15,คุณ พี่ กับ อี นาง คํา ดวง ep 15,ละคร,เจ้าคุณพี่กับอีนางคําดวง ep. ล่าสุด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B5%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8D%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%87%20ep%2015&geo=TH&hl=th",
  },
  {
    term: "คายา พบ บีจีพียู",
    searchVolume: "50K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "คายา พบ บีจีพียู,ดูบอลสด,บีจี,ดูบอล,บอลสด,ดูบอลสด วันนี้,kaya fc vs bg pathum united,บีจีปทุมยูไนเต็ด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%B2%E0%B8%A2%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%9A%E0%B8%B5%E0%B8%88%E0%B8%B5%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%B9&geo=TH&hl=th",
  },
  {
    term: "ธรรมนัส",
    searchVolume: "20K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms:
      "ธรรมนัส,กันจอมพลัง,มูลนิธิกันจอมพลัง,กัน จอมพลัง,กรรมการมูลนิธิกันจอมพลัง,มูลนิธิกันจอมพลังช่วยสู้จดทะเบียน,มูลนิธิกันจอมพลังช่วยสู้,ข่าวกันจอมพลังล่าสุด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B1%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "โก อะเฮด อีเกิ้ลส์ พบ แอสตันวิลลา",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms:
      "โก อะเฮด อีเกิ้ลส์ พบ แอสตันวิลลา,ดูบาสสด,ยูโรป้าลีก,ยูฟ่ายูโรปาลีก,เฟส,แอสตันวิลล่า,แอสตัน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%81%20%E0%B8%AD%E0%B8%B0%E0%B9%80%E0%B8%AE%E0%B8%94%20%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B9%89%E0%B8%A5%E0%B8%AA%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%AD%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "น้องวินภาสวินเสียชีวิต",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms:
      "น้องวินภาสวินเสียชีวิต,น้องวิน,น้องวินเสียชีวิต,น้องวิน ภาสวินท์,วิน ภาสวิน,วิน ภาสวินท์,น้องวิน ภาสวิน,น้องวินภาสวินท์,น้องวินภาสวินป่วยเป็นอะไร,วินภาสวิน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%AA%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95&geo=TH&hl=th",
  },
  {
    term: "คริสตัลพาเลซ พบ เออีเค ลาร์นาก้า",
    searchVolume: "10K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "คริสตัลพาเลซ พบ เออีเค ลาร์นาก้า,ยูโรปาคอนเฟอเรนซ์ลีก,คริสตัลพาเลซ,ยูฟ่าคอนเฟอเรนซ์ลีก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%A3%E0%B8%B4%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%A5%E0%B8%9E%E0%B8%B2%E0%B9%80%E0%B8%A5%E0%B8%8B%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%AD%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%84%20%E0%B8%A5%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "แบงค็อก ยูไนเต็ด พบ ไลอ้อน ซิตี้ เซเลอร์ส",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms:
      "แบงค็อก ยูไนเต็ด พบ ไลอ้อน ซิตี้ เซเลอร์ส,เอเอฟซีคัพ,แบงค็อก ยูไนเต็ด,ไฮไลท์ฟุตบอล,แบงค็อกยูไนเต็ด,bangkok united",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%9A%E0%B8%87%E0%B8%84%E0%B9%87%E0%B8%AD%E0%B8%81%20%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94%20%E0%B8%9E%E0%B8%9A%20%E0%B9%84%E0%B8%A5%E0%B8%AD%E0%B9%89%E0%B8%AD%E0%B8%99%20%E0%B8%8B%E0%B8%B4%E0%B8%95%E0%B8%B5%E0%B9%89%20%E0%B9%80%E0%B8%8B%E0%B9%80%E0%B8%A5%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "พลอยเฌอมาลย์",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "พลอยเฌอมาลย์,พลอย เฌอมาลย์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A5%E0%B8%AD%E0%B8%A2%E0%B9%80%E0%B8%8C%E0%B8%AD%E0%B8%A1%E0%B8%B2%E0%B8%A5%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "เป๋าตังคนละครึ่งพลัสสิทธิ",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "เป๋าตังคนละครึ่งพลัสสิทธิ,เช็คสิทธิ์โครงการคนละครึ่งพลัส,ทะเบียนคนละครึ่งพลัส,www.คนละครึ่งพลัส,สิทธิคนละครึ่งพลัสคงเหลือล่าสุด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9B%E0%B9%8B%E0%B8%B2%E0%B8%95%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%99%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%AA%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4&geo=TH&hl=th",
  },
  {
    term: "เสือ",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เสือ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B8%AD&geo=TH&hl=th",
  },
  {
    term: "chaos zero nightmare code",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "chaos zero nightmare code",
    exploreLink:
      "https://trends.google.com/trends/explore?q=chaos%20zero%20nightmare%20code&geo=TH&hl=th",
  },
  {
    term: "ทายาทหมายเลข 1 ep 20",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms:
      "ทายาทหมายเลข 1 ep 20,ทายาทหมายเลข 1 ep 19,ทายาท หมายเลข 1 ep 20,ทายาท หมายเลข 1 ep 19,ทายาทหมายเลข 1 ล่าสุด,ช่องวัน,ช่องวัน 31",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%B2%E0%B8%A2%E0%B8%B2%E0%B8%97%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%A5%E0%B8%82%201%20ep%2020&geo=TH&hl=th",
  },
  {
    term: "คอนเสิร์ต blackpink",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "คอนเสิร์ต blackpink,blackpink",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%20blackpink&geo=TH&hl=th",
  },
  {
    term: "ธนาคารกสิกรไทย",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารกสิกรไทย,กสิกรไทย,กสิกร,กสิกรโอนเงินไม่ได้,กสิกรล่ม",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%81%E0%B8%AA%E0%B8%B4%E0%B8%81%E0%B8%A3%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "warriors vs nuggets",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "warriors vs nuggets",
    exploreLink:
      "https://trends.google.com/trends/explore?q=warriors%20vs%20nuggets&geo=TH&hl=th",
  },
  {
    term: "เรอัลมาดริด พบ ยูเวนตุส",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "เรอัลมาดริด พบ ยูเวนตุส,เรอัลมาดริด,มาร์กเซย,เรอัลมาดริด vs ยูเวนตุส,ยูเวนตุส,เรอัล มาดริด,โปรแกรมบอล,โปรแกรมบอลวันนี้",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A3%E0%B8%AD%E0%B8%B1%E0%B8%A5%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A2%E0%B8%B9%E0%B9%80%E0%B8%A7%E0%B8%99%E0%B8%95%E0%B8%B8%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "สงคราม หมอลํา ep 23",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "สงคราม หมอลํา ep 23,สงคราม หมอ ลํา ep 23,ช่อง31",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%87%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%A1%20%E0%B8%AB%E0%B8%A1%E0%B8%AD%E0%B8%A5%E0%B9%8D%E0%B8%B2%20ep%2023&geo=TH&hl=th",
  },
  {
    term: "เฟเยนูร์ด",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เฟเยนูร์ด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9F%E0%B9%80%E0%B8%A2%E0%B8%99%E0%B8%B9%E0%B8%A3%E0%B9%8C%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "บาเยิร์น พบ คลับ บรูกก์",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเยิร์น พบ คลับ บรูกก์,บาเยิร์น,บาเยิร์น มิวนิค",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%A2%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%9A%20%E0%B8%9A%E0%B8%A3%E0%B8%B9%E0%B8%81%E0%B8%81%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "มอนาโก พบ สเปอร์ส",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "มอนาโก พบ สเปอร์ส,สเปอร์ส,โมนาโกบอล,โมนาโก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B9%82%E0%B8%81%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AA%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "มาดามแป้ง",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มาดามแป้ง",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%9B%E0%B9%89%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "classroom",
    searchVolume: "2K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "classroom",
    exploreLink:
      "https://trends.google.com/trends/explore?q=classroom&geo=TH&hl=th",
  },
  {
    term: "23 ตุลาคมวันปิยมหาราชธนาคารหยุดไหม",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "23 ตุลาคมวันปิยมหาราชธนาคารหยุดไหม,วันปิยมหาราชหยุดไหม,วันปิยมหาราชธนาคารหยุดไหม,วันหยุดเดือนตุลาคม 2568,23 ตุลาคมวันปิยมหาราช,วันหยุดนักขัตฤกษ์,วันหยุดธนาคาร 2568,วันหยุดราชการ 2568,วันหยุดธนาคาร,วันนี้ธนาคารหยุดไหม,วันหยุด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=23%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AB%E0%B8%A2%E0%B8%B8%E0%B8%94%E0%B9%84%E0%B8%AB%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "เฟิร์นสุชาดาผู้ประกาศข่าว",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms:
      "เฟิร์นสุชาดาผู้ประกาศข่าว,กรรมกรข่าวคุยนอกจอ,เฟิร์นสุชาดานิ่มนวล,สุชาดานิ่มนวล,เฟิร์นสุชาดา,เฟิร์นสุชาดานิ่มนวลประวัติ,เฟิร์น สุชาดา นิ่มนวล ประวัติ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7&geo=TH&hl=th",
  },
  {
    term: "ตรวจหวยลาวงวด 22 ตุลาคม 2568",
    searchVolume: "50K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms:
      "ตรวจหวยลาวงวด 22 ตุลาคม 2568,ผลหวยลาว 22 ตุลาคม 2568,หวยลาววันนี้,หวยลาว,หวยลาว22/10/68,ผลหวยลาว,หวยลาววันนี้ออกอะไร,ตรวจหวยลาว22/10/68,หวยลาวออกอะไร,ผลหวยลาว22/10/68,เลขลาววันนี้,หวยลาวพัฒนาวันนี้,ตรวจหวยลาววันนี้,ถ่ายทอดสดหวยลาววันนี้,แนวทางหวยลาววันนี้,ลาวพัฒนา,ผลหวยลาววันนี้,หวยลาววันนี้ 4 ตัว,หวยลาว ย้อน หลัง,ลาววันนี้,หวยลาวออก,หวยลาวพัฒนา,หวยลาวพัฒนาวันนี้ สด,หวยลาว 6 ตัว วันนี้,ผลหวยลาวย้อนหลัง,หวยลาวออกอะไรวันนี้",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B8%A5%E0%B8%B2%E0%B8%A7%E0%B8%87%E0%B8%A7%E0%B8%94%2022%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th",
  },
  {
    term: "eintracht frankfurt vs liverpool",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms:
      "eintracht frankfurt vs liverpool,liverpool,liverpool vs frankfurt",
    exploreLink:
      "https://trends.google.com/trends/explore?q=eintracht%20frankfurt%20vs%20liverpool&geo=TH&hl=th",
  },
  {
    term: "ลีลล์",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ลีลล์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B5%E0%B8%A5%E0%B8%A5%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "nottm forest vs porto",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "nottm forest vs porto,europa league",
    exploreLink:
      "https://trends.google.com/trends/explore?q=nottm%20forest%20vs%20porto&geo=TH&hl=th",
  },
  {
    term: "โบโลญญ่า",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "โบโลญญ่า",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ราชบุรี เอฟซี พบ อีสเทิร์น",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ราชบุรี เอฟซี พบ อีสเทิร์น,ราชบุรีมิตรผล,ราชบุรี",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%20%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AD%E0%B8%B5%E0%B8%AA%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "โรม่า",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "โรม่า,ฟอเรสต์,น็อตติ้งแฮม ฟอเรสต์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "วรภัค ธันยาวงษ์",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms:
      "วรภัค ธันยาวงษ์,วรภัค,วรภัคคือใคร,วรภัคธันยาวงษ์ประวัติ,สแกมเมอร์คืออะไร,วรภัคธันยาวงษ์สแกมเมอร์,วรภัคธันยาวงษ์,วรภัค ธันยาวงษ์ ประวัติ,วรภัค ลาออก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%A3%E0%B8%A0%E0%B8%B1%E0%B8%84%20%E0%B8%98%E0%B8%B1%E0%B8%99%E0%B8%A2%E0%B8%B2%E0%B8%A7%E0%B8%87%E0%B8%A9%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "go ahead eagles vs aston villa",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "go ahead eagles vs aston villa,aston villa",
    exploreLink:
      "https://trends.google.com/trends/explore?q=go%20ahead%20eagles%20vs%20aston%20villa&geo=TH&hl=th",
  },
  {
    term: "กาลาตาซาราย",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "กาลาตาซาราย,สปอร์ติงลิสบอน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B2%E0%B8%A5%E0%B8%B2%E0%B8%95%E0%B8%B2%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "รันทากาฮาชิ",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "รันทากาฮาชิ,ran takahashi,รัน ทากาฮาชิ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%AE%E0%B8%B2%E0%B8%8A%E0%B8%B4&geo=TH&hl=th",
  },
  {
    term: "ตี๋น้อย",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ตี๋น้อย,สุกี้ตี๋น้อย",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "เซลติก",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลติก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "ไฟร์บวร์ก",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฟร์บวร์ก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9F%E0%B8%A3%E0%B9%8C%E0%B8%9A%E0%B8%A7%E0%B8%A3%E0%B9%8C%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "เอฟซีเอสบี พบ โบโลญญ่า",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "เอฟซีเอสบี พบ โบโลญญ่า",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%E0%B9%80%E0%B8%AD%E0%B8%AA%E0%B8%9A%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "gold prices",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "gold prices",
    exploreLink:
      "https://trends.google.com/trends/explore?q=gold%20prices&geo=TH&hl=th",
  },
  {
    term: "บราก้า",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "บราก้า",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%A3%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "chelsea vs ajax",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "chelsea vs ajax,chelsea",
    exploreLink:
      "https://trends.google.com/trends/explore?q=chelsea%20vs%20ajax&geo=TH&hl=th",
  },
  {
    term: "ทางด่วนฟรี 23 ตุลาคม 2568",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms:
      "ทางด่วนฟรี 23 ตุลาคม 2568,ทางด่วนฟรี 23 ตุลาคม,ทางด่วนฟรี,วันนี้ทางด่วนฟรีไหม",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%94%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%9F%E0%B8%A3%E0%B8%B5%2023%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th",
  },
  {
    term: "streaming",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "streaming",
    exploreLink:
      "https://trends.google.com/trends/explore?q=streaming&geo=TH&hl=th",
  },
  {
    term: "f",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "f",
    exploreLink: "https://trends.google.com/trends/explore?q=f&geo=TH&hl=th",
  },
  {
    term: "กฎหมายนิรโทษกรรมล่าสุด",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "กฎหมายนิรโทษกรรมล่าสุด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%99%E0%B8%B4%E0%B8%A3%E0%B9%82%E0%B8%97%E0%B8%A9%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%A5%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B8%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "บิลเบา",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms:
      "บิลเบา,ดูบอลสด66,ดูบอล 66,ดูบอลสด 66,แอธเลติกบิลเบา,แอธเลติก บิลเบา",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B9%80%E0%B8%9A%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "บ้านผลบอล",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "บ้านผลบอล",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9C%E0%B8%A5%E0%B8%9A%E0%B8%AD%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "อตาลันต้า",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "อตาลันต้า,อตาลันต้า พบ สลาเวีย ปราก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%95%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "india vs australia",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms:
      "india vs australia,ind vs aus,india national cricket team vs australian men’s cricket team match scorecard",
    exploreLink:
      "https://trends.google.com/trends/explore?q=india%20vs%20australia&geo=TH&hl=th",
  },
  {
    term: "เชลซี",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เชลซี,สโมสรฟุตบอลเชลซี",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8A%E0%B8%A5%E0%B8%8B%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "มัลโม่",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "มัลโม่",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B9%82%E0%B8%A1%E0%B9%88&geo=TH&hl=th",
  },
  {
    term: "lec",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th",
  },
  {
    term: "ธนาคารออมสิน",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารออมสิน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "ช่อง3",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่อง3",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%873&geo=TH&hl=th",
  },
  {
    term: "นีซ",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "นีซ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B8%B5%E0%B8%8B&geo=TH&hl=th",
  },
  {
    term: "มาดริด",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "มาดริด,soccersuck",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "วันนี้วันอะไร",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "วันนี้วันอะไร",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3&geo=TH&hl=th",
  },
  {
    term: "raven 2",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "raven 2",
    exploreLink:
      "https://trends.google.com/trends/explore?q=raven%202&geo=TH&hl=th",
  },
  {
    term: "afc champions league 2",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "afc champions league 2,goa vs al-nassr",
    exploreLink:
      "https://trends.google.com/trends/explore?q=afc%20champions%20league%202&geo=TH&hl=th",
  },
  {
    term: "ลำดับของ ยูฟ่าแชมเปียนส์ลีก",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms:
      "ลำดับของ ยูฟ่าแชมเปียนส์ลีก,ตารางคะแนนยูฟ่า,ผลบอลยูฟ่าแชมป์เปียนลีก,ตารางคะแนนยูฟ่าแชมป์เปียนลีก,ตารางคะแนนยูฟ่าแชมเปียนส์ลีกล่าสุด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B3%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%82%E0%B8%AD%E0%B8%87%20%E0%B8%A2%E0%B8%B9%E0%B8%9F%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B9%8C%E0%B8%A5%E0%B8%B5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "สภาพอากาศวันนี้",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "สภาพอากาศวันนี้,อากาศวันนี้,อากาศ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "bbl",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "bbl",
    exploreLink: "https://trends.google.com/trends/explore?q=bbl&geo=TH&hl=th",
  },
  {
    term: "มากเซย",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มากเซย,สปอร์ติ้ง,สปอร์ติ้ง ลิสบอน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%8B%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "ช่องวัน",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่องวัน,ช่องวัน 31",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B1%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "เซลต้า บีโก้",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลต้า บีโก้,เซลต้าบีโก้",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B9%89%E0%B8%B2%20%E0%B8%9A%E0%B8%B5%E0%B9%82%E0%B8%81%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "มุกดา",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "มุกดา,เข้ม หัสวีร์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B8%E0%B8%81%E0%B8%94%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "สโมสรฟุตบอลลิเวอร์พูล",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "สโมสรฟุตบอลลิเวอร์พูล,สยามกีฬา,siamsport",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B8%AA%E0%B8%A3%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "ราคาน้ำมันวันนี้",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ราคาน้ำมันวันนี้",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "crystal palace vs aek larnaca",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "crystal palace vs aek larnaca",
    exploreLink:
      "https://trends.google.com/trends/explore?q=crystal%20palace%20vs%20aek%20larnaca&geo=TH&hl=th",
  },
  {
    term: "ต้าห์อู๋",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ต้าห์อู๋",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B9%8C%E0%B8%AD%E0%B8%B9%E0%B9%8B&geo=TH&hl=th",
  },
  {
    term: "marc guiu",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "marc guiu",
    exploreLink:
      "https://trends.google.com/trends/explore?q=marc%20guiu&geo=TH&hl=th",
  },
  {
    term: "วันฮาโลวีน",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "วันฮาโลวีน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%AE%E0%B8%B2%E0%B9%82%E0%B8%A5%E0%B8%A7%E0%B8%B5%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "บาเฮีย",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 4 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเฮีย",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%AE%E0%B8%B5%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "แม่ซื้อ",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "แม่ซื้อ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD&geo=TH&hl=th",
  },
  {
    term: "anthony hudson",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "anthony hudson",
    exploreLink:
      "https://trends.google.com/trends/explore?q=anthony%20hudson&geo=TH&hl=th",
  },
  {
    term: "ช่อง3",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่อง3,ช่อง 3",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%873&geo=TH&hl=th",
  },
  {
    term: "กังวอน เอฟซี พบ วิสเซล โคเบะ",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "กังวอน เอฟซี พบ วิสเซล โคเบะ,วิสเซล โกเบ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B1%E0%B8%87%E0%B8%A7%E0%B8%AD%E0%B8%99%20%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A7%E0%B8%B4%E0%B8%AA%E0%B9%80%E0%B8%8B%E0%B8%A5%20%E0%B9%82%E0%B8%84%E0%B9%80%E0%B8%9A%E0%B8%B0&geo=TH&hl=th",
  },
  {
    term: "monaco vs tottenham",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "monaco vs tottenham",
    exploreLink:
      "https://trends.google.com/trends/explore?q=monaco%20vs%20tottenham&geo=TH&hl=th",
  },
  {
    term: "bayern vs club brugge",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 4 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "bayern vs club brugge,bein sport",
    exploreLink:
      "https://trends.google.com/trends/explore?q=bayern%20vs%20club%20brugge&geo=TH&hl=th",
  },
  {
    term: "real madrid",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "real madrid",
    exploreLink:
      "https://trends.google.com/trends/explore?q=real%20madrid&geo=TH&hl=th",
  },
  {
    term: "beyond meat stock",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "beyond meat stock,bynd",
    exploreLink:
      "https://trends.google.com/trends/explore?q=beyond%20meat%20stock&geo=TH&hl=th",
  },
  {
    term: "asian youth games 2025",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "asian youth games 2025,วอลเลย์บอล,แข่งขันวอลเลย์บอลหญิง",
    exploreLink:
      "https://trends.google.com/trends/explore?q=asian%20youth%20games%202025&geo=TH&hl=th",
  },
  {
    term: "สวอนซี",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "สวอนซี",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A7%E0%B8%AD%E0%B8%99%E0%B8%8B%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "ไฟดับ",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฟดับ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9F%E0%B8%94%E0%B8%B1%E0%B8%9A&geo=TH&hl=th",
  },
  {
    term: "twitch",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "twitch",
    exploreLink:
      "https://trends.google.com/trends/explore?q=twitch&geo=TH&hl=th",
  },
  {
    term: "ยูโร ยศวรรธน์",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ยูโร ยศวรรธน์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A2%E0%B8%B9%E0%B9%82%E0%B8%A3%20%E0%B8%A2%E0%B8%A8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%98%E0%B8%99%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "nyt connections hints",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "nyt connections hints",
    exploreLink:
      "https://trends.google.com/trends/explore?q=nyt%20connections%20hints&geo=TH&hl=th",
  },
  {
    term: "กัมบะ โอซาก้า พบ นัมดินห์",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "กัมบะ โอซาก้า พบ นัมดินห์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B1%E0%B8%A1%E0%B8%9A%E0%B8%B0%20%E0%B9%82%E0%B8%AD%E0%B8%8B%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%99%E0%B8%B1%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B8%AB%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ดาวโจนส์วันนี้",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ดาวโจนส์วันนี้,หวยหุ้นวันนี้",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B9%82%E0%B8%88%E0%B8%99%E0%B8%AA%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "ชิคาโก ไฟร์",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ชิคาโก ไฟร์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B8%B4%E0%B8%84%E0%B8%B2%E0%B9%82%E0%B8%81%20%E0%B9%84%E0%B8%9F%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "พระกาโตะ",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "พระกาโตะ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B9%82%E0%B8%95%E0%B8%B0&geo=TH&hl=th",
  },
  {
    term: "23 ตุลาคม 2568",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "23 ตุลาคม 2568,ราคาทองวันนี้23/10/68,ราคาทองรูปพรรณ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=23%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th",
  },
  {
    term: "jinx",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "jinx",
    exploreLink: "https://trends.google.com/trends/explore?q=jinx&geo=TH&hl=th",
  },
  {
    term: "รังสิมันต์โรม",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "รังสิมันต์โรม",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C%E0%B9%82%E0%B8%A3%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "ragnarok twilight",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ragnarok twilight",
    exploreLink:
      "https://trends.google.com/trends/explore?q=ragnarok%20twilight&geo=TH&hl=th",
  },
  {
    term: "แพทองธารชินวัตร",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "แพทองธารชินวัตร,พงศ์กวิน จึงรุ่งเรืองกิจ",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B8%B4%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%A3&geo=TH&hl=th",
  },
  {
    term: "netflix ราคา",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "netflix ราคา",
    exploreLink:
      "https://trends.google.com/trends/explore?q=netflix%20%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "อูโก เอกิติเก",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "อูโก เอกิติเก",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B9%E0%B9%82%E0%B8%81%20%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%B4%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "วันปิยมหาราช 2568",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "วันปิยมหาราช 2568",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A%202568&geo=TH&hl=th",
  },
  {
    term: "lakers",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "lakers,gsw",
    exploreLink:
      "https://trends.google.com/trends/explore?q=lakers&geo=TH&hl=th",
  },
  {
    term: "y",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "y",
    exploreLink: "https://trends.google.com/trends/explore?q=y&geo=TH&hl=th",
  },
  {
    term: "ไฮไลท์ฟุตบอลเมื่อคืน",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฮไลท์ฟุตบอลเมื่อคืน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%AE%E0%B9%84%E0%B8%A5%E0%B8%97%E0%B9%8C%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%84%E0%B8%B7%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "central world",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "central world",
    exploreLink:
      "https://trends.google.com/trends/explore?q=central%20world&geo=TH&hl=th",
  },
  {
    term: "escape from duckov",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "escape from duckov",
    exploreLink:
      "https://trends.google.com/trends/explore?q=escape%20from%20duckov&geo=TH&hl=th",
  },
  {
    term: "ufa",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ufa",
    exploreLink: "https://trends.google.com/trends/explore?q=ufa&geo=TH&hl=th",
  },
  {
    term: "bg",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "bg",
    exploreLink: "https://trends.google.com/trends/explore?q=bg&geo=TH&hl=th",
  },
  {
    term: "godaddy",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "godaddy",
    exploreLink:
      "https://trends.google.com/trends/explore?q=godaddy&geo=TH&hl=th",
  },
  {
    term: "ตํานานนทีมืด",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ตํานานนทีมืด,ตำนานนทีมืด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B9%8D%E0%B8%B2%E0%B8%99%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B8%A1%E0%B8%B7%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "สโมสรฟุตบอลเรอัลมาดริด",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "สโมสรฟุตบอลเรอัลมาดริด",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B8%AA%E0%B8%A3%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B9%80%E0%B8%A3%E0%B8%AD%E0%B8%B1%E0%B8%A5%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "กอล์ฟ ธัญญ์วาริน",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "กอล์ฟ ธัญญ์วาริน",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%20%E0%B8%98%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B9%8C%E0%B8%A7%E0%B8%B2%E0%B8%A3%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "สภาพอากาศวันนี้",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "สภาพอากาศวันนี้",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "harry potter",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "harry potter",
    exploreLink:
      "https://trends.google.com/trends/explore?q=harry%20potter&geo=TH&hl=th",
  },
  {
    term: "ตลาดหลักทรัพย์",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ตลาดหลักทรัพย์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9E%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "28 days later",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "28 days later",
    exploreLink:
      "https://trends.google.com/trends/explore?q=28%20days%20later&geo=TH&hl=th",
  },
  {
    term: "คุณพี่กับอีนางคําดวง ep 14",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "คุณพี่กับอีนางคําดวง ep 14",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B5%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8D%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%87%20ep%2014&geo=TH&hl=th",
  },
  {
    term: "3",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "3",
    exploreLink: "https://trends.google.com/trends/explore?q=3&geo=TH&hl=th",
  },
  {
    term: "galatasaray",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "galatasaray",
    exploreLink:
      "https://trends.google.com/trends/explore?q=galatasaray&geo=TH&hl=th",
  },
  {
    term: "ไทยพาณิชย์",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไทยพาณิชย์",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%9E%E0%B8%B2%E0%B8%93%E0%B8%B4%E0%B8%8A%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ราชกิจจานุเบกษา",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ราชกิจจานุเบกษา",
    exploreLink:
      "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%81%E0%B8%B4%E0%B8%88%E0%B8%88%E0%B8%B2%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%9A%E0%B8%81%E0%B8%A9%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "pakistan vs south africa",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "pakistan vs south africa",
    exploreLink:
      "https://trends.google.com/trends/explore?q=pakistan%20vs%20south%20africa&geo=TH&hl=th",
  },
  {
    term: "3",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "3",
    exploreLink: "https://trends.google.com/trends/explore?q=3&geo=TH&hl=th",
  },
];

const mockGoogleTrends7D: GoogleTrendItem[] = [
  {
    term: "ไอน์ทรัค แฟร้งค์เฟิร์ต พบ ลิเวอร์พูล",
    searchVolume: "200K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไอน์ทรัค แฟร้งค์เฟิร์ต พบ ลิเวอร์พูล,ยูฟ่าแชมเปียนส์ลีก,ยูฟ่า,ucl,ลิเวอร์พูล,ลิเวอร์พูลล่าสุด,ไอน์ทรัค แฟร้งค์เฟิร์ต vs ลิเวอร์พูล,ดูบาสสด,ผลบอลยูฟ่าแชมเปียนส์ลีก,ฟุตบอลลิเวอร์พูล,ผลบอลลิเวอร์พูล,ลิเวอร์พูลวันนี้,ช่อง3 ออนไลน์,ผลบอลสด,ผลบอลเมื่อคืน,บอลสด ลิเวอร์พูล วันนี้,tv ดูบอลสด,ดูบอลสด ลิเวอร์พูล,ผลบอลยูฟ่า,ดูบอลสดวันนี้,บอลออนไลน์,ดูบอลออนไลน์ยูฟ่า,แฟร้งเฟิต พบ ลิเวอร์พูล,แฟร้งค์เฟิร์ต,บอลยูฟ่า,ดูบอลยูฟ่า,บอลสด วันนี้,แชมเปียนส์ลีก,ดูบอลลิเวอร์พูล,ตารางบอลวันนี้,ผลบอล,ดูบอลสดลิเวอร์พูลวันนี้,เว็บดูบอลสด,ตารางบอล,ลิเวอร์พูล สด,บอลสดวันนี้,ดูบอลสดลิเวอร์พูล,ไอน์ทรัค แฟร้งค์เฟิร์ต,บอลลิเวอร์พูล,ดู,แฟร้งเฟิต พบ ลิเวอร์พูล รายชื่อผู้เล่น,ตารางแข่งลิเวอร์พูล,ลิเวอ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%AD%E0%B8%99%E0%B9%8C%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%84%20%E0%B9%81%E0%B8%9F%E0%B8%A3%E0%B9%89%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "เช็คสิทธิ์คนละครึ่ง",
    searchVolume: "1M+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "เช็คสิทธิ์คนละครึ่ง,เป๋าตังคนละครึ่งพลัสสิทธิ,เช็คสิทธิ์โครงการคนละครึ่งพลัส,คนละครึ่งพลัส,สิทธิคนละครึ่ง,คนละครึ่ง,ลงทะเบียนคนละครึ่งพลัสเป๋าตัง,คนละครึ่งพลัสลงทะเบียน,เป๋าตังคนละครึ่งพลัสลงทะเบียน,ลงทะเบียนคนละครึ่ง 2568,คนละครึ่งพลัส 2568,สิทธิคนละครึ่งคงเหลือ,ลงทะเบียนคนละครึ่งพลัส,วิธีลงทะเบียนคนละครึ่งพลัส,www คนละครึ่งcom ยืนยันสิทธิ์,คนละ ครึ่ง พลัส,แอพเป๋าตัง,ทะเบียนคนละครึ่งพลัส,ตรวจสอบสิทธิ์คนละครึ่ง,เช็คสิทธิ์คนละครึ่งพลัส,กรุงไทย,คนละครึ่งพลัสใช้ยังไง,แอปเป๋าตังคนละครึ่งพลัส,วิธีลงทะเบียนคนละครึ่ง,คนละครึ่งพลัสเหลือกี่สิทธิ์,คนละครึ่งเหลือกี่สิทธิ์,www. คนละครึ่งพลัส .com,ยืนยันตัวตนคนละครึ่ง,โหลดแอปเป๋าตัง,ยืนยันตัวตนเป๋าตังด้วยบัตรประชาชน,www.คนละครึ่งพลัส.com,ยืนยันตัวตนที่ตู้กรุงไทย,คนล่ะครึ่งพลัส,คนละครึ่งล่าสุด,โครงการคนละครึ่งพลัส 2568,บัตรสวัสดิการแห่งรัฐ,สมัครคนละครึ่งพลัส,วิธียืนยันตัวตนที่ตู้กรุงไทย,www.คนละครึ่งพลัส,คนละครึ่งพลัสได้กี่บาท,สิทธิ์คนละครึ่ง,วิธี ลง ทะเบียน คนละ ครึ่ง พลัส,เงื่อนไขคนละครึ่งพลัส,www.คนละครึ่ง.com ลงทะเบียน,วิธีสมัครคนละครึ่ง,g wallet,คนละครึ่งใช้ได้วันละกี่บาท,ยื่นภาษี,โหลด app เป๋าตังค์,บัตรสวัสดิการแห่งรัฐ 2568 คนละครึ่ง,แอพเป๋าตังเวอร์ชั่นล่าสุด,www คนละครึ่งcom ลงทะเบียน 2568,คนละครึ่งพลัส.com,สมัครเป๋าตัง,www คนละ ครึ่ง com ยืนยัน สิทธิ์,ขั้นตอนลงทะเบียนคนละครึ่ง,คนละครึ่งพลัสใช้ได้วันละเท่าไหร่,ลงทะเบียนคนละครึ่งล่าสุด,คนละครึ่งลงทะเบียน,ลงคนละครึ่ง,บัตรสวัสดิการแห่งรัฐ 2568,บัตรคนจนได้คนละครึ่งไหม,คนละ ครึ่ง พลัส ได้ กี่ บาท,คนละครึ่งล่าสุด 2568,คนละครึ่งใช้ยังไง,เงื่อนไขคนละครึ่ง,คนละครึ่งพลัสลงทะเบียนเป๋าตัง,ลงทะเบียนบัตรสวัสดิการแห่งรัฐ 2568,แอปเป๋าตังคนละครึ่งพลัสลงทะเบียน,รับสิทธิ์คนละครึ่ง,คนละครึ่งเต็มหรือยัง,มีบัตรสวัสดิการแห่งรัฐลงทะเบียนคนละครึ่งได้ไหม,คนละครึ่งได้กี่บาท,เช็คสิทธิคนละครึ่ง,ร้านค้าลงทะเบียนคนละครึ่ง,คนละครึ่งเหลือกี่สิทธิ์ตอนนี้,ลงทะเบียน,วิธีใช้คนละครึ่ง,ลง ทะเบียน คนละ ครึ่ง,คนละครึ่ง พลัส,แอปเป๋าตังค์,ลงทะเบียนคนละครึ่ง2568,คนละครึ่งเต็มยัง,บัตรสวัสดิการแห่งรัฐคนละครึ่ง,การลงทะเบียนคนละครึ่ง,สิทธิคนละครึ่งล่าสุด,คนละครึ่งพลัสเหลืออีกกี่สิทธิ์,คนละครึ่งพลัสเต็มยัง,บัตรคนจน,สิทธิ คนละ ครึ่ง ล่าสุด,กดรับสิทธิ์คนละครึ่ง,เหลือกี่สิทธิ์คนละครึ่ง,ยืนยันตัวตนเป๋าตังได้ถึงวันไหน,ยืนยันตัวตนแอปเป๋าตังไม่ได้,ติดตั้งแอปเป๋าตัง,คนละครึ่ง.com ลงทะเบียน,คนที่มีบัตรคนจนลงคนละครึ่งได้ไหม,ลงทะเบียนคนละครึ่งพลัส 2568,www.คนละครึ่ง.com ลงทะเบียน 2568,ลงทะเบียน คนละครึ่ง,คุณสมบัติคนละครึ่ง,ลงทะเบียนร้านค้าคนละครึ่ง,เช็คจํานวนสิทธิ์คนละครึ่ง,ยืนยันสิทธิ์คนละครึ่ง,คนละครึ่งเฟส 2,ภาษีเงินได้บุคคลธรรมดา,คนละ ครึ่ง ล่าสุด,สิทธิ์คงเหลือคนละครึ่ง,คนละ ครึ่ง พลัส เว็บไซต์,โครงการคนละครึ่งพลัส,ขั้นตอนการลงทะเบียนคนละครึ่ง,คนละครึ่งใช้ได้วันไหน,สิทธิ คนละ ครึ่ง,คนละครึ่งพลัสเฟส 2,คนละครึ่งเต็มแล้ว,ภาษี,สิทธิคนละครึ่งพลัสคงเหลือล่าสุด,บัตรสวัสดิการแห่งรัฐ 2568 ลงทะเบียนวันไหน,วิธีใช้คนละครึ่งพลัส,ยืนยัน,ลงทะเบียนบัตรสวัสดิการแห่งรัฐ,คนละครึ่งล่าสุด 2568 ลงทะเบียน,คนละครึ่งพลัสลงทะเบียนวันไหน,แบบฟอร์มสมัครร้านค้าคนละครึ่งพลัส,คนละ ครึ่ง พลัส ใช้ได้ วัน ละ เท่า ไหร่,คนละ ครึ่ง พลัส 2568,แอปคนละครึ่ง,คนละครึ่งธนาคารกรุงไทย,คนละครึ่งลงทะเบียนวันไหน,คนละครึ่งเฟส 5,คนละครึ่งร้านค้า,ถุงเงิน,สิทธิคนละครึ่งพลัสคงเหลือ,app เป๋าตัง,คนละครึ่งพลัสสิทธิ์คงเหลือ,บัตรสวัสดิการแห่งรัฐ 2568 ได้คนละครึ่งไหม,ลงทะเบียนร้านค้าคนละครึ่ง 2568,บัตร สวัสดิการ แห่ง รัฐ คนละ ครึ่ง,คนละครึ่ง ลงทะเบียน,คนละครึ่งพลัสใช้ที่ไหนได้บ้าง,สิทธิคงเหลือคนละครึ่ง,คนละครึ่ง 2568 ลงทะเบียน,เช็คสิทธิ์คงเหลือคนละครึ่ง,สิทธิ คนละ ครึ่ง พลัส เหลือ กี่ สิทธิ์,คนละ ครึ่ง พลัส ลง ทะเบียน,คนละครึ่งใช้ได้ถึงวันไหน,ดูจํานวนสิทธิคงเหลือคนละครึ่ง,สิทธิ คนละ ครึ่ง พลัส คงเหลือ,ธนาคารกรุงไทยคนละครึ่งพลัส,เช็คคนละครึ่ง,สิทธิคนละครึ่งพลัสเหลือกี่สิทธิ์,บัตรสวัสดิการแห่งรัฐได้คนละครึ่งไหม,เสียภาษี,ถุงเงินกรุงไทยคนละครึ่งพลัส,เช็คสิทธิ์คงเหลือคนละครึ่งพลัส,คุณสมบัติคนละครึ่งพลัส,เช็คบัตรสวัสดิการแห่งรัฐ,ลง ทะเบียน คนละ ครึ่ง ล่าสุด,วิธีลงคนละครึ่ง,โหลดแอปเป๋าตังไม่ได้ android,คนละครึ่งพลัสซื้ออะไรได้บ้าง,เป๋า ตัง คนละ ครึ่ง พลัส ลง ทะเบียน,คนละ ครึ่ง พลัส กี่ สิทธิ์,เป๋าตังคนละครึ่งพลัสแอป,ยืนยันตัวตนกรุงไทย,คนละครึ่งพลัสลงทะเบียนคนเก่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8A%E0%B9%87%E0%B8%84%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B8%84%E0%B8%99%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "เจ้าคุณพี่กับอีนางคําดวง ep 15",
    searchVolume: "20K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เจ้าคุณพี่กับอีนางคําดวง ep 15,คุณพี่กับอีนางคําดวง ep 15,เจ้าคุณ พี่ กับ อี นาง คํา ดวง ep 16,เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 15,เจ้าคุณ พี่ กับ อี นาง คํา ดวง ep 15,คุณพี่กับอีนางคําดวง ep 16,เจ้าคุณพี่กับอีนางคําดวง ep. 16,เจ้าคุณ พี่กับ อี นาง คํา ดวง ep. 16,เจ้าคุณพี่ ep 15,คุณ พี่ กับ อี นาง คํา ดวง ep 15,ละคร,เจ้าคุณพี่กับอีนางคําดวง ep. ล่าสุด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B5%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8D%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%87%20ep%2015&geo=TH&hl=th",
  },
  {
    term: "คายา พบ บีจีพียู",
    searchVolume: "50K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "คายา พบ บีจีพียู,ดูบอลสด,บีจี,ดูบอล,บอลสด,ดูบอลสด วันนี้,kaya fc vs bg pathum united,บีจีปทุมยูไนเต็ด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%B2%E0%B8%A2%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%9A%E0%B8%B5%E0%B8%88%E0%B8%B5%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%B9&geo=TH&hl=th",
  },
  {
    term: "ธรรมนัส",
    searchVolume: "20K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ธรรมนัส,กันจอมพลัง,มูลนิธิกันจอมพลัง,กัน จอมพลัง,กรรมการมูลนิธิกันจอมพลัง,สรยุทธสุทัศนะจินดา,ไอซ์ รักชนก,มูลนิธิกันจอมพลังช่วยสู้จดทะเบียน,ไอซ์รักชนก,มูลนิธิกันจอมพลังช่วยสู้,ข่าวกันจอมพลังล่าสุด,กรรมกรข่าว",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B1%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "chaos zero nightmare",
    searchVolume: "20K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "chaos zero nightmare,chaos zero nightmare code,chaos zero nightmare pc",
    exploreLink: "https://trends.google.com/trends/explore?q=chaos%20zero%20nightmare&geo=TH&hl=th",
  },
  {
    term: "โก อะเฮด อีเกิ้ลส์ พบ แอสตันวิลลา",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "โก อะเฮด อีเกิ้ลส์ พบ แอสตันวิลลา,ดูบาสสด,ยูโรป้าลีก,ยูฟ่ายูโรปาลีก,เฟส,แอสตันวิลล่า,แอสตัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%81%20%E0%B8%AD%E0%B8%B0%E0%B9%80%E0%B8%AE%E0%B8%94%20%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B9%89%E0%B8%A5%E0%B8%AA%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%AD%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "วันปิยมหาราช",
    searchVolume: "20K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "วันปิยมหาราช,ปิยมหาราช,วันปิยมหาราช 2568",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A&geo=TH&hl=th",
  },
  {
    term: "chaos zero nightmare tier list",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "chaos zero nightmare tier list",
    exploreLink: "https://trends.google.com/trends/explore?q=chaos%20zero%20nightmare%20tier%20list&geo=TH&hl=th",
  },
  {
    term: "น้องวินภาสวินเสียชีวิต",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "น้องวินภาสวินเสียชีวิต,น้องวิน,น้องวินเสียชีวิต,น้องวิน ภาสวินท์,วิน ภาสวิน,วิน ภาสวินท์,น้องวิน ภาสวิน,น้องวินภาสวินท์,น้องวินภาสวินป่วยเป็นอะไร,วินภาสวิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%AA%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95&geo=TH&hl=th",
  },
  {
    term: "คริสตัลพาเลซ พบ เออีเค ลาร์นาก้า",
    searchVolume: "10K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "คริสตัลพาเลซ พบ เออีเค ลาร์นาก้า,ยูโรปาคอนเฟอเรนซ์ลีก,คริสตัลพาเลซ,ยูฟ่าคอนเฟอเรนซ์ลีก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%A3%E0%B8%B4%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%A5%E0%B8%9E%E0%B8%B2%E0%B9%80%E0%B8%A5%E0%B8%8B%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%AD%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%84%20%E0%B8%A5%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "แบงค็อก ยูไนเต็ด พบ ไลอ้อน ซิตี้ เซเลอร์ส",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "แบงค็อก ยูไนเต็ด พบ ไลอ้อน ซิตี้ เซเลอร์ส,เอเอฟซีคัพ,แบงค็อก ยูไนเต็ด,ไฮไลท์ฟุตบอล,แบงค็อกยูไนเต็ด,bangkok united",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%9A%E0%B8%87%E0%B8%84%E0%B9%87%E0%B8%AD%E0%B8%81%20%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94%20%E0%B8%9E%E0%B8%9A%20%E0%B9%84%E0%B8%A5%E0%B8%AD%E0%B9%89%E0%B8%AD%E0%B8%99%20%E0%B8%8B%E0%B8%B4%E0%B8%95%E0%B8%B5%E0%B9%89%20%E0%B9%80%E0%B8%8B%E0%B9%80%E0%B8%A5%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "พลอยเฌอมาลย์",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "พลอยเฌอมาลย์,พลอย เฌอมาลย์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A5%E0%B8%AD%E0%B8%A2%E0%B9%80%E0%B8%8C%E0%B8%AD%E0%B8%A1%E0%B8%B2%E0%B8%A5%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "วิญญาณเลขที่ 13",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "วิญญาณเลขที่ 13,attack 13",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B4%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%93%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%97%E0%B8%B5%E0%B9%88%2013&geo=TH&hl=th",
  },
  {
    term: "28 years later",
    searchVolume: "5K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "28 years later",
    exploreLink: "https://trends.google.com/trends/explore?q=28%20years%20later&geo=TH&hl=th",
  },
  {
    term: "ลิเวอร์พูล พบ แมนยู",
    searchVolume: "200K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ลิเวอร์พูล พบ แมนยู",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%A1%E0%B8%99%E0%B8%A2%E0%B8%B9&geo=TH&hl=th",
  },
  {
    term: "เสือ",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เสือ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B8%AD&geo=TH&hl=th",
  },
  {
    term: "ทายาทหมายเลข 1 ep 20",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ทายาทหมายเลข 1 ep 20,ทายาทหมายเลข 1 ep 19,ทายาท หมายเลข 1 ep 20,ทายาท หมายเลข 1 ep 19,ทายาทหมายเลข 1 ล่าสุด,ช่องวัน,ช่องวัน 31",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%B2%E0%B8%A2%E0%B8%B2%E0%B8%97%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%A5%E0%B8%82%201%20ep%2020&geo=TH&hl=th",
  },
  {
    term: "คอนเสิร์ต blackpink",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "คอนเสิร์ต blackpink,blackpink",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%20blackpink&geo=TH&hl=th",
  },
  {
    term: "ธนาคารกสิกรไทย",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารกสิกรไทย,กสิกรไทย,กสิกร,กสิกรโอนเงินไม่ได้,กสิกรล่ม",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%81%E0%B8%AA%E0%B8%B4%E0%B8%81%E0%B8%A3%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "warriors vs nuggets",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "warriors vs nuggets",
    exploreLink: "https://trends.google.com/trends/explore?q=warriors%20vs%20nuggets&geo=TH&hl=th",
  },
  {
    term: "ลิเวอร์พูล vs แมนยู",
    searchVolume: "1M+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ลิเวอร์พูล vs แมนยู,แมนยูพบลิเวอร์พูล,ลิเวอร์พูลพบแมนยู,แมนยู,ดูบอลสด,บอลสด,แมนยูลิเวอร์พูล,พรีเมียร์ลีก,แดงเดือด,ดูบอล,ลิเวอร์พูล,บอล,บอลวันนี้,ผลบอล,monomax,แมนยู vs ลิเวอร์พูล,แมนยู vs ลิเวอร์พูลล่าสุด,ดูบอลสดวันนี้,ผลบอลแมนยู,ผลบอลวันนี้,บอลสดวันนี้,แมนยูล่าสุด,ลิเวอร์พูล vs แมน ยู ล่าสุด วัน นี้,สกอร์บอล,สโมสรฟุตบอลแมนเชสเตอร์ยูไนเต็ด,แมนยู ลิเวอร์พูล,ผลบอลสด,แมนยูกับลิเวอร์พูล,ถ่ายทอดสดฟุตบอลวันนี้,ดูบอลสดแมนยู,ดูบอลสด วันนี้,ไลฟ์สดบอล,ฟุตบอลวันนี้,ดูบอลออนไลน์แมนยู,ลิเวอร์พูล พบ แมนยู รายชื่อผู้เล่น,บอลสดแมนยู,ฟุตบอลพรีเมียร์ลีก,tv ดูบอลสด,ลิเวอร์พูล vs แมนยูล่าสุดวันนี้,ดูบอลสดพรีเมียร์ลีก,บอลวันนี้ สด,แดงเดือดวันนี้,สกอร์แมนยูลิเวอร์พูลล่าสุด,บอลพรีเมียร์ลีก,บอลวันนี้สด,ศึกแดงเดือด,ลิเวอร์พูล vs แมนยู ล่าสุด วันนี้,ลิเวอร์พูลแมนยู,เว็บดูบอลสด,ผลบอลแมนยูลิเวอร์พูล,สถิติสำหรับ ลิเวอร์พูล พบ แมนยู,ดู บอล สด,บอลแมนยู,ผลบอลลิเวอร์พูล,ดูบอลสด แมนยู,บอลออนไลน์,ลิเวอร์พูล vs แมน ยู,ดูบอลสดแมนยูลิเวอร์พูล,ดูบอลแมนยูลิเวอร์พูล,tv ดู บอล สด วัน นี้,บอลแมนยูลิเวอร์พูล,แมนยูสด,แมนยูลิเวอร์พูลล่าสุด,แข่งบอลวันนี้,แมนยูพบลิเวอร์พูลล่าสุด,บอลสด ลิเวอร์พูล วันนี้,ดูบอลแมนยู,ลิเวอร์พูลกับแมนยู,ลิเวอร์พูลล่าสุด,ดูแมนยูสด,ดูบอลวันนี้,ลิเวอร์พูล vs แมนยูสด,บอลสดลิเวอร์พูลวันนี้,ไลฟ์สดบอลพรีเมียร์ลีกวันนี้,ตารางบอลวันนี้,บอลลิเวอร์พูล,ดูบอลสดลิเวอร์พูล vs แมนยู,แมนยูพบลิเวอร์พูลสด,ดู บอล สด วัน นี้,ผล บอล สด,ดูบอลพรีเมียร์ลีก,แมนยูวันนี้,ตารางบอลวันนี้ พรีเมียร์ลีก,monomax ดูบอล,แดงเดือดคืนนี้,ลิเวอร์พูล ดูบอลสด,ดูฟุตบอล,ฟุตบอล,แมนยูพบลิเวอร์พูล สด,บอลแมนยูวันนี้,ลิเวอร์พูล แมนยู,บอลสด แมนยู,ดูบอลสดลิเวอร์พูล,พรีเมียร์ลีกวันนี้,ลิเวอร์พูล vs แมนยู สด,บอลสดวันนี้แมนยู,ดูบอลลิเวอร์พูลแมนยู,แมน ยู vs ลิเวอร์พูล,ดูบอลสด พรีเมียร์ลีก,ฟุตบอลสด,ดูบอล สด,ดู,ถ่ายทอดสดฟุตบอล,แมนยู พบ ลิเวอร์พูล,ลิเวอร์พูลพบแมนยูสด,แมน,pptv ถ่ายทอดสด บอลวันนี้,บอล สด,ดูบอลลิเวอร์พูลสด,แมนยู สด,บอลลิเวอร์พูลวันนี้,ลิเวอร์พูล พบ แมนยู สด,ลิเวอร์พูลพบแมนยูดูได้ที่ไหน,แมนยู vs ลิเวอร์พูล สด,ศึกแดงเดือดคืนนี้,ดูฟุตบอลสด,ผลแมนยู,ลิเวอร์พูลสด,บอลสด วันนี้,บอลวันนี้แมนยู,ดูแมนยู,ลิเวอร์พูล vs แมนยู สดฟรี,ดู บอลสด,บอลพรีเมียร์ลีกวันนี้,ลิเวอ,ถ่ายทอดสดบอลวันนี้,คอเนอร์ แบรดลีย์,ถ่ายทอดสดแมนยูลิเวอร์พูล,ลิเวอร์พูล สด,ลิเวอร์พูลวันนี้,บอลลิเวอร์พูลแมนยู,แมนยูเจอลิเวอร์พูล,แมนยูพบลิเวอร์พูลดูที่ไหน,บอลสดคืนนี้,ลิเวอร์พูล vs แมนยูไลฟ์สด,tv ดู บอล สด,ดู บอล สด พรีเมียร์ ลีก,ผลบอลลิเวอร์พูลล่าสุด,สกอร์บอลแมนยูลิเวอร์พูล,ดูบอลสดลิเวอร์พูลวันนี้,ลิเวอร์พูล ล่าสุด,แมนยูvsลิเวอร์พูล,ยูไนเต็ด,ไลฟ์สดบอลแมนยูวันนี้,ถ่ายทอดสดบอล,สด,ไลฟ์สด บอล,ดูบอลสด 68,ดุบอล,ผลบอลสดแมนยู,บอลแมนยูลิเวอร์พูลวันนี้,ลิเวอร์,ดูบอลลิเวอร์พูล,ถ่ายทอดสดฟุตบอลพรีเมียร์ลีก,เว็ปดูบอล,ผลบอลล่าสุด,ดูลิเวอร์พูลสด,pptv ถ่ายทอดสด บอล วัน นี้,ดูบอลแมนยูสด,ดูบอลออนไลน์ แมนยู,pptv,tv ดูบอลสดวันนี้,ตารางบอลวันนี้ ถ่ายทอดสด,ลิเวอร์พูล vs แมนยู สด ฟรี,ไลฟ์สดแมนยูลิเวอร์พูล,บอลสดลิเวอร์พูล,ลิเวอร์พูล กับ แมนยู,monomax สด,แมนยูดูบอลสด,ดู บอล สด แมน ยู,ลิเวอร์พูล ดูบอลสดฟรี,ฟุตบอลพรีเมียร์ลีกแมนยูลิเวอร์พูล,โปรแกรมลิเวอร์พูล,ดูบอลสดลิเวอร์พูลแมนยู,ดูบอลออนไลน์ พรีเมียร์ลีก,คาเซมิโร่,ดูบอลสด ลิเวอร์พูล,แมนยูบอลสด,ผลบอลลิเวอร์พูลแมนยู,ดูบอลออนไลน์แมนยูวันนี้,บอลแดงเดือด,แมนเชสเตอร์ยูไนเต็ด,แอนฟิลด์,บอลสดวันนี้ลิเวอร์พูล,ดู-บอล,ดู บอล ออนไลน์ พรีเมียร์ ลีก,แมนยูกับลิเวอร์พูลใครชนะ,ลิเวอร์พูลพบแมนยู สด,ลิเวอร์พูล vs แมน ยู สด,ดูบอลสดวันนี้แมนยู,ดูบอลลิเวอร์พูลวันนี้,ผลบอลสดเมื่อคืน,แมนยู พบ สโมสรฟุตบอลลิเวอร์พูล,โปรแกรมพรีเมียร์ลีก,นักเตะลิเวอร์พูล,บอลสด live สด,ดู บอล,แมนยู ล่าสุด สด,ดูบอล แมนยู,ดู-บอล-สด,ลิเวอร์พูล vs แมนยูดูได้ที่ไหน,ไลฟ์สดฟุตบอล,สกอร์บอลแมนยู,ดูบอลสดแมนยูวันนี้,บอลวันนี้ แมนยู,ดูบอลเถื่อนสด,ตารางบอลแมนยู,พรีเมียร์,ถ่ายทอดสดลิเวอร์พูลแมนยู,แมนยูคืนนี้,ดูแมนยูลิเวอร์พูล,ถ่ายทอดสดแมนยู,ผลพรีเมียร์ลีก,แมนยูถ่ายทอดสด,แมนยูพบลิเวอร์พูล ดูสด,ดูบอลออนไลน์ลิเวอร์พูล,ลิเวอร์พูล พบ แมน ยู,บอลสดวันนี้แมนยูลิเวอร์พูล,บอลสดพรีเมียร์ลีก,คะแนนพรีเมียร์ลีกล่าสุด,ตารางบอลลิเวอร์พูล,ผลแมนยูล่าสุด,ดูบอลลิเวอร์พูลกับแมนยู,ลิเวอร์พูลแมนยูล่าสุด,ผลบอลแมนยูล่าสุด,ไลฟ์สดบอลคืนนี้,ดูลิเวอร์พูล,เว็ปดูบอลสด,สกอร์แมนยู,โปรแกรมบอลพรีเมียร์ลีก,แมน-ยู,มัตไตส์ เดอ ลิคต์,แมนยู vs ลิเวอร์พูลสด,แมนยูกับลิเวอร์พูลล่าสุด,สกอบอลวันนี้,pptv ถ่ายทอดสด ลิเวอร์พูล วันนี้,ดูแมนยูพบลิเวอร์พูล,ดูบอลเถื่อนลิเวอร์พูล,หงส์แดง,ลิงค์ดูบอลสดวันนี้,ลิเวอร์พูลพบแมนยูวันนี้,ผลบอลแดงเดือด,แมนยู ถ่ายทอดสด วันนี้,ดูกีฬาสด,แข่งบอลแมนยูกับลิเวอร์พูล,สยามกีฬา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5%20vs%20%E0%B9%81%E0%B8%A1%E0%B8%99%E0%B8%A2%E0%B8%B9&geo=TH&hl=th",
  },
  {
    term: "ราคาทองวันนี้",
    searchVolume: "200K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ราคาทองวันนี้,ราคาทอง,ทองวันนี้,23 ตุลาคม,ราคาทองคำ,ราคาทองตอนนี้,ราคาทองล่าสุด,ทอง,ทองคําวันนี้,ราคาทองวันนี้ล่าสุด,ราคาทองคำวันนี้,กราฟทอง,ทองคำ,gold spot,ราคาทองโลก,หุ้นทอง,ทองลง,ราคาทองวันนี้รูปพรรณ 1 บาทวันนี้ล่าสุดวันนี้,ราคา ทอง,ฮั่วเซ่งเฮง,ราคาทอง 1 บาทวันนี้,ราคาทองวันนี้ 22 ตค 68,ราคาทองแท่งวันนี้,ทองคำวันนี้,ราคาทองรูปพรรณวันนี้,ราคา,ราคาทองวันนี้ รูปพรรณ 1 บาท วันนี้ล่าสุด วันนี้,ราคาทองโลกวันนี้,23 ตุลาคม 2568,ราคาทองวันนี้23/10/68,ราคาทองวันนี้ รูปพรรณ 1 บาท วันนี้ล่าสุดวันนี้,ราคาทอง 22 ตค 68,แนวโน้มราคาทอง,เช็คราคาทองวันนี้,ราคาทองคำโลก,ราคาทองปัจจุบัน,ราคาทองเรียลไทม์,ตารางราคาทองวันนี้ล่าสุด,ราคาทองฮั่วเซ่งเฮง,ราคาทองรูปพรรณ,ราคาทองวันที่ 20 ตค 68",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "อาร์เซนอล พบ แอตเลติโก มาดริด",
    searchVolume: "50K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "อาร์เซนอล พบ แอตเลติโก มาดริด,มาดริด,อาร์เซนอล,อาร์เซน่อล,แอตเลติโก มาดริด,อาเซนอล,soccersuck,อาร์เซนอล vs แอตเลติโก มาดริด,แอตมาดริด,อาร์เซนอล vs โอลิมเปียกอส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B8%99%E0%B8%AD%E0%B8%A5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%AD%E0%B8%95%E0%B9%80%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B9%82%E0%B8%81%20%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "เรอัลมาดริด พบ ยูเวนตุส",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เรอัลมาดริด พบ ยูเวนตุส,เรอัลมาดริด,มาร์กเซย,เรอัลมาดริด vs ยูเวนตุส,ยูเวนตุส,เรอัล มาดริด,โปรแกรมบอล,โปรแกรมบอลวันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A3%E0%B8%AD%E0%B8%B1%E0%B8%A5%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A2%E0%B8%B9%E0%B9%80%E0%B8%A7%E0%B8%99%E0%B8%95%E0%B8%B8%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "ตารางคะแนนยูฟ่าแชมเปียนส์ลีก",
    searchVolume: "50K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ตารางคะแนนยูฟ่าแชมเปียนส์ลีก,บาร์ซา พบ โอลิมเปียกอส,ตารางยูฟ่าแชมเปียนส์ลีก,บาซ่า,ลำดับของ ยูฟ่าแชมเปียนส์ลีก,บาร์เซโลน่า,ตารางคะแนนยูฟ่า,ผลบอลยูฟ่าแชมป์เปียนลีก,เฟร์มิน โลเปซ,บาร์ซา vs โอลิมเปียกอส,โอลิมเปียกอส,ตารางคะแนนยูฟ่าแชมป์เปียนลีก,มาร์คัส แรชฟอร์ด,ตารางคะแนนยูฟ่าแชมเปียนส์ลีกล่าสุด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B8%B0%E0%B9%81%E0%B8%99%E0%B8%99%E0%B8%A2%E0%B8%B9%E0%B8%9F%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B9%8C%E0%B8%A5%E0%B8%B5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "สงคราม หมอลํา ep 23",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "สงคราม หมอลํา ep 23,สงคราม หมอ ลํา ep 23,สงคราม หมอ ลํา ep 22,สงคราม หมอลํา ep 22,สงคราม หมอลํา ep 21,ช่อง31,สงคราม หมอ ลํา ep 21,ช่องวัน,ช่องวัน 31",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%87%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%A1%20%E0%B8%AB%E0%B8%A1%E0%B8%AD%E0%B8%A5%E0%B9%8D%E0%B8%B2%20ep%2023&geo=TH&hl=th",
  },
  {
    term: "เฟเยนูร์ด",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เฟเยนูร์ด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9F%E0%B9%80%E0%B8%A2%E0%B8%99%E0%B8%B9%E0%B8%A3%E0%B9%8C%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "23 ตุลาคมวันปิยมหาราชธนาคารหยุดไหม",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "23 ตุลาคมวันปิยมหาราชธนาคารหยุดไหม,23 ตุลาคม 2568 วันอะไร,วันปิยมหาราชหยุดไหม,วันปิยมหาราชธนาคารหยุดไหม,วันหยุดเดือนตุลาคม 2568,23 ตุลาคมวันปิยมหาราช,วันหยุดนักขัตฤกษ์,วันหยุดธนาคาร 2568,วันหยุดราชการ 2568,วันหยุดธนาคาร,วันนี้ธนาคารหยุดไหม,วันหยุด",
    exploreLink: "https://trends.google.com/trends/explore?q=23%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AB%E0%B8%A2%E0%B8%B8%E0%B8%94%E0%B9%84%E0%B8%AB%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "บาเยิร์น พบ คลับ บรูกก์",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเยิร์น พบ คลับ บรูกก์,บาเยิร์น,บาเยิร์น มิวนิค",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%A2%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%9A%20%E0%B8%9A%E0%B8%A3%E0%B8%B9%E0%B8%81%E0%B8%81%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "มาดามแป้ง",
    searchVolume: "5K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มาดามแป้ง,อิชิอิ,แอนโทนี่ฮัดสัน,ชาญวิทย์ผลชีวิน,ชาญวิทย์ ผลชีวิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%9B%E0%B9%89%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "มอนาโก พบ สเปอร์ส",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "มอนาโก พบ สเปอร์ส,สเปอร์ส,โมนาโกบอล,โมนาโก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B9%82%E0%B8%81%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AA%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "classroom",
    searchVolume: "2K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "classroom",
    exploreLink: "https://trends.google.com/trends/explore?q=classroom&geo=TH&hl=th",
  },
  {
    term: "บียาร์เรอัล พบ แมนซิตี",
    searchVolume: "20K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "บียาร์เรอัล พบ แมนซิตี,แมนซิตี้,แมนซิ,บียาร์เรอัล,สโมสรฟุตบอลแมนเชสเตอร์ซิตี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%A3%E0%B8%AD%E0%B8%B1%E0%B8%A5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%A1%E0%B8%99%E0%B8%8B%E0%B8%B4%E0%B8%95%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "uefa champions league",
    searchVolume: "10K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "uefa champions league",
    exploreLink: "https://trends.google.com/trends/explore?q=uefa%20champions%20league&geo=TH&hl=th",
  },
  {
    term: "เฟิร์นสุชาดาผู้ประกาศข่าว",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เฟิร์นสุชาดาผู้ประกาศข่าว,กรรมกรข่าวคุยนอกจอ,สุชาดา นิ่มนวล,เฟิร์นสุชาดานิ่มนวล,เฟิร์น สุชาดา,สุชาดานิ่มนวล,เฟิร์นสุชาดา,เฟิร์นสุชาดานิ่มนวลประวัติ,เฟิร์น สุชาดา นิ่มนวล ประวัติ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%94%E0%B8%B2%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7&geo=TH&hl=th",
  },
  {
    term: "ตรวจหวยลาวงวด 22 ตุลาคม 2568",
    searchVolume: "50K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ตรวจหวยลาวงวด 22 ตุลาคม 2568,ผลหวยลาว 22 ตุลาคม 2568,หวยลาววันนี้,หวยลาว,หวยลาว22/10/68,ผลหวยลาว,หวยลาววันนี้ออกอะไร,ตรวจหวยลาว22/10/68,หวยลาวออกอะไร,ผลหวยลาว22/10/68,เลขลาววันนี้,หวยลาวพัฒนาวันนี้,ตรวจหวยลาววันนี้,ถ่ายทอดสดหวยลาววันนี้,แนวทางหวยลาววันนี้,ลาวพัฒนา,ผลหวยลาววันนี้,ผลหวยลาววัน,หวยลาววันนี้ 4 ตัว,หวยลาว ย้อน หลัง,ลาววันนี้,หวยลาวออก,หวยลาวพัฒนา,หวยลาวพัฒนาวันนี้ สด,หวยลาว 6 ตัว วันนี้,ผลหวยลาวย้อนหลัง,หวยลาวออกอะไรวันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B8%A5%E0%B8%B2%E0%B8%A7%E0%B8%87%E0%B8%A7%E0%B8%94%2022%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th",
  },
  {
    term: "เมลเบิร์น ซิตี้ พบ บุรีรัมย์ ยูไนเต็ด",
    searchVolume: "20K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เมลเบิร์น ซิตี้ พบ บุรีรัมย์ ยูไนเต็ด,บุรีรัมย์ยูไนเต็ด,บุรีรัมย์ ยูไนเต็ด,บุรีรัมย์,เมลเบิร์น ซิตี้ vs บุรีรัมย์ ยูไนเต็ด,acl elite",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A1%E0%B8%A5%E0%B9%80%E0%B8%9A%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%20%E0%B8%8B%E0%B8%B4%E0%B8%95%E0%B8%B5%E0%B9%89%20%E0%B8%9E%E0%B8%9A%20%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%B1%E0%B8%A1%E0%B8%A2%E0%B9%8C%20%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "eintracht frankfurt vs liverpool",
    searchVolume: "10K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "eintracht frankfurt vs liverpool,liverpool,liverpool vs frankfurt",
    exploreLink: "https://trends.google.com/trends/explore?q=eintracht%20frankfurt%20vs%20liverpool&geo=TH&hl=th",
  },
  {
    term: "เทศกาลกินเจ",
    searchVolume: "20K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เทศกาลกินเจ,อาหารเจ,เจ,เยาวราช",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%81%E0%B8%B2%E0%B8%A5%E0%B8%81%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%88&geo=TH&hl=th",
  },
  {
    term: "stella sora tier list",
    searchVolume: "20K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "stella sora tier list,stella sora,stella sora code",
    exploreLink: "https://trends.google.com/trends/explore?q=stella%20sora%20tier%20list&geo=TH&hl=th",
  },
  {
    term: "ลีลล์",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ลีลล์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B5%E0%B8%A5%E0%B8%A5%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "เวสต์แฮม พบ เบรนท์ฟอร์ด",
    searchVolume: "20K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เวสต์แฮม พบ เบรนท์ฟอร์ด,เบรนท์ฟอร์ด,เวสต์แฮม,บอลคืนนี้,ผลบอลพรีเมียร์ลีก,เวสต์แฮม vs เบรนท์ฟอร์ด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A7%E0%B8%AA%E0%B8%95%E0%B9%8C%E0%B9%81%E0%B8%AE%E0%B8%A1%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%9A%E0%B8%A3%E0%B8%99%E0%B8%97%E0%B9%8C%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "ฟอเรสต์ พบ เชลซี",
    searchVolume: "50K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ฟอเรสต์ พบ เชลซี,เชลซี,สโมสรฟุตบอลเชลซี,เชลซีล่าสุด,ลีด,ดูบาสสด,ดูบอลสดเชลซี,ผลบอลเชลซี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9F%E0%B8%AD%E0%B9%80%E0%B8%A3%E0%B8%AA%E0%B8%95%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%8A%E0%B8%A5%E0%B8%8B%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "ราชบุรี เอฟซี พบ อีสเทิร์น",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ราชบุรี เอฟซี พบ อีสเทิร์น,เอเอฟซี,ราชบุรีมิตรผล,ราชบุรี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%20%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AD%E0%B8%B5%E0%B8%AA%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "nottm forest vs porto",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "nottm forest vs porto,europa league",
    exploreLink: "https://trends.google.com/trends/explore?q=nottm%20forest%20vs%20porto&geo=TH&hl=th",
  },
  {
    term: "ฟูลัม พบ อาร์เซนอล",
    searchVolume: "200K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ฟูลัม พบ อาร์เซนอล,ดูบอล66,ดูบอลสด 66,บอลสด66,ดูบอลสด66,ดูบอล 66,อาร์เซนอล,ตารางบอล,ดู บอล สด 66,อาร์เซน่อล,ดูบอลสด 66 วันนี้,ดูบอลสดพรีเมียร์ลีก,ฟูแล่ม,อาเซนอล,สโมสรฟุตบอลอาร์เซนอล,ดู บอล 66,ดู บอล66",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9F%E0%B8%B9%E0%B8%A5%E0%B8%B1%E0%B8%A1%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AD%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B8%99%E0%B8%AD%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "โบโลญญ่า",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "โบโลญญ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ฝนดาวตกวันนี้",
    searchVolume: "20K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ฝนดาวตกวันนี้,ดาวหางฝนดาวตก,ฝนดาวตก,ดาวตก,ดาวตกวันนี้,ทางช้างเผือก,ฝนดาวตกดาวหาง,ดาวหาง,ฝนดาวตกวันที่ 21 ตุลาคม 2568,ฝนดาวตกโอไรออนิดส์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9D%E0%B8%99%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "โรม่า",
    searchVolume: "1K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "โรม่า,ฟอเรสต์,น็อตติ้งแฮม ฟอเรสต์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "สเปอร์ส พบ แอสตันวิลลา",
    searchVolume: "50K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "สเปอร์ส พบ แอสตันวิลลา,สเปอร์ส,สเปอร์ส vs แอสตันวิลลา,ดูบอลสเ,สเปอ,ais play ดูบอล,บอลสเ,สเปอร์,สเปอร์สพบแอสตันวิลลา,ดูบอลส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%AD%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "นิวคาสเซิล พบ เบนฟิกา",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "นิวคาสเซิล พบ เบนฟิกา,นิวคาสเซิล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B8%B4%E0%B8%A7%E0%B8%84%E0%B8%B2%E0%B8%AA%E0%B9%80%E0%B8%8B%E0%B8%B4%E0%B8%A5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%9A%E0%B8%99%E0%B8%9F%E0%B8%B4%E0%B8%81%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "champions league",
    searchVolume: "5K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "champions league",
    exploreLink: "https://trends.google.com/trends/explore?q=champions%20league&geo=TH&hl=th",
  },
  {
    term: "วรภัค ธันยาวงษ์",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "วรภัค ธันยาวงษ์,วรภัค,วรภัคคือใคร,วรภัคธันยาวงษ์ประวัติ,สแกมเมอร์คืออะไร,วรภัคธันยาวงษ์สแกมเมอร์,live,วรภัคธันยาวงษ์,วรภัค ธันยาวงษ์ ประวัติ,วรภัค ลาออก,ธรรมนัส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%A3%E0%B8%A0%E0%B8%B1%E0%B8%84%20%E0%B8%98%E0%B8%B1%E0%B8%99%E0%B8%A2%E0%B8%B2%E0%B8%A7%E0%B8%87%E0%B8%A9%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "go ahead eagles vs aston villa",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "go ahead eagles vs aston villa,aston villa",
    exploreLink: "https://trends.google.com/trends/explore?q=go%20ahead%20eagles%20vs%20aston%20villa&geo=TH&hl=th",
  },
  {
    term: "เปเอสเฟ พบ นาโปลี",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เปเอสเฟ พบ นาโปลี,นาโปลี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9B%E0%B9%80%E0%B8%AD%E0%B8%AA%E0%B9%80%E0%B8%9F%20%E0%B8%9E%E0%B8%9A%20%E0%B8%99%E0%B8%B2%E0%B9%82%E0%B8%9B%E0%B8%A5%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "แมนซิตี พบ เอฟเวอร์ตัน",
    searchVolume: "50K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "แมนซิตี พบ เอฟเวอร์ตัน,แมนซิตี้,แมนซิตี vs เอฟเวอร์ตัน,แมนซิ,เบิร์นลี่ย์,สโมสรฟุตบอลแมนเชสเตอร์ซิตี,แมนซิตี้ล่าสุด,แมนซิตี้พบเอฟเวอร์ตัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%A1%E0%B8%99%E0%B8%8B%E0%B8%B4%E0%B8%95%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B1%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "chatgpt atlas",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "chatgpt atlas,atlas,chatgpt atlas browser",
    exploreLink: "https://trends.google.com/trends/explore?q=chatgpt%20atlas&geo=TH&hl=th",
  },
  {
    term: "อุณหภูมิ",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "อุณหภูมิ,สภาพอากาศวันนี้,อากาศวันนี้,อากาศ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B8%E0%B8%93%E0%B8%AB%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4&geo=TH&hl=th",
  },
  {
    term: "กาลาตาซาราย",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "กาลาตาซาราย,สปอร์ติงลิสบอน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B2%E0%B8%A5%E0%B8%B2%E0%B8%95%E0%B8%B2%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "liverpool vs man united",
    searchVolume: "20K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "liverpool vs man united,liverpool vs man u,manu,man u vs liverpool live,manchester united vs liverpool,man united vs liverpool",
    exploreLink: "https://trends.google.com/trends/explore?q=liverpool%20vs%20man%20united&geo=TH&hl=th",
  },
  {
    term: "รันทากาฮาชิ",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "รันทากาฮาชิ,ran takahashi,รัน ทากาฮาชิ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%AE%E0%B8%B2%E0%B8%8A%E0%B8%B4&geo=TH&hl=th",
  },
  {
    term: "gold prices",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "gold prices,gold price,gold,xauusd",
    exploreLink: "https://trends.google.com/trends/explore?q=gold%20prices&geo=TH&hl=th",
  },
  {
    term: "ตี๋น้อย",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ตี๋น้อย,สุกี้ตี๋น้อย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "เซลติก",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลติก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "ไฟร์บวร์ก",
    searchVolume: "2K+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฟร์บวร์ก,แฟร้งค์เฟิร์ต,ซังค์ เพาลี,ฮอฟเฟ่นไฮม์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9F%E0%B8%A3%E0%B9%8C%E0%B8%9A%E0%B8%A7%E0%B8%A3%E0%B9%8C%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "เอฟซีเอสบี พบ โบโลญญ่า",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "เอฟซีเอสบี พบ โบโลญญ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%E0%B9%80%E0%B8%AD%E0%B8%AA%E0%B8%9A%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "nba",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "nba",
    exploreLink: "https://trends.google.com/trends/explore?q=nba&geo=TH&hl=th",
  },
  {
    term: "เฉินเหว่ยถิง",
    searchVolume: "10K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เฉินเหว่ยถิง,เหอซุ่ย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%89%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%A7%E0%B9%88%E0%B8%A2%E0%B8%96%E0%B8%B4%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "raven2",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "raven2,ตต",
    exploreLink: "https://trends.google.com/trends/explore?q=raven2&geo=TH&hl=th",
  },
  {
    term: "บาร์ซา พบ คิโรน่า",
    searchVolume: "20K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "บาร์ซา พบ คิโรน่า,บาซ่า,ลาลิกา,บาร์ซา vs คิโรน่า,bein sport,สโมสรฟุตบอลบาร์เซโลนา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%8B%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%84%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%99%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ท่องเที่ยวลดหย่อนภาษี",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ท่องเที่ยวลดหย่อนภาษี,เที่ยวดีมีคืน,ลดหย่อนภาษี 2568,มาตรการลดหย่อนภาษี 2568 ท่องเที่ยว",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "หวยลาว20/10/68",
    searchVolume: "100K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "หวยลาว20/10/68,หวยลาว17/10/68,ตรวจหวยลาวงวด,ตรวจหวยลาวงวด 17 ตุลาคม 2568,หวยลาววันนี้,หวยลาว,หวยลาวออกอะไร,ตรวจหวยลาว,หวยลาววันนี้ออกอะไร,เลขลาว,ผลหวยลาววันนี้,ตรวจหวยลาว20/10/68,หวยลาวพัฒนาวันนี้,ตรวจหวยลาววันนี้,ลาวพัฒนา,ผลหวยลาว20/10/68,ตรวจหวยลาว17/10/68,หวยลาว 6 ตัว วันนี้,หวยลาว 20/10/68,ผลหวยลาว17/10/68,ลาว,หวยลาว 17/10/68,หวยลาว ย้อน หลัง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B8%A5%E0%B8%B2%E0%B8%A720%2F10%2F68&geo=TH&hl=th",
  },
  {
    term: "บราก้า",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "บราก้า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%A3%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "chelsea vs ajax",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "chelsea vs ajax,chelsea",
    exploreLink: "https://trends.google.com/trends/explore?q=chelsea%20vs%20ajax&geo=TH&hl=th",
  },
  {
    term: "toyota land cruiser fj",
    searchVolume: "5K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "toyota land cruiser fj",
    exploreLink: "https://trends.google.com/trends/explore?q=toyota%20land%20cruiser%20fj&geo=TH&hl=th",
  },
  {
    term: "canva",
    searchVolume: "100K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "canva,aws outage,roblox,roblox status,aws down,amazon,canvas,aws status,downdetector,duolingo,zoom,perplexity,asana,epic games,roblox down,reddit,epic game,supercell,snapchat,slack,amazon outage,pubg",
    exploreLink: "https://trends.google.com/trends/explore?q=canva&geo=TH&hl=th",
  },
  {
    term: "ทางด่วนฟรี 23 ตุลาคม 2568",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ทางด่วนฟรี 23 ตุลาคม 2568,ทางด่วนฟรี 23 ตุลาคม,ทางด่วนฟรี,วันนี้ทางด่วนฟรีไหม,วันหยุด 2568",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%94%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%9F%E0%B8%A3%E0%B8%B5%2023%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th",
  },
  {
    term: "บาเยิร์น พบ ดอร์ทมุนด์",
    searchVolume: "20K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเยิร์น พบ ดอร์ทมุนด์,บาเยิร์น,บาเยิร์น vs ดอร์ทมุนด์,บุนเดิสลีกา,บาเยิร์น มิวนิค,อาร์บี ไลป์ซิก,บุนเดสลีกา,ตารางคะแนนบุนเดสลีกา,ผลบอลบุนเดสลีกา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%A2%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B8%A1%E0%B8%B8%E0%B8%99%E0%B8%94%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ไบรท์ตัน พบ นิวคาสเซิล",
    searchVolume: "20K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไบรท์ตัน พบ นิวคาสเซิล,นิวคาสเซิล,ไบรท์ตัน vs นิวคาสเซิล,ไบรท์ตัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9A%E0%B8%A3%E0%B8%97%E0%B9%8C%E0%B8%95%E0%B8%B1%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%99%E0%B8%B4%E0%B8%A7%E0%B8%84%E0%B8%B2%E0%B8%AA%E0%B9%80%E0%B8%8B%E0%B8%B4%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "streaming",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "streaming",
    exploreLink: "https://trends.google.com/trends/explore?q=streaming&geo=TH&hl=th",
  },
  {
    term: "twice",
    searchVolume: "10K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "twice",
    exploreLink: "https://trends.google.com/trends/explore?q=twice&geo=TH&hl=th",
  },
  {
    term: "aws",
    searchVolume: "10K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "aws,aws ล่ม,roblox ล่ม,amazon web services aws ล่ม,amazon web services ล่ม",
    exploreLink: "https://trends.google.com/trends/explore?q=aws&geo=TH&hl=th",
  },
  {
    term: "บ้านผลบอล",
    searchVolume: "20K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "บ้านผลบอล,ชลบุรี พบ เชียงราย ยูไนเต็ด,ระยอง พบ ประจวบ,บ้าน ผล บอล,ชลบุรีเอฟซี,ระยอง fc,ระยอง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9C%E0%B8%A5%E0%B8%9A%E0%B8%AD%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "f",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "f",
    exploreLink: "https://trends.google.com/trends/explore?q=f&geo=TH&hl=th",
  },
  {
    term: "myanmar",
    searchVolume: "2K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "myanmar",
    exploreLink: "https://trends.google.com/trends/explore?q=myanmar&geo=TH&hl=th",
  },
  {
    term: "กฎหมายนิรโทษกรรมล่าสุด",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "กฎหมายนิรโทษกรรมล่าสุด,ทวีสอดส่อง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%99%E0%B8%B4%E0%B8%A3%E0%B9%82%E0%B8%97%E0%B8%A9%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%A5%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B8%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "อตาลันต้า",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "อตาลันต้า,อตาลันต้า พบ สลาเวีย ปราก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%95%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "บิลเบา",
    searchVolume: "10K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "บิลเบา,ดูบอลสด66,ดูบอล 66,ดูบอลสด 66,แอธเลติกบิลเบา,แอธเลติก บิลเบา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B9%80%E0%B8%9A%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ตารางคะแนนพรีเมียร์ลีก",
    searchVolume: "50K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ตารางคะแนนพรีเมียร์ลีก,คะแนนพรีเมียร์ลีก,ตารางอันดับพรีเมียร์ลีก,ตารางพรีเมียร์ลีก,ตารางคะแนนพรีเมียร์ลีก 2025 ล่าสุด,ตารางพรีเมียร์ลีกล่าสุด,ตารางคะแนน,ตาราง,ตารางคะแนนพรีเมียร์ลีกล่าสุด,ตารางฟุตบอล,แมนยู ตารางคะแนน,ตารางแข่งพรีเมียร์ลีก,ตารางแข่งลิเวอร์พูล,พรีเมียร์ลีก ตารางคะแนน,ลิเวอร์พูล ตารางคะแนน,ตารางพรีเมียร์ลีก 2025,ตารางคะแนนพรีเมียร์ลีก 2025,พรีเมียร์ลีกตารางคะแนน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B8%B0%E0%B9%81%E0%B8%99%E0%B8%99%E0%B8%9E%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%A1%E0%B8%B5%E0%B8%A2%E0%B8%A3%E0%B9%8C%E0%B8%A5%E0%B8%B5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "ยูนิยง แซงต์ กิลลุส พบ อินเตอร์",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ยูนิยง แซงต์ กิลลุส พบ อินเตอร์,อินเตอร์,อินเตอร์มิลาน,อินเตอร์ มิลาน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A2%E0%B8%B9%E0%B8%99%E0%B8%B4%E0%B8%A2%E0%B8%87%20%E0%B9%81%E0%B8%8B%E0%B8%87%E0%B8%95%E0%B9%8C%20%E0%B8%81%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B8%E0%B8%AA%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "man u",
    searchVolume: "50K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "man u,liverpool,harry maguire,manchester united,manu vs liverpool,premier league,football live,man utd,man u liverpool,liverpool vs man united live,manu liverpool,bryan mbeumo,man united,liverpool f.c.,live football,liverpool vs man u live,manchester united f.c.,epl,premier,liverpool f.c. vs manchester united f.c.,gakpo,liverpool vs manu,liverpool fc,liverpool man u,liverpool vs manchester united",
    exploreLink: "https://trends.google.com/trends/explore?q=man%20u&geo=TH&hl=th",
  },
  {
    term: "india vs australia",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "india vs australia,ind vs aus,india national cricket team vs australian men’s cricket team match scorecard",
    exploreLink: "https://trends.google.com/trends/explore?q=india%20vs%20australia&geo=TH&hl=th",
  },
  {
    term: "arsenal vs atlético madrid",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "arsenal vs atlético madrid",
    exploreLink: "https://trends.google.com/trends/explore?q=arsenal%20vs%20atl%C3%A9tico%20madrid&geo=TH&hl=th",
  },
  {
    term: "miss grand international 2025",
    searchVolume: "20K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "miss grand international 2025,มิสแกรนด์อินเตอร์เนชั่นแนล 2025,miss grand international,กชเบล,อินเตอร์,มิสแกรนด์อินเตอร์เนชั่นแนล 2025 ไฟนอล,ประกวด miss grand international 2025,ประกวดมิสแกรนด์อินเตอร์เนชั่นแนล 2025,ฟิลิปปินส์,ถ่ายทอดสดมิสแกรนด์อินเตอร์เนชั่นแนล 2025,มิสแกรนด์",
    exploreLink: "https://trends.google.com/trends/explore?q=miss%20grand%20international%202025&geo=TH&hl=th",
  },
  {
    term: "เชลซี",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เชลซี,สโมสรฟุตบอลเชลซี,ผลบอลสด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8A%E0%B8%A5%E0%B8%8B%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "มัลโม่",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "มัลโม่",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B9%82%E0%B8%A1%E0%B9%88&geo=TH&hl=th",
  },
  {
    term: "canva ล่ม",
    searchVolume: "5K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "canva ล่ม,canva ล้ม,canva เข้าไม่ได้,แคนวาล่ม,canva ล่ม วันนี้,เข้า canva ไม่ได้",
    exploreLink: "https://trends.google.com/trends/explore?q=canva%20%E0%B8%A5%E0%B9%88%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "กปว",
    searchVolume: "2K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "กปว",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%9B%E0%B8%A7&geo=TH&hl=th",
  },
  {
    term: "lec",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th",
  },
  {
    term: "วันพยาบาลแห่งชาติ",
    searchVolume: "2K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "วันพยาบาลแห่งชาติ,วันพยาบาลแห่งชาติ 2568",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4&geo=TH&hl=th",
  },
  {
    term: "ธนาคารออมสิน",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารออมสิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "เลสเตอร์ พบ พอร์ตสมัท",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "เลสเตอร์ พบ พอร์ตสมัท",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A5%E0%B8%AA%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B8%9E%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%97&geo=TH&hl=th",
  },
  {
    term: "อลาเบส",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "อลาเบส,บาเลนเซีย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%A5%E0%B8%B2%E0%B9%80%E0%B8%9A%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "ซันเดอร์แลนด์ พบ วูล์ฟแฮมป์ตัน",
    searchVolume: "10K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ซันเดอร์แลนด์ พบ วูล์ฟแฮมป์ตัน,ซันเดอร์แลนด์,วูล์ฟแฮมป์ตัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8B%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%99%E0%B8%94%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A7%E0%B8%B9%E0%B8%A5%E0%B9%8C%E0%B8%9F%E0%B9%81%E0%B8%AE%E0%B8%A1%E0%B8%9B%E0%B9%8C%E0%B8%95%E0%B8%B1%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "ช่อง3",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่อง3",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%873&geo=TH&hl=th",
  },
  {
    term: "barcelona vs olympiacos",
    searchVolume: "2K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "barcelona vs olympiacos",
    exploreLink: "https://trends.google.com/trends/explore?q=barcelona%20vs%20olympiacos&geo=TH&hl=th",
  },
  {
    term: "ระบบ",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ระบบ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A&geo=TH&hl=th",
  },
  {
    term: "นีซ",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "นีซ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B8%B5%E0%B8%8B&geo=TH&hl=th",
  },
  {
    term: "เฉินป๋อหลิน",
    searchVolume: "2K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เฉินป๋อหลิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%89%E0%B8%B4%E0%B8%99%E0%B8%9B%E0%B9%8B%E0%B8%AD%E0%B8%AB%E0%B8%A5%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "โคโม่ พบ ยูเวนตุส",
    searchVolume: "20K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "โคโม่ พบ ยูเวนตุส,ดูบอลฟรี,ยูเวนตุส,โคโม่ vs ยูเวนตุส,โคโม่",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%84%E0%B9%82%E0%B8%A1%E0%B9%88%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A2%E0%B8%B9%E0%B9%80%E0%B8%A7%E0%B8%99%E0%B8%95%E0%B8%B8%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "วันนี้วันอะไร",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "วันนี้วันอะไร",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3&geo=TH&hl=th",
  },
  {
    term: "man u vs liverpool",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "man u vs liverpool",
    exploreLink: "https://trends.google.com/trends/explore?q=man%20u%20vs%20liverpool&geo=TH&hl=th",
  },
  {
    term: "มิลาน พบ ฟีออเรนตีนา",
    searchVolume: "5K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "มิลาน พบ ฟีออเรนตีนา,เอซีมิลาน,ฟิออเรนติน่า,เอซี มิลาน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B4%E0%B8%A5%E0%B8%B2%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%9F%E0%B8%B5%E0%B8%AD%E0%B8%AD%E0%B9%80%E0%B8%A3%E0%B8%99%E0%B8%95%E0%B8%B5%E0%B8%99%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "raven 2",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "raven 2",
    exploreLink: "https://trends.google.com/trends/explore?q=raven%202&geo=TH&hl=th",
  },
  {
    term: "afc champions league 2",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "afc champions league 2,goa vs al-nassr",
    exploreLink: "https://trends.google.com/trends/explore?q=afc%20champions%20league%202&geo=TH&hl=th",
  },
  {
    term: "ช่องวัน",
    searchVolume: "2K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่องวัน,ช่องวัน 31,สลักรักในแสงจันทร์ ep 12,สลักรักในแสงจันทร์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B1%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "โตรีโน พบ นาโปลี",
    searchVolume: "10K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "โตรีโน พบ นาโปลี,นาโปลี,โตรีโน vs นาโปลี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B9%82%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%99%E0%B8%B2%E0%B9%82%E0%B8%9B%E0%B8%A5%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "อภิสิทธิ์หัวหน้าพรรคประชาธิปัตย์",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "อภิสิทธิ์หัวหน้าพรรคประชาธิปัตย์,พรรคประชาธิปัตย์,อภิสิทธิ์ เวชชาชีวะ,อภิสิทธิ์,ตั๊น จิตภัสร์,ชัยวุฒิบรรณวัฒน์,อภิสิทธิ์เวชชาชีวะ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%A0%E0%B8%B4%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%9B%E0%B8%B1%E0%B8%95%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "บีจีพียู พบ อยุธยา ยูไนเต็ด",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "บีจีพียู พบ อยุธยา ยูไนเต็ด,บีจี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B5%E0%B8%88%E0%B8%B5%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%B9%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AD%E0%B8%A2%E0%B8%B8%E0%B8%98%E0%B8%A2%E0%B8%B2%20%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "bbl",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "bbl",
    exploreLink: "https://trends.google.com/trends/explore?q=bbl&geo=TH&hl=th",
  },
  {
    term: "มากเซย",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มากเซย,สปอร์ติ้ง,สปอร์ติ้ง ลิสบอน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%8B%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "พลอยโฟมโหนกระแส",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "พลอยโฟมโหนกระแส,โฟมโหนกระแส,พลอยโหนกระแส,โหนกระแสหนุ่มกรรชัย,โฟม โหนกระแส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A5%E0%B8%AD%E0%B8%A2%E0%B9%82%E0%B8%9F%E0%B8%A1%E0%B9%82%E0%B8%AB%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "ต้าห์อู๋",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ต้าห์อู๋",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B9%8C%E0%B8%AD%E0%B8%B9%E0%B9%8B&geo=TH&hl=th",
  },
  {
    term: "cpf",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "cpf",
    exploreLink: "https://trends.google.com/trends/explore?q=cpf&geo=TH&hl=th",
  },
  {
    term: "แอตเลติโก มาดริด พบ โอซาซูนา",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "แอตเลติโก มาดริด พบ โอซาซูนา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%AD%E0%B8%95%E0%B9%80%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B9%82%E0%B8%81%20%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94%20%E0%B8%9E%E0%B8%9A%20%E0%B9%82%E0%B8%AD%E0%B8%8B%E0%B8%B2%E0%B8%8B%E0%B8%B9%E0%B8%99%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "สโมสรฟุตบอลลิเวอร์พูล",
    searchVolume: "5K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "สโมสรฟุตบอลลิเวอร์พูล,สโมสรฟุตบอลอาร์เซนอล,สยามกีฬา,siamsport",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B8%AA%E0%B8%A3%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%A5%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B9%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "21 ตุลาคม 2568",
    searchVolume: "20K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "21 ตุลาคม 2568,ราคาทองคํา,ราคาทองวันที่ 20 ตค 68,ราคาทองคําแท่งวันนี้,ราคาทองวันนี้,ราคาทองวันนี้ 19 ตค 68,สมาคมค้าทอง,21 ตุลาคม,ราคาทองวันนี้ 18 ตค 68,ราคาทองตอนนี้,ราคาทองคำวันนี้,ราคาทองวันนี้ 20 ตุลาคม 2568,ราคาทองวันนี้ล่าสุด,ราคาทองแท่งวันนี้,ราคาทองวันนี้ รูปพรรณ 1 บาท วันนี้ล่าสุด วันนี้,ราคาทองล่าสุด,ราคาทองคำ,ทองคำ",
    exploreLink: "https://trends.google.com/trends/explore?q=21%20%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%202568&geo=TH&hl=th",
  },
  {
    term: "เรอัลมาดริด",
    searchVolume: "10K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เรอัลมาดริด,มาดริด,แอตเลติโก มาดริด,ไลฟ์สด,เรอัล มาดริด,แอธเลติก บิลเบา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A3%E0%B8%AD%E0%B8%B1%E0%B8%A5%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "ดอร์ทมุนด์",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ดอร์ทมุนด์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B8%A1%E0%B8%B8%E0%B8%99%E0%B8%94%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "รายการโหนกระแสหนุ่มกรรชัย",
    searchVolume: "5K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "รายการโหนกระแสหนุ่มกรรชัย,โหนกระแสหนุ่มกรรชัย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%82%E0%B8%AB%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%AA%E0%B8%AB%E0%B8%99%E0%B8%B8%E0%B9%88%E0%B8%A1%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "เจ้าคุณพี่ ep 14",
    searchVolume: "5K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "เจ้าคุณพี่ ep 14,คุณพี่กับอีนางคําดวง ep 14,เจ้าคุณ พี่ กับ อี นาง คํา ดวง ep 15,อีนางคําดวง ep 14",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9E%E0%B8%B5%E0%B9%88%20ep%2014&geo=TH&hl=th",
  },
  {
    term: "เซลต้า บีโก้",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลต้า บีโก้,เซลต้าบีโก้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B9%89%E0%B8%B2%20%E0%B8%9A%E0%B8%B5%E0%B9%82%E0%B8%81%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "มุกดา",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "มุกดา,ช่องวัน,เข้ม หัสวีร์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B8%E0%B8%81%E0%B8%94%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "villarreal vs man city",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "villarreal vs man city,man city",
    exploreLink: "https://trends.google.com/trends/explore?q=villarreal%20vs%20man%20city&geo=TH&hl=th",
  },
  {
    term: "boeing 737 windshield crack",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "boeing 737 windshield crack",
    exploreLink: "https://trends.google.com/trends/explore?q=boeing%20737%20windshield%20crack&geo=TH&hl=th",
  },
  {
    term: "fulham vs arsenal",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "fulham vs arsenal,1",
    exploreLink: "https://trends.google.com/trends/explore?q=fulham%20vs%20arsenal&geo=TH&hl=th",
  },
  {
    term: "arc raiders",
    searchVolume: "2K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "arc raiders",
    exploreLink: "https://trends.google.com/trends/explore?q=arc%20raiders&geo=TH&hl=th",
  },
  {
    term: "monaco vs tottenham",
    searchVolume: "1K+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "monaco vs tottenham,afc champions league",
    exploreLink: "https://trends.google.com/trends/explore?q=monaco%20vs%20tottenham&geo=TH&hl=th",
  },
  {
    term: "เบิร์นลีย์ พบ ลีดส์",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เบิร์นลีย์ พบ ลีดส์,ลีดส์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9A%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%A5%E0%B8%B5%E0%B8%A2%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A5%E0%B8%B5%E0%B8%94%E0%B8%AA%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ราคาน้ำมันวันนี้",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ราคาน้ำมันวันนี้,ราคาน้ำมัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "yvonne",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "yvonne",
    exploreLink: "https://trends.google.com/trends/explore?q=yvonne&geo=TH&hl=th",
  },
  {
    term: "อูดิเนเซ่",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "อูดิเนเซ่,เครโมเนเซ่",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B9%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B9%88&geo=TH&hl=th",
  },
  {
    term: "เมืองทอง พบ แบงค็อก ยูไนเต็ด",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เมืองทอง พบ แบงค็อก ยูไนเต็ด,เมืองทอง,บอลสดฟรีวันนี้,ทรู,muangthong united vs bangkok united",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%AD%E0%B8%87%20%E0%B8%9E%E0%B8%9A%20%E0%B9%81%E0%B8%9A%E0%B8%87%E0%B8%84%E0%B9%87%E0%B8%AD%E0%B8%81%20%E0%B8%A2%E0%B8%B9%E0%B9%84%E0%B8%99%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "ฉลามจัส",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ฉลามจัส,มิกซ์เฉลิมศรี,สกายแฟนฉลามจัส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%89%E0%B8%A5%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B1%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "กีฬา",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "กีฬา,แข่งบอล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B5%E0%B8%AC%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "crystal palace vs aek larnaca",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "crystal palace vs aek larnaca",
    exploreLink: "https://trends.google.com/trends/explore?q=crystal%20palace%20vs%20aek%20larnaca&geo=TH&hl=th",
  },
  {
    term: "คนละครึ่งบัตรสวัสดิการแห่งรัฐ",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "คนละครึ่งบัตรสวัสดิการแห่งรัฐ,คนละครึ่งบัตรสวัสดิการแห่งรัฐ 2568",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%99%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%90&geo=TH&hl=th",
  },
  {
    term: "diwali 2025",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "diwali 2025,happy diwali wishes",
    exploreLink: "https://trends.google.com/trends/explore?q=diwali%202025&geo=TH&hl=th",
  },
  {
    term: "lakers vs warriors",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "lakers vs warriors,lakers,gsw",
    exploreLink: "https://trends.google.com/trends/explore?q=lakers%20vs%20warriors&geo=TH&hl=th",
  },
  {
    term: "marc guiu",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "marc guiu",
    exploreLink: "https://trends.google.com/trends/explore?q=marc%20guiu&geo=TH&hl=th",
  },
  {
    term: "วันฮาโลวีน",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "วันฮาโลวีน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%AE%E0%B8%B2%E0%B9%82%E0%B8%A5%E0%B8%A7%E0%B8%B5%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "บาเฮีย",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 4 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเฮีย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%AE%E0%B8%B5%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "แม่ซื้อ",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "แม่ซื้อ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD&geo=TH&hl=th",
  },
  {
    term: "classroom",
    searchVolume: "10K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "classroom",
    exploreLink: "https://trends.google.com/trends/explore?q=classroom&geo=TH&hl=th",
  },
  {
    term: "เกาหลีใต้",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เกาหลีใต้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%B5%E0%B9%83%E0%B8%95%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "anthony hudson",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "anthony hudson",
    exploreLink: "https://trends.google.com/trends/explore?q=anthony%20hudson&geo=TH&hl=th",
  },
  {
    term: "ช่อง3",
    searchVolume: "5K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่อง3,ช่อง 3",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%873&geo=TH&hl=th",
  },
  {
    term: "ไมนซ์ พบ เลเวอร์คูเซ่น",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ไมนซ์ พบ เลเวอร์คูเซ่น,เลเวอร์คูเซ่น,bein sport",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%A1%E0%B8%99%E0%B8%8B%E0%B9%8C%20%E0%B8%9E%E0%B8%9A%20%E0%B9%80%E0%B8%A5%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%84%E0%B8%B9%E0%B9%80%E0%B8%8B%E0%B9%88%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "big brother",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "big brother",
    exploreLink: "https://trends.google.com/trends/explore?q=big%20brother&geo=TH&hl=th",
  },
  {
    term: "ตํานานนทีมืด",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ตํานานนทีมืด,ตำนานนทีมืด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B9%8D%E0%B8%B2%E0%B8%99%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B8%A1%E0%B8%B7%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "กังวอน เอฟซี พบ วิสเซล โคเบะ",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "กังวอน เอฟซี พบ วิสเซล โคเบะ,วิสเซล โกเบ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B1%E0%B8%87%E0%B8%A7%E0%B8%AD%E0%B8%99%20%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A7%E0%B8%B4%E0%B8%AA%E0%B9%80%E0%B8%8B%E0%B8%A5%20%E0%B9%82%E0%B8%84%E0%B9%80%E0%B8%9A%E0%B8%B0&geo=TH&hl=th",
  },
  {
    term: "โรมา พบ อินเตอร์",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "โรมา พบ อินเตอร์,ไฮไลท์บอล,อินเตอร์มิลาน,เซเรียอา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "callum turner",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "callum turner",
    exploreLink: "https://trends.google.com/trends/explore?q=callum%20turner&geo=TH&hl=th",
  },
  {
    term: "leverkusen vs psg",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "leverkusen vs psg",
    exploreLink: "https://trends.google.com/trends/explore?q=leverkusen%20vs%20psg&geo=TH&hl=th",
  },
  {
    term: "diwali",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "diwali",
    exploreLink: "https://trends.google.com/trends/explore?q=diwali&geo=TH&hl=th",
  },
  {
    term: "isuzu",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "isuzu",
    exploreLink: "https://trends.google.com/trends/explore?q=isuzu&geo=TH&hl=th",
  },
  {
    term: "india vs australia",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "india vs australia,ind vs aus,india national cricket team vs australian men’s cricket team match scorecard,aus vs ind",
    exploreLink: "https://trends.google.com/trends/explore?q=india%20vs%20australia&geo=TH&hl=th",
  },
  {
    term: "getafe vs real madrid",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "getafe vs real madrid,real madrid",
    exploreLink: "https://trends.google.com/trends/explore?q=getafe%20vs%20real%20madrid&geo=TH&hl=th",
  },
  {
    term: "ผลบอลเมื่อคืน",
    searchVolume: "5K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ผลบอลเมื่อคืน,บอลเมื่อคืน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9C%E0%B8%A5%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%84%E0%B8%B7%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "มหาดไทย",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มหาดไทย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "โคเวนทรี",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "โคเวนทรี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%84%E0%B9%80%E0%B8%A7%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "bayern vs club brugge",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 4 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "bayern vs club brugge,bein sport",
    exploreLink: "https://trends.google.com/trends/explore?q=bayern%20vs%20club%20brugge&geo=TH&hl=th",
  },
  {
    term: "สมพงษ์ลาออกพรรคเพื่อไทย",
    searchVolume: "2K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "สมพงษ์ลาออกพรรคเพื่อไทย,สมพงษ์อมรวิวัฒน์,สมพงษ์ อมรวิวัฒน์,สมพงษ์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A1%E0%B8%9E%E0%B8%87%E0%B8%A9%E0%B9%8C%E0%B8%A5%E0%B8%B2%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "tottenham vs aston villa",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "tottenham vs aston villa,spurs,tottenham,aston villa",
    exploreLink: "https://trends.google.com/trends/explore?q=tottenham%20vs%20aston%20villa&geo=TH&hl=th",
  },
  {
    term: "west ham vs brentford",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "west ham vs brentford",
    exploreLink: "https://trends.google.com/trends/explore?q=west%20ham%20vs%20brentford&geo=TH&hl=th",
  },
  {
    term: "เลือกตั้งซ่อมกาญจนบุรี",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "เลือกตั้งซ่อมกาญจนบุรี,ผลเลือกตั้งซ่อมกาญจนบุรี,ผลการเลือกตั้งซ่อมกาญจนบุรี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%8B%E0%B9%88%E0%B8%AD%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%8D%E0%B8%88%E0%B8%99%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "f1",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "f1,f1 standings",
    exploreLink: "https://trends.google.com/trends/explore?q=f1&geo=TH&hl=th",
  },
  {
    term: "กรมอุตุนิยมวิทยา",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "กรมอุตุนิยมวิทยา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%B8%E0%B8%99%E0%B8%B4%E0%B8%A2%E0%B8%A1%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "real madrid",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "real madrid",
    exploreLink: "https://trends.google.com/trends/explore?q=real%20madrid&geo=TH&hl=th",
  },
  {
    term: "nottm forest vs chelsea",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "nottm forest vs chelsea,nottingham forest vs chelsea f.c. timeline,เชลชี",
    exploreLink: "https://trends.google.com/trends/explore?q=nottm%20forest%20vs%20chelsea&geo=TH&hl=th",
  },
  {
    term: "ราชบุรี เอฟซี พบ ลำพูน วอริเออร์",
    searchVolume: "5K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ราชบุรี เอฟซี พบ ลำพูน วอริเออร์,นครราชสีมา พบ การท่าเรือ เอฟซี,การท่าเรือ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%20%E0%B9%80%E0%B8%AD%E0%B8%9F%E0%B8%8B%E0%B8%B5%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A5%E0%B8%B3%E0%B8%9E%E0%B8%B9%E0%B8%99%20%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B8%B4%E0%B9%80%E0%B8%AD%E0%B8%AD%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "daniel naroditsky",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "daniel naroditsky,chess",
    exploreLink: "https://trends.google.com/trends/explore?q=daniel%20naroditsky&geo=TH&hl=th",
  },
  {
    term: "ais play",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ais play,aisplay",
    exploreLink: "https://trends.google.com/trends/explore?q=ais%20play&geo=TH&hl=th",
  },
  {
    term: "beyond meat stock",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "beyond meat stock,bynd",
    exploreLink: "https://trends.google.com/trends/explore?q=beyond%20meat%20stock&geo=TH&hl=th",
  },
  {
    term: "man city vs everton",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "man city vs everton",
    exploreLink: "https://trends.google.com/trends/explore?q=man%20city%20vs%20everton&geo=TH&hl=th",
  },
  {
    term: "psg vs strasbourg",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "psg vs strasbourg,psg",
    exploreLink: "https://trends.google.com/trends/explore?q=psg%20vs%20strasbourg&geo=TH&hl=th",
  },
  {
    term: "เซนเน่ ลัมเมนส์",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เซนเน่ ลัมเมนส์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%99%E0%B9%80%E0%B8%99%E0%B9%88%20%E0%B8%A5%E0%B8%B1%E0%B8%A1%E0%B9%80%E0%B8%A1%E0%B8%99%E0%B8%AA%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "land cruiser fj",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "land cruiser fj,toyota land cruiser",
    exploreLink: "https://trends.google.com/trends/explore?q=land%20cruiser%20fj&geo=TH&hl=th",
  },
  {
    term: "emiru",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "emiru,twitch",
    exploreLink: "https://trends.google.com/trends/explore?q=emiru&geo=TH&hl=th",
  },
  {
    term: "asian youth games 2025",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "asian youth games 2025,วอลเลย์บอล,แข่งขันวอลเลย์บอลหญิง",
    exploreLink: "https://trends.google.com/trends/explore?q=asian%20youth%20games%202025&geo=TH&hl=th",
  },
  {
    term: "classroom",
    searchVolume: "2K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "classroom",
    exploreLink: "https://trends.google.com/trends/explore?q=classroom&geo=TH&hl=th",
  },
  {
    term: "ซานโตส",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ซานโตส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8B%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%95%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "ดูบอลสด วันนี้ facebook",
    searchVolume: "5K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ดูบอลสด วันนี้ facebook,ดูบอลสด facebook,ดู บอล สด วัน นี้ facebook",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B9%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%AA%E0%B8%94%20%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%20facebook&geo=TH&hl=th",
  },
  {
    term: "tgs 2025",
    searchVolume: "2K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "tgs 2025",
    exploreLink: "https://trends.google.com/trends/explore?q=tgs%202025&geo=TH&hl=th",
  },
  {
    term: "barcelona vs girona",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "barcelona vs girona,barcelona,fc barcelona",
    exploreLink: "https://trends.google.com/trends/explore?q=barcelona%20vs%20girona&geo=TH&hl=th",
  },
  {
    term: "เซบียา พบ มายอร์ก้า",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เซบียา พบ มายอร์ก้า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "elle fanning",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "elle fanning",
    exploreLink: "https://trends.google.com/trends/explore?q=elle%20fanning&geo=TH&hl=th",
  },
  {
    term: "arsenal",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "arsenal",
    exploreLink: "https://trends.google.com/trends/explore?q=arsenal&geo=TH&hl=th",
  },
  {
    term: "ค่าเงินดอลลาร์",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ค่าเงินดอลลาร์,ดอลล่าบาท,เงิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%94%E0%B8%AD%E0%B8%A5%E0%B8%A5%E0%B8%B2%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "มาร์กเซย",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มาร์กเซย,มากเซย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%81%E0%B9%80%E0%B8%8B%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "barcelona",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "barcelona",
    exploreLink: "https://trends.google.com/trends/explore?q=barcelona&geo=TH&hl=th",
  },
  {
    term: "ลาซิโอ",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ลาซิโอ,อตาลันต้า พบ ลาซีโอ,อตาลันต้า vs ลาซีโอ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B2%E0%B8%8B%E0%B8%B4%E0%B9%82%E0%B8%AD&geo=TH&hl=th",
  },
  {
    term: "น็องซี่",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "น็องซี่",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B9%87%E0%B8%AD%E0%B8%87%E0%B8%8B%E0%B8%B5%E0%B9%88&geo=TH&hl=th",
  },
  {
    term: "สวอนซี",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "สวอนซี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A7%E0%B8%AD%E0%B8%99%E0%B8%8B%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "เลสเตอร์",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "เลสเตอร์,เลสเตอร์ซิตี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A5%E0%B8%AA%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ไฟดับ",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฟดับ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%9F%E0%B8%94%E0%B8%B1%E0%B8%9A&geo=TH&hl=th",
  },
  {
    term: "newcastle vs benfica",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "newcastle vs benfica",
    exploreLink: "https://trends.google.com/trends/explore?q=newcastle%20vs%20benfica&geo=TH&hl=th",
  },
  {
    term: "sam rivers",
    searchVolume: "1K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "sam rivers,limp bizkit,liver",
    exploreLink: "https://trends.google.com/trends/explore?q=sam%20rivers&geo=TH&hl=th",
  },
  {
    term: "เซาแธมป์ตัน พบ สวอนซี",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เซาแธมป์ตัน พบ สวอนซี,เซาแธมป์ตัน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%B2%E0%B9%81%E0%B8%98%E0%B8%A1%E0%B8%9B%E0%B9%8C%E0%B8%95%E0%B8%B1%E0%B8%99%20%E0%B8%9E%E0%B8%9A%20%E0%B8%AA%E0%B8%A7%E0%B8%AD%E0%B8%99%E0%B8%8B%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "กรมป่าไม้",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "กรมป่าไม้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%9B%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%A1%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "twitch",
    searchVolume: "200+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "twitch",
    exploreLink: "https://trends.google.com/trends/explore?q=twitch&geo=TH&hl=th",
  },
  {
    term: "ปารีสแซงต์",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ปารีสแซงต์,เปแอสเช",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9B%E0%B8%B2%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B9%81%E0%B8%8B%E0%B8%87%E0%B8%95%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ปาฟอส",
    searchVolume: "500+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ปาฟอส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9B%E0%B8%B2%E0%B8%9F%E0%B8%AD%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "บิลเบา",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "บิลเบา,เซลต้า บีโก้,เซลต้าบีโก้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B9%80%E0%B8%9A%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ยูโร ยศวรรธน์",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ยูโร ยศวรรธน์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A2%E0%B8%B9%E0%B9%82%E0%B8%A3%20%E0%B8%A2%E0%B8%A8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%98%E0%B8%99%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "บาเซโลนา",
    searchVolume: "500+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเซโลนา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%8B%E0%B9%82%E0%B8%A5%E0%B8%99%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ดิจิทัล",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ดิจิทัล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B4%E0%B8%88%E0%B8%B4%E0%B8%97%E0%B8%B1%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "nyt connections hints",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "nyt connections hints",
    exploreLink: "https://trends.google.com/trends/explore?q=nyt%20connections%20hints&geo=TH&hl=th",
  },
  {
    term: "denmark open 2025",
    searchVolume: "1K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "denmark open 2025",
    exploreLink: "https://trends.google.com/trends/explore?q=denmark%20open%202025&geo=TH&hl=th",
  },
  {
    term: "lee yi kyung",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "lee yi kyung,lee yikyung",
    exploreLink: "https://trends.google.com/trends/explore?q=lee%20yi%20kyung&geo=TH&hl=th",
  },
  {
    term: "กัมบะ โอซาก้า พบ นัมดินห์",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "กัมบะ โอซาก้า พบ นัมดินห์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B1%E0%B8%A1%E0%B8%9A%E0%B8%B0%20%E0%B9%82%E0%B8%AD%E0%B8%8B%E0%B8%B2%E0%B8%81%E0%B9%89%E0%B8%B2%20%E0%B8%9E%E0%B8%9A%20%E0%B8%99%E0%B8%B1%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B8%AB%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ดาวโจนส์วันนี้",
    searchVolume: "500+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ดาวโจนส์วันนี้,หวยหุ้นวันนี้,หุ้นดาวโจนส์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B9%82%E0%B8%88%E0%B8%99%E0%B8%AA%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "พฤศจิกายน",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "พฤศจิกายน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A4%E0%B8%A8%E0%B8%88%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A2%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "กระทรวง",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "กระทรวง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%97%E0%B8%A3%E0%B8%A7%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "ชิคาโก ไฟร์",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ชิคาโก ไฟร์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B8%B4%E0%B8%84%E0%B8%B2%E0%B9%82%E0%B8%81%20%E0%B9%84%E0%B8%9F%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "psg",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "psg",
    exploreLink: "https://trends.google.com/trends/explore?q=psg&geo=TH&hl=th",
  },
  {
    term: "วันพระ",
    searchVolume: "1K+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "วันพระ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%9E%E0%B8%A3%E0%B8%B0&geo=TH&hl=th",
  },
  {
    term: "พระกาโตะ",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "พระกาโตะ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B9%82%E0%B8%95%E0%B8%B0&geo=TH&hl=th",
  },
  {
    term: "ตารางบอลวันนี้พรีเมียร์ลีก",
    searchVolume: "2K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ตารางบอลวันนี้พรีเมียร์ลีก,ตารางบอลพรีเมียร์ลีก,ตารางบอลวันนี้ พรีเมียร์ลีก,ลาลิกา,บอลวันนี้ สด,โปรแกรมบอล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%9E%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%A1%E0%B8%B5%E0%B8%A2%E0%B8%A3%E0%B9%8C%E0%B8%A5%E0%B8%B5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "jinx",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "jinx,sports",
    exploreLink: "https://trends.google.com/trends/explore?q=jinx&geo=TH&hl=th",
  },
  {
    term: "เซบีย่า",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "เซบีย่า,เรอัลเบติส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ลีลล์",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ลีลล์,ล็องส์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B5%E0%B8%A5%E0%B8%A5%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ninja gaiden 4",
    searchVolume: "500+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ninja gaiden 4",
    exploreLink: "https://trends.google.com/trends/explore?q=ninja%20gaiden%204&geo=TH&hl=th",
  },
  {
    term: "ไฮไลท์บอล",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฮไลท์บอล,ไฮไลท์ฟุตบอลเมื่อคืน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%AE%E0%B9%84%E0%B8%A5%E0%B8%97%E0%B9%8C%E0%B8%9A%E0%B8%AD%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "เลสเตอร์",
    searchVolume: "500+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "เลสเตอร์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A5%E0%B8%AA%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "พายุดีเปรสชั่น",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "พายุดีเปรสชั่น,สภาพอากาศวันนี้,เส้นทางพายุ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%94%E0%B8%B5%E0%B9%80%E0%B8%9B%E0%B8%A3%E0%B8%AA%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "weather",
    searchVolume: "2K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "weather",
    exploreLink: "https://trends.google.com/trends/explore?q=weather&geo=TH&hl=th",
  },
  {
    term: "ไฮไลท์ฟุตบอล",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไฮไลท์ฟุตบอล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%AE%E0%B9%84%E0%B8%A5%E0%B8%97%E0%B9%8C%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "ปารีส",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ปารีส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9B%E0%B8%B2%E0%B8%A3%E0%B8%B5%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "อูโก เอกิติเก",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "อูโก เอกิติเก,อเล็กซานเดอร์ อิซัค",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B9%E0%B9%82%E0%B8%81%20%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%B4%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "รังสิมันต์โรม",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "รังสิมันต์โรม",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C%E0%B9%82%E0%B8%A3%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "bayern vs dortmund",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "bayern vs dortmund,bayern",
    exploreLink: "https://trends.google.com/trends/explore?q=bayern%20vs%20dortmund&geo=TH&hl=th",
  },
  {
    term: "ragnarok twilight",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ragnarok twilight",
    exploreLink: "https://trends.google.com/trends/explore?q=ragnarok%20twilight&geo=TH&hl=th",
  },
  {
    term: "คริสตัลพาเลซ",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "คริสตัลพาเลซ,ผลบอลพรีเมียร์ลีกล่าสุด,ผลบอลพรีเมียร์ลีกเมื่อคืน,ฌอง-ฟิลิปป์ มาเตต้า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%A3%E0%B8%B4%E0%B8%AA%E0%B8%95%E0%B8%B1%E0%B8%A5%E0%B8%9E%E0%B8%B2%E0%B9%80%E0%B8%A5%E0%B8%8B&geo=TH&hl=th",
  },
  {
    term: "ประวัติอังคณานีละไพจิตร",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ประวัติอังคณานีละไพจิตร,ย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%AD%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%93%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A5%E0%B8%B0%E0%B9%84%E0%B8%9E%E0%B8%88%E0%B8%B4%E0%B8%95%E0%B8%A3&geo=TH&hl=th",
  },
  {
    term: "man city",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "man city,mancity,man city vs everton f.c. timeline,manchester city",
    exploreLink: "https://trends.google.com/trends/explore?q=man%20city&geo=TH&hl=th",
  },
  {
    term: "eva air flight attendant",
    searchVolume: "1K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "eva air flight attendant,eva air flight attendant death",
    exploreLink: "https://trends.google.com/trends/explore?q=eva%20air%20flight%20attendant&geo=TH&hl=th",
  },
  {
    term: "แพทองธารชินวัตร",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "แพทองธารชินวัตร,พงศ์กวิน จึงรุ่งเรืองกิจ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B8%B4%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%A3&geo=TH&hl=th",
  },
  {
    term: "videos",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "videos,louvre museum robbery",
    exploreLink: "https://trends.google.com/trends/explore?q=videos&geo=TH&hl=th",
  },
  {
    term: "พิน",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "พิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "เจ้าชายแอนดรูว์",
    searchVolume: "1K+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เจ้าชายแอนดรูว์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%8A%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B8%A3%E0%B8%B9%E0%B8%A7%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "my hero academia season 8",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "my hero academia season 8",
    exploreLink: "https://trends.google.com/trends/explore?q=my%20hero%20academia%20season%208&geo=TH&hl=th",
  },
  {
    term: "netflix ราคา",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "netflix ราคา",
    exploreLink: "https://trends.google.com/trends/explore?q=netflix%20%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "เลบันเต พบ ราโย",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เลบันเต พบ ราโย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%A5%E0%B8%9A%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%95%20%E0%B8%9E%E0%B8%9A%20%E0%B8%A3%E0%B8%B2%E0%B9%82%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "ดูบอล66 วันนี้",
    searchVolume: "1K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ดูบอล66 วันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B9%E0%B8%9A%E0%B8%AD%E0%B8%A566%20%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "al nassr",
    searchVolume: "1K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "al nassr,al-nassr vs al fateh",
    exploreLink: "https://trends.google.com/trends/explore?q=al%20nassr&geo=TH&hl=th",
  },
  {
    term: "brighton vs newcastle",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "brighton vs newcastle,newcastle",
    exploreLink: "https://trends.google.com/trends/explore?q=brighton%20vs%20newcastle&geo=TH&hl=th",
  },
  {
    term: "tesla model 3",
    searchVolume: "1K+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "tesla model 3,โหนกระแสล่าสุด,ป๋อมแป๋มโหนกระแส",
    exploreLink: "https://trends.google.com/trends/explore?q=tesla%20model%203&geo=TH&hl=th",
  },
  {
    term: "chelsea",
    searchVolume: "2K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "chelsea",
    exploreLink: "https://trends.google.com/trends/explore?q=chelsea&geo=TH&hl=th",
  },
  {
    term: "แรนส์",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "แรนส์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%81%E0%B8%A3%E0%B8%99%E0%B8%AA%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "y",
    searchVolume: "500+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "y",
    exploreLink: "https://trends.google.com/trends/explore?q=y&geo=TH&hl=th",
  },
  {
    term: "pptv",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "pptv",
    exploreLink: "https://trends.google.com/trends/explore?q=pptv&geo=TH&hl=th",
  },
  {
    term: "central world",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "central world",
    exploreLink: "https://trends.google.com/trends/explore?q=central%20world&geo=TH&hl=th",
  },
  {
    term: "บาเฮีย",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเฮีย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%AE%E0%B8%B5%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "ยูฟ่าแชมเปียนส์ลีก",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ยูฟ่าแชมเปียนส์ลีก,ไครัต พบ ปาฟอส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A2%E0%B8%B9%E0%B8%9F%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B9%8C%E0%B8%A5%E0%B8%B5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "mono",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "mono",
    exploreLink: "https://trends.google.com/trends/explore?q=mono&geo=TH&hl=th",
  },
  {
    term: "บาเซโลนา",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเซโลนา,barca,fotmob",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%8B%E0%B9%82%E0%B8%A5%E0%B8%99%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "บริษัท cpf",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "บริษัท cpf,โรงพยาบาลปลายพระยา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97%20cpf&geo=TH&hl=th",
  },
  {
    term: "miss grand international 2024",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "miss grand international 2024,มิสแกรนด์อินเตอร์เนชั่นแนล 2024",
    exploreLink: "https://trends.google.com/trends/explore?q=miss%20grand%20international%202024&geo=TH&hl=th",
  },
  {
    term: "arsenal",
    searchVolume: "1K+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "arsenal",
    exploreLink: "https://trends.google.com/trends/explore?q=arsenal&geo=TH&hl=th",
  },
  {
    term: "mbeumo",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "mbeumo",
    exploreLink: "https://trends.google.com/trends/explore?q=mbeumo&geo=TH&hl=th",
  },
  {
    term: "eose",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "eose",
    exploreLink: "https://trends.google.com/trends/explore?q=eose&geo=TH&hl=th",
  },
  {
    term: "buriram united",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "buriram united",
    exploreLink: "https://trends.google.com/trends/explore?q=buriram%20united&geo=TH&hl=th",
  },
  {
    term: "escape from duckov",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "escape from duckov",
    exploreLink: "https://trends.google.com/trends/explore?q=escape%20from%20duckov&geo=TH&hl=th",
  },
  {
    term: "ดูบาส",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ดูบาส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B9%E0%B8%9A%E0%B8%B2%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "crystal palace vs bournemouth",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "crystal palace vs bournemouth",
    exploreLink: "https://trends.google.com/trends/explore?q=crystal%20palace%20vs%20bournemouth&geo=TH&hl=th",
  },
  {
    term: "mitch mcconnell",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "mitch mcconnell",
    exploreLink: "https://trends.google.com/trends/explore?q=mitch%20mcconnell&geo=TH&hl=th",
  },
  {
    term: "โดมปกรณ์ลัม",
    searchVolume: "500+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "โดมปกรณ์ลัม",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%94%E0%B8%A1%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%A5%E0%B8%B1%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "อิปสวิช",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "อิปสวิช,มิดเดิลสโบรห์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B4%E0%B8%9B%E0%B8%AA%E0%B8%A7%E0%B8%B4%E0%B8%8A&geo=TH&hl=th",
  },
  {
    term: "nottingham forest",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "nottingham forest,ange postecoglou",
    exploreLink: "https://trends.google.com/trends/explore?q=nottingham%20forest&geo=TH&hl=th",
  },
  {
    term: "ลอยกระทง",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ลอยกระทง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%AD%E0%B8%A2%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%97%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "สโมสรฟุตบอลเรอัลมาดริด",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 3 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "สโมสรฟุตบอลเรอัลมาดริด,สโมสรฟุตบอลบาร์เซโลนา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B8%AA%E0%B8%A3%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B9%80%E0%B8%A3%E0%B8%AD%E0%B8%B1%E0%B8%A5%E0%B8%A1%E0%B8%B2%E0%B8%94%E0%B8%A3%E0%B8%B4%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "premier league table",
    searchVolume: "1K+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "premier league table",
    exploreLink: "https://trends.google.com/trends/explore?q=premier%20league%20table&geo=TH&hl=th",
  },
  {
    term: "epic",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "epic",
    exploreLink: "https://trends.google.com/trends/explore?q=epic&geo=TH&hl=th",
  },
  {
    term: "ไลป์ซิก",
    searchVolume: "1K+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ไลป์ซิก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B8%8B%E0%B8%B4%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "football",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "football",
    exploreLink: "https://trends.google.com/trends/explore?q=football&geo=TH&hl=th",
  },
  {
    term: "canva down",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "canva down",
    exploreLink: "https://trends.google.com/trends/explore?q=canva%20down&geo=TH&hl=th",
  },
  {
    term: "กาลาตาซาราย",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "กาลาตาซาราย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B2%E0%B8%A5%E0%B8%B2%E0%B8%95%E0%B8%B2%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "เนกาซ่า",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "เนกาซ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%8B%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ufa",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ufa",
    exploreLink: "https://trends.google.com/trends/explore?q=ufa&geo=TH&hl=th",
  },
  {
    term: "bg",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "bg",
    exploreLink: "https://trends.google.com/trends/explore?q=bg&geo=TH&hl=th",
  },
  {
    term: "godaddy",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "godaddy",
    exploreLink: "https://trends.google.com/trends/explore?q=godaddy&geo=TH&hl=th",
  },
  {
    term: "como vs juventus",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "como vs juventus",
    exploreLink: "https://trends.google.com/trends/explore?q=como%20vs%20juventus&geo=TH&hl=th",
  },
  {
    term: "docker",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "docker",
    exploreLink: "https://trends.google.com/trends/explore?q=docker&geo=TH&hl=th",
  },
  {
    term: "sanae takaichi",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "sanae takaichi",
    exploreLink: "https://trends.google.com/trends/explore?q=sanae%20takaichi&geo=TH&hl=th",
  },
  {
    term: "กอล์ฟ ธัญญ์วาริน",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "กอล์ฟ ธัญญ์วาริน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%20%E0%B8%98%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B9%8C%E0%B8%A7%E0%B8%B2%E0%B8%A3%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "ตับ",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ตับ",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%B1%E0%B8%9A&geo=TH&hl=th",
  },
  {
    term: "trueid",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "trueid",
    exploreLink: "https://trends.google.com/trends/explore?q=trueid&geo=TH&hl=th",
  },
  {
    term: "ทรูไอดี",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ทรูไอดี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%A3%E0%B8%B9%E0%B9%84%E0%B8%AD%E0%B8%94%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "rowan atkinson",
    searchVolume: "500+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "rowan atkinson,มิสเตอร์บีน",
    exploreLink: "https://trends.google.com/trends/explore?q=rowan%20atkinson&geo=TH&hl=th",
  },
  {
    term: "ufa",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ufa",
    exploreLink: "https://trends.google.com/trends/explore?q=ufa&geo=TH&hl=th",
  },
  {
    term: "เงินดอลล่า",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เงินดอลล่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%94%E0%B8%AD%E0%B8%A5%E0%B8%A5%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "live score",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "live score",
    exploreLink: "https://trends.google.com/trends/explore?q=live%20score&geo=TH&hl=th",
  },
  {
    term: "โคเวนทรี",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "โคเวนทรี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%84%E0%B9%80%E0%B8%A7%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B5&geo=TH&hl=th",
  },
  {
    term: "harry potter",
    searchVolume: "100+",
    startTime: "24 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "harry potter",
    exploreLink: "https://trends.google.com/trends/explore?q=harry%20potter&geo=TH&hl=th",
  },
  {
    term: "lec",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th",
  },
  {
    term: "ตลาดหลักทรัพย์",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ตลาดหลักทรัพย์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9E%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "28 days later",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "28 days later",
    exploreLink: "https://trends.google.com/trends/explore?q=28%20days%20later&geo=TH&hl=th",
  },
  {
    term: "พม่า",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "พม่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A1%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "เซลติก",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เซลติก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%8B%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "psv vs napoli",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 6 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "psv vs napoli",
    exploreLink: "https://trends.google.com/trends/explore?q=psv%20vs%20napoli&geo=TH&hl=th",
  },
  {
    term: "ธรรมนัส",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ธรรมนัส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B1%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "บ้านบอลสด",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "บ้านบอลสด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%AA%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "ลีกเอิง",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ลีกเอิง,ตารางคะแนนบอล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B5%E0%B8%81%E0%B9%80%E0%B8%AD%E0%B8%B4%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "ubisoft",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ubisoft",
    exploreLink: "https://trends.google.com/trends/explore?q=ubisoft&geo=TH&hl=th",
  },
  {
    term: "mlb",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "mlb",
    exploreLink: "https://trends.google.com/trends/explore?q=mlb&geo=TH&hl=th",
  },
  {
    term: "vietjet",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "vietjet",
    exploreLink: "https://trends.google.com/trends/explore?q=vietjet&geo=TH&hl=th",
  },
  {
    term: "โบโลญญ่า",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "โบโลญญ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%9A%E0%B9%82%E0%B8%A5%E0%B8%8D%E0%B8%8D%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "can",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "can",
    exploreLink: "https://trends.google.com/trends/explore?q=can&geo=TH&hl=th",
  },
  {
    term: "พลังกาญจน์",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "พลังกาญจน์,อุทัยธานีเอฟซี",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%8D%E0%B8%88%E0%B8%99%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "3",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "3",
    exploreLink: "https://trends.google.com/trends/explore?q=3&geo=TH&hl=th",
  },
  {
    term: "ais",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ais",
    exploreLink: "https://trends.google.com/trends/explore?q=ais&geo=TH&hl=th",
  },
  {
    term: "nashville vs inter miami",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "nashville vs inter miami",
    exploreLink: "https://trends.google.com/trends/explore?q=nashville%20vs%20inter%20miami&geo=TH&hl=th",
  },
  {
    term: "ช่อง7",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ช่อง7",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%877&geo=TH&hl=th",
  },
  {
    term: "น่องเนยนางเอก mv",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "น่องเนยนางเอก mv",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%99%E0%B8%A2%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%20mv&geo=TH&hl=th",
  },
  {
    term: "galatasaray",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "galatasaray",
    exploreLink: "https://trends.google.com/trends/explore?q=galatasaray&geo=TH&hl=th",
  },
  {
    term: "fc barcelona",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "fc barcelona",
    exploreLink: "https://trends.google.com/trends/explore?q=fc%20barcelona&geo=TH&hl=th",
  },
  {
    term: "bein sport",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "bein sport",
    exploreLink: "https://trends.google.com/trends/explore?q=bein%20sport&geo=TH&hl=th",
  },
  {
    term: "ca",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "ca",
    exploreLink: "https://trends.google.com/trends/explore?q=ca&geo=TH&hl=th",
  },
  {
    term: "watch football",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "watch football",
    exploreLink: "https://trends.google.com/trends/explore?q=watch%20football&geo=TH&hl=th",
  },
  {
    term: "โมฮาเหม็ด ซาลาห์",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "โมฮาเหม็ด ซาลาห์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%A1%E0%B8%AE%E0%B8%B2%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B9%87%E0%B8%94%20%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
    searchVolume: "500+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%97%E0%B8%A3%E0%B8%A7%E0%B8%87%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B9%81%E0%B8%A7%E0%B8%94%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%A1&geo=TH&hl=th",
  },
  {
    term: "bet365",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "bet365",
    exploreLink: "https://trends.google.com/trends/explore?q=bet365&geo=TH&hl=th",
  },
  {
    term: "กะลา",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "กะลา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B0%E0%B8%A5%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ผู้กองแคท",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ผู้กองแคท",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%81%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%84%E0%B8%97&geo=TH&hl=th",
  },
  {
    term: "barca",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "barca",
    exploreLink: "https://trends.google.com/trends/explore?q=barca&geo=TH&hl=th",
  },
  {
    term: "bayern munich",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "bayern munich,goal",
    exploreLink: "https://trends.google.com/trends/explore?q=bayern%20munich&geo=TH&hl=th",
  },
  {
    term: "ดูแบดสด",
    searchVolume: "200+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ดูแบดสด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%94%E0%B8%B9%E0%B9%81%E0%B8%9A%E0%B8%94%E0%B8%AA%E0%B8%94&geo=TH&hl=th",
  },
  {
    term: "ไทยพาณิชย์",
    searchVolume: "100+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ไทยพาณิชย์",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%9E%E0%B8%B2%E0%B8%93%E0%B8%B4%E0%B8%8A%E0%B8%A2%E0%B9%8C&geo=TH&hl=th",
  },
  {
    term: "ac milan",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ac milan",
    exploreLink: "https://trends.google.com/trends/explore?q=ac%20milan&geo=TH&hl=th",
  },
  {
    term: "bundesliga",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "bundesliga",
    exploreLink: "https://trends.google.com/trends/explore?q=bundesliga&geo=TH&hl=th",
  },
  {
    term: "lol world 2025",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "lol world 2025",
    exploreLink: "https://trends.google.com/trends/explore?q=lol%20world%202025&geo=TH&hl=th",
  },
  {
    term: "premier league standings",
    searchVolume: "500+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "premier league standings",
    exploreLink: "https://trends.google.com/trends/explore?q=premier%20league%20standings&geo=TH&hl=th",
  },
  {
    term: "ea",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ea",
    exploreLink: "https://trends.google.com/trends/explore?q=ea&geo=TH&hl=th",
  },
  {
    term: "england vs new zealand",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "england vs new zealand",
    exploreLink: "https://trends.google.com/trends/explore?q=england%20vs%20new%20zealand&geo=TH&hl=th",
  },
  {
    term: "หวยหุ้นวันนี้",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "หวยหุ้นวันนี้",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "pakistan vs south africa",
    searchVolume: "200+",
    startTime: "23 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "pakistan vs south africa",
    exploreLink: "https://trends.google.com/trends/explore?q=pakistan%20vs%20south%20africa&geo=TH&hl=th",
  },
  {
    term: "pizza",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "pizza",
    exploreLink: "https://trends.google.com/trends/explore?q=pizza&geo=TH&hl=th",
  },
  {
    term: "เบนฟิก้า",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "เบนฟิก้า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9A%E0%B8%99%E0%B8%9F%E0%B8%B4%E0%B8%81%E0%B9%89%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "a-z",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "a-z",
    exploreLink: "https://trends.google.com/trends/explore?q=a-z&geo=TH&hl=th",
  },
  {
    term: "อีเมล",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "อีเมล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%A1%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "true",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "true",
    exploreLink: "https://trends.google.com/trends/explore?q=true&geo=TH&hl=th",
  },
  {
    term: "สภากาชาดไทย",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "สภากาชาดไทย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%8A%E0%B8%B2%E0%B8%94%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "sf",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "sf",
    exploreLink: "https://trends.google.com/trends/explore?q=sf&geo=TH&hl=th",
  },
  {
    term: "ราชกิจจานุเบกษา",
    searchVolume: "200+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ราชกิจจานุเบกษา",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%81%E0%B8%B4%E0%B8%88%E0%B8%88%E0%B8%B2%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%9A%E0%B8%81%E0%B8%A9%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "7-0",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "7-0",
    exploreLink: "https://trends.google.com/trends/explore?q=7-0&geo=TH&hl=th",
  },
  {
    term: "bwf",
    searchVolume: "200+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "bwf",
    exploreLink: "https://trends.google.com/trends/explore?q=bwf&geo=TH&hl=th",
  },
  {
    term: "สกอร์บอลวันนี้",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "สกอร์บอลวันนี้,สกอร์ บอล ล่าสุด",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%81%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89&geo=TH&hl=th",
  },
  {
    term: "คอนเสิร์ต",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "คอนเสิร์ต",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95&geo=TH&hl=th",
  },
  {
    term: "game",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "game",
    exploreLink: "https://trends.google.com/trends/explore?q=game&geo=TH&hl=th",
  },
  {
    term: "เจ 1",
    searchVolume: "500+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เจ 1,เจลีก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%201&geo=TH&hl=th",
  },
  {
    term: "เจ 1",
    searchVolume: "500+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "เจ 1,เจลีก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%201&geo=TH&hl=th",
  },
  {
    term: "บาเซิ่ล",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "บาเซิ่ล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%B2%E0%B9%80%E0%B8%8B%E0%B8%B4%E0%B9%88%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "กฐิน",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 8 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "กฐิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%90%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "ธอส",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ธอส",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%AD%E0%B8%AA&geo=TH&hl=th",
  },
  {
    term: "ch7",
    searchVolume: "500+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "ch7",
    exploreLink: "https://trends.google.com/trends/explore?q=ch7&geo=TH&hl=th",
  },
  {
    term: "siamsport",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "siamsport,ผลฟุตบอลพรีเมียร์ลีก",
    exploreLink: "https://trends.google.com/trends/explore?q=siamsport&geo=TH&hl=th",
  },
  {
    term: "มหาสมปอง",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "มหาสมปอง",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%A1%E0%B8%9B%E0%B8%AD%E0%B8%87&geo=TH&hl=th",
  },
  {
    term: "lec",
    searchVolume: "100+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th",
  },
  {
    term: "burnley vs leeds united",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "burnley vs leeds united",
    exploreLink: "https://trends.google.com/trends/explore?q=burnley%20vs%20leeds%20united&geo=TH&hl=th",
  },
  {
    term: "นักเตะแมนยู",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "นักเตะแมนยู",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%95%E0%B8%B0%E0%B9%81%E0%B8%A1%E0%B8%99%E0%B8%A2%E0%B8%B9&geo=TH&hl=th",
  },
  {
    term: "3",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "3",
    exploreLink: "https://trends.google.com/trends/explore?q=3&geo=TH&hl=th",
  },
  {
    term: "senne lammens",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "senne lammens",
    exploreLink: "https://trends.google.com/trends/explore?q=senne%20lammens&geo=TH&hl=th",
  },
  {
    term: "lec",
    searchVolume: "100+",
    startTime: "22 ตุลาคม ค.ศ. 2025 เวลา 9 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "lec",
    exploreLink: "https://trends.google.com/trends/explore?q=lec&geo=TH&hl=th",
  },
  {
    term: "สมุนไพร",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "สมุนไพร",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%A1%E0%B8%B8%E0%B8%99%E0%B9%84%E0%B8%9E%E0%B8%A3&geo=TH&hl=th",
  },
  {
    term: "sunderland vs wolves",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 21 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "sunderland vs wolves",
    exploreLink: "https://trends.google.com/trends/explore?q=sunderland%20vs%20wolves&geo=TH&hl=th",
  },
  {
    term: "สีหศักดิ์พวงเกตุแก้ว",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "สีหศักดิ์พวงเกตุแก้ว",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AA%E0%B8%B5%E0%B8%AB%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B4%E0%B9%8C%E0%B8%9E%E0%B8%A7%E0%B8%87%E0%B9%80%E0%B8%81%E0%B8%95%E0%B8%B8%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7&geo=TH&hl=th",
  },
  {
    term: "ลูกาโน่",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ลูกาโน่",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B8%B2%E0%B9%82%E0%B8%99%E0%B9%88&geo=TH&hl=th",
  },
  {
    term: "กระทรวงมหาดไทย",
    searchVolume: "200+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "กระทรวงมหาดไทย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%97%E0%B8%A3%E0%B8%A7%E0%B8%87%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "บอลโลก",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "บอลโลก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B9%82%E0%B8%A5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "perplexity",
    searchVolume: "200+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "perplexity",
    exploreLink: "https://trends.google.com/trends/explore?q=perplexity&geo=TH&hl=th",
  },
  {
    term: "วอลเลย์บอล",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 15 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "วอลเลย์บอล",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A7%E0%B8%AD%E0%B8%A5%E0%B9%80%E0%B8%A5%E0%B8%A2%E0%B9%8C%E0%B8%9A%E0%B8%AD%E0%B8%A5&geo=TH&hl=th",
  },
  {
    term: "การรถไฟแห่งประเทศไทย",
    searchVolume: "200+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "การรถไฟแห่งประเทศไทย",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A3%E0%B8%96%E0%B9%84%E0%B8%9F%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2&geo=TH&hl=th",
  },
  {
    term: "vietjet",
    searchVolume: "100+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 12 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "vietjet",
    exploreLink: "https://trends.google.com/trends/explore?q=vietjet&geo=TH&hl=th",
  },
  {
    term: "boots netflix",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "boots netflix",
    exploreLink: "https://trends.google.com/trends/explore?q=boots%20netflix&geo=TH&hl=th",
  },
  {
    term: "ซานเฟรซเซ ฮิโรชิม่า",
    searchVolume: "100+",
    startTime: "21 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ซานเฟรซเซ ฮิโรชิม่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%8B%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%9F%E0%B8%A3%E0%B8%8B%E0%B9%80%E0%B8%8B%20%E0%B8%AE%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%8A%E0%B8%B4%E0%B8%A1%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "time",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "time",
    exploreLink: "https://trends.google.com/trends/explore?q=time&geo=TH&hl=th",
  },
  {
    term: "atlas",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 10 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "atlas",
    exploreLink: "https://trends.google.com/trends/explore?q=atlas&geo=TH&hl=th",
  },
  {
    term: "เพียงเธอ",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "เพียงเธอ,ch3",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%80%E0%B8%98%E0%B8%AD&geo=TH&hl=th",
  },
  {
    term: "이이경",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "이이경",
    exploreLink: "https://trends.google.com/trends/explore?q=%EC%9D%B4%EC%9D%B4%EA%B2%BD&geo=TH&hl=th",
  },
  {
    term: "wetter",
    searchVolume: "200+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 7 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "wetter",
    exploreLink: "https://trends.google.com/trends/explore?q=wetter&geo=TH&hl=th",
  },
  {
    term: "tradingview",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 5 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "tradingview",
    exploreLink: "https://trends.google.com/trends/explore?q=tradingview&geo=TH&hl=th",
  },
  {
    term: "ทรู",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "ทรู",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%97%E0%B8%A3%E0%B8%B9&geo=TH&hl=th",
  },
  {
    term: "test",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "test",
    exploreLink: "https://trends.google.com/trends/explore?q=test&geo=TH&hl=th",
  },
  {
    term: "napoli",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "napoli",
    exploreLink: "https://trends.google.com/trends/explore?q=napoli&geo=TH&hl=th",
  },
  {
    term: "philippines",
    searchVolume: "100+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 22 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "philippines",
    exploreLink: "https://trends.google.com/trends/explore?q=philippines&geo=TH&hl=th",
  },
  {
    term: "โมนาโก",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "โมนาโก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%82%E0%B8%A1%E0%B8%99%E0%B8%B2%E0%B9%82%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "isak",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "isak",
    exploreLink: "https://trends.google.com/trends/explore?q=isak&geo=TH&hl=th",
  },
  {
    term: "gamma",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 14 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "gamma",
    exploreLink: "https://trends.google.com/trends/explore?q=gamma&geo=TH&hl=th",
  },
  {
    term: "motogp",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 11 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "motogp",
    exploreLink: "https://trends.google.com/trends/explore?q=motogp&geo=TH&hl=th",
  },
  {
    term: "ธนาคารออมสิน",
    searchVolume: "200+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ธนาคารออมสิน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B8%B4%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "monster hunter",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 20 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "monster hunter",
    exploreLink: "https://trends.google.com/trends/explore?q=monster%20hunter&geo=TH&hl=th",
  },
  {
    term: "ยูฟ่า",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "ยูฟ่า",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%A2%E0%B8%B9%E0%B8%9F%E0%B9%88%E0%B8%B2&geo=TH&hl=th",
  },
  {
    term: "ace frehley kiss",
    searchVolume: "100+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 17 นาฬิกา 50 นาที 00 วินาที UTC+7",
    relatedTerms: "ace frehley kiss",
    exploreLink: "https://trends.google.com/trends/explore?q=ace%20frehley%20kiss&geo=TH&hl=th",
  },
  {
    term: "เจลีก2",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "เจลีก2",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B8%A5%E0%B8%B5%E0%B8%812&geo=TH&hl=th",
  },
  {
    term: "lfc",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 0 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "lfc",
    exploreLink: "https://trends.google.com/trends/explore?q=lfc&geo=TH&hl=th",
  },
  {
    term: "ฮาโลวีน",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 1 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "ฮาโลวีน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%AE%E0%B8%B2%E0%B9%82%E0%B8%A5%E0%B8%A7%E0%B8%B5%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "primate movie",
    searchVolume: "100+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 18 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "primate movie",
    exploreLink: "https://trends.google.com/trends/explore?q=primate%20movie&geo=TH&hl=th",
  },
  {
    term: "iqoo 15",
    searchVolume: "100+",
    startTime: "20 ตุลาคม ค.ศ. 2025 เวลา 16 นาฬิกา 30 นาที 00 วินาที UTC+7",
    relatedTerms: "iqoo 15",
    exploreLink: "https://trends.google.com/trends/explore?q=iqoo%2015&geo=TH&hl=th",
  },
  {
    term: "serie a",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 2 นาฬิกา 20 นาที 00 วินาที UTC+7",
    relatedTerms: "serie a",
    exploreLink: "https://trends.google.com/trends/explore?q=serie%20a&geo=TH&hl=th",
  },
  {
    term: "นาบิลอานาน",
    searchVolume: "100+",
    startTime: "17 ตุลาคม ค.ศ. 2025 เวลา 19 นาฬิกา 10 นาที 00 วินาที UTC+7",
    relatedTerms: "นาบิลอานาน",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B8%99%E0%B8%B2%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B8%AD%E0%B8%B2%E0%B8%99%E0%B8%B2%E0%B8%99&geo=TH&hl=th",
  },
  {
    term: "เจลีก",
    searchVolume: "100+",
    startTime: "19 ตุลาคม ค.ศ. 2025 เวลา 13 นาฬิกา 40 นาที 00 วินาที UTC+7",
    relatedTerms: "เจลีก",
    exploreLink: "https://trends.google.com/trends/explore?q=%E0%B9%80%E0%B8%88%E0%B8%A5%E0%B8%B5%E0%B8%81&geo=TH&hl=th",
  },
  {
    term: "fantasy premier league",
    searchVolume: "100+",
    startTime: "18 ตุลาคม ค.ศ. 2025 เวลา 23 นาฬิกา 00 นาที 00 วินาที UTC+7",
    relatedTerms: "fantasy premier league",
    exploreLink: "https://trends.google.com/trends/explore?q=fantasy%20premier%20league&geo=TH&hl=th",
  }
];

// Helper functions
const parseSearchVolume = (volume: string): number => {
  const cleanVolume = volume.replace(/[+,]/g, "");
  const multiplier = cleanVolume.slice(-1).toLowerCase();
  const number = parseFloat(cleanVolume.slice(0, -1));

  switch (multiplier) {
    case "k":
      return number * 1000;
    case "m":
      return number * 1000000;
    default:
      return parseInt(cleanVolume) || 0;
  }
};

const calculateTimeActive = (startTime: string): number => {
  const start = new Date(startTime);
  const now = new Date();
  return Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
};

const categorizeVolume = (volume: number): "viral" | "high" | "medium" | "low" => {
  if (volume >= 1000000) return "viral";
  if (volume >= 100000) return "high";
  if (volume >= 10000) return "medium";
  return "low";
};

const calculateMomentum = (timeActive: number, volume: number): "rising" | "stable" | "declining" => {
  // Simple momentum calculation based on volume per hour
  const volumePerHour = volume / Math.max(timeActive, 1);
  
  if (volumePerHour > 10000) return "rising";
  if (volumePerHour > 1000) return "stable";
  return "declining";
};

const calculateSearchVelocity = (volume: number, timeActive: number): number => {
  // Rate of search volume growth per hour
  return volume / Math.max(timeActive, 1);
};

const processGoogleTrendsData = (trends: GoogleTrendItem[], timeframe: "4H" | "24H" | "48H" | "7D"): GoogleTrendWithStats[] => {
  return trends.map((trend, index) => {
    const volumeNumeric = parseSearchVolume(trend.searchVolume);
    const timeActive = calculateTimeActive(trend.startTime);
    const relatedTermsArray = trend.relatedTerms.split(",").map(term => term.trim());
    
    return {
      ...trend,
      id: `google-trend-${timeframe}-${index}`,
      rank: index + 1,
      category: categorizeVolume(volumeNumeric),
      volumeNumeric,
      relatedTermsArray,
      searchVelocity: calculateSearchVelocity(volumeNumeric, timeActive),
      momentum: calculateMomentum(timeActive, volumeNumeric),
      timeActive,
    };
  });
};

export const generateGoogleTrendsData = (
  timeframe: "4H" | "24H" | "48H" | "7D", 
  location: LocationFilter = 'thailand'
): GoogleTrendsData => {
  let trends: GoogleTrendItem[];
  
  // Currently only Thailand data is available
  // All mock data is Thailand-specific
  switch (timeframe) {
    case "4H":
      trends = mockGoogleTrends4H;
      break;
    case "24H":
      trends = mockGoogleTrends24H;
      break;
    case "48H":
      trends = mockGoogleTrends48H;
      break;
    case "7D":
      trends = mockGoogleTrends7D;
      break;
    default:
      trends = mockGoogleTrends24H;
  }

  // Get location configuration for display
  const locationConfig = getLocationConfig(location);

  return {
    timeframe,
    location: locationConfig.name,
    lastUpdated: new Date().toISOString(),
    trends,
  };
};

export const processGoogleTrendsMetrics = (data: GoogleTrendsData): GoogleTrendsMetrics => {
  const processedTrends = processGoogleTrendsData(data.trends, data.timeframe);
  
  const viralTrends = processedTrends
    .filter(trend => trend.category === "viral")
    .sort((a, b) => b.volumeNumeric - a.volumeNumeric)
    .slice(0, 10);

  const risingTrends = processedTrends
    .filter(trend => trend.momentum === "rising")
    .sort((a, b) => b.searchVelocity - a.searchVelocity)
    .slice(0, 10);

  const peakTrends = processedTrends
    .sort((a, b) => b.volumeNumeric - a.volumeNumeric)
    .slice(0, 10);

  const newTrends = processedTrends
    .filter(trend => trend.timeActive <= 4)
    .sort((a, b) => b.volumeNumeric - a.volumeNumeric)
    .slice(0, 10);

  const sustainedTrends = processedTrends
    .filter(trend => trend.timeActive >= 24)
    .sort((a, b) => b.volumeNumeric - a.volumeNumeric)
    .slice(0, 10);

  return {
    totalTrends: processedTrends.length,
    viralTrends,
    risingTrends,
    peakTrends,
    newTrends,
    sustainedTrends,
  };
};

export const generateGoogleTrendsInsights = (data: GoogleTrendsData): GoogleTrendsInsights => {
  const processedTrends = processGoogleTrendsData(data.trends, data.timeframe);
  
  // Calculate top categories
  const categoryCount: Record<string, number> = {};
  processedTrends.forEach(trend => {
    categoryCount[trend.category] = (categoryCount[trend.category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCount).map(([category, count]) => ({
    category,
    count,
    percentage: (count / processedTrends.length) * 100,
  }));

  // Calculate average lifespan
  const averageLifespan = processedTrends.reduce((sum, trend) => sum + trend.timeActive, 0) / processedTrends.length;

  // Mock peak hour (most trends start around this time)
  const peakHour = 21; // 9 PM Thailand time

  // Mock geographic data
  const geographicSpread = [
    { region: "Bangkok", intensity: 85 },
    { region: "Chiang Mai", intensity: 62 },
    { region: "Phuket", intensity: 45 },
    { region: "Pattaya", intensity: 38 },
    { region: "Khon Kaen", intensity: 52 },
  ];

  // Mock language distribution
  const languageDistribution = [
    { language: "Thai", percentage: 78 },
    { language: "English", percentage: 15 },
    { language: "Mixed", percentage: 7 },
  ];

  return {
    topCategories,
    averageLifespan,
    peakHour,
    geographicSpread,
    languageDistribution,
  };
};

export const formatSearchVolume = (volume: number): string => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M+`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K+`;
  return `${volume}+`;
};

export const formatTimeAgo = (startTime: string): string => {
  const start = new Date(startTime);
  const now = new Date();
  const hoursAgo = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60));
  
  if (hoursAgo < 1) return "เมื่อไม่กี่นาทีที่แล้ว";
  if (hoursAgo < 24) return `${hoursAgo} ชั่วโมงที่แล้ว`;
  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} วันที่แล้ว`;
};

export const getTrendingIcon = (momentum: "rising" | "stable" | "declining"): string => {
  switch (momentum) {
    case "rising": return "📈";
    case "stable": return "➡️";
    case "declining": return "📉";
    default: return "📊";
  }
};

export const getCategoryColor = (category: "viral" | "high" | "medium" | "low"): string => {
  switch (category) {
    case "viral": return "#ff6b6b";
    case "high": return "#4ecdc4";
    case "medium": return "#45b7d1";
    case "low": return "#96ceb4";
    default: return "#95a5a6";
  }
};
