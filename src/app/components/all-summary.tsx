import { useEffect, useState } from "react";
import { getAllSummary } from "@/api/index";

interface AllSummaryProps {
  timestamp: string;
}

interface AllSummaryResponse {
  basic_resp: {
    msg: string;
  };
  summary: string;
}

export function AllSummary({ timestamp }: AllSummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await getAllSummary(timestamp);
        console.log("——————————————————————————————timestamp:", timestamp);
        console.log("——————————————————————————————API Response:", response);
        
        // 直接从 response 中获取 summary，因为 response 已经是解析后的数据
        if (response && response.summary) {
          setSummary(response.summary);
        } else {
          setError("获取总结数据格式错误");
          console.error("Invalid response format:", response);
        }
      } catch (err) {
        setError("获取总结失败，请稍后重试");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (timestamp) {
      fetchSummary();
    }
  }, [timestamp]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-3xl min-h-[200px] max-h-[600px] overflow-y-auto">
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold mb-4">All Summary</h3>
        <p className="whitespace-pre-wrap text-gray-700">{summary}</p>
      </div>
    </div>
  );
} 