'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client'; // Make sure you import your Sanity client

interface Category {
  _id?: string;
  name: string;
  slug: string;
}

export default function Form() {
  const [data, setData] = useState<Category>({ name: '', slug: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryId = params.get('id');
      setId(categoryId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const category = await client.fetch(
            `*[_type == "category" && _id == $id][0]`,
            { id }
          );
          setData(category || { name: '', slug: '' });
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // ✅ Auto-generate slug from name
  const handleData = (key: string, value: string) => {
    setData((prevData) => {
      const updatedData = { ...prevData, [key]: value };
      if (key === 'name') {
        updatedData.slug = value.toLowerCase().replace(/\s+/g, '-');
      }
      return updatedData;
    });
  };

  const handleCreate = async () => {
    if (!data.name || !data.slug) return alert('All fields are required!');
    setIsLoading(true);
    try {
      await client.create({
        _type: 'category',
        name: data.name,
        slug: data.slug,
      });
      setData({ name: '', slug: '' });
      router.push('/Admin/Categories');
    } catch (error) {
      console.error('Error creating category:', error);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!id) return;
    if (!data.name || !data.slug) return alert('All fields are required!');
    setIsLoading(true);
    try {
      await client.patch(id).set({ name: data.name, slug: data.slug }).commit();
      router.push('/Admin/Categories');
    } catch (error) {
      console.error('Error updating category:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? 'Update' : 'Create'} Category</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleUpdate() : handleCreate();
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="category-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            placeholder="Enter Name"
            value={data.name}
            onChange={(e) => handleData('name', e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category-slug" className="text-gray-500 text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="category-slug"
            type="text"
            placeholder="Enter Slug"
            value={data.slug}
            onChange={(e) => handleData('slug', e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 mt-3 rounded-lg bg-blue-500 text-white ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
