import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image"; // ✅ Import Next.js Image component

interface CountData {
  totalProduct: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

const fetchCounts = async (): Promise<CountData> => {
  const productCount = await client.fetch(`*[_type == "product"]`);
  const orderCount = await client.fetch(`*[_type == "order"]`);
  const userCount = await client.fetch(`*[_type == "customer"]`);

  const totalRevenue = orderCount.reduce((acc: number, order: any) => {
    return acc + (order.total || 0);
  }, 0);

  return {
    totalProduct: productCount.length,
    totalOrders: orderCount.length,
    totalUsers: userCount.length,
    totalRevenue: totalRevenue,
  };
};

export default function CountMeter() {
  const [data, setData] = useState<CountData>({
    totalProduct: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const counts = await fetchCounts();
      setData(counts);
    };

    getData();
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <Card imgURL="/box.png" title="Products" value={data.totalProduct ?? 0} />
      <Card imgURL="/received.png" title="Orders" value={data.totalOrders ?? 0} />
      <Card imgURL="/profit-up.png" title="Revenue" value={`₹ ${(data.totalRevenue ?? 0) / 100}`} />
      <Card imgURL="/team.png" title="Customer" value={data.totalUsers ?? 0} />
    </section>
  );
}

interface CardProps {
  title: string;
  value: number | string;
  imgURL: string;
}

function Card({ title, value, imgURL }: CardProps) {
  return (
    <div className="flex gap-2 px-4 py-2 bg-white shadow rounded-xl w-full justify-between items-center">
      <div className="flex flex-col">
        <h1 className="font-semibold text-xl">{value}</h1>
        <h1 className="text-sm text-gray-700">{title}</h1>
      </div>
      <Image className="h-10 w-10 object-cover" src={imgURL} alt={title} width={40} height={40} />
    </div>
  );
}
