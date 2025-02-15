"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  contactInfo?: string;
}

export default function ListView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const query = `*[_type == "customer"]{ _id, name, email, contactInfo }`;
        const fetchedCustomers: Customer[] = await client.fetch(query);
        setCustomers(fetchedCustomers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };
    getCustomers();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Customers</h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
        <table className="border-separate border-spacing-y-3 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">SN</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">Name</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">Email</th>
              <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg">Contact</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <Row key={customer._id} index={index} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Row({ customer, index }: { customer: Customer; index: number }) {
  return (
    <tr className="bg-white border-b">
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="border-y bg-white px-3 py-2">{customer.name}</td>
      <td className="border-y bg-white px-3 py-2">{customer.email}</td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
        {customer.contactInfo || "N/A"}
      </td>
    </tr>
  );
}
