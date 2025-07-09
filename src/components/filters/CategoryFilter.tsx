"use client";

import { categories } from "@/types/subscription";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Category</h3>
      <div className="space-y-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategory === ""}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">All Categories</span>
        </label>
        {categories.map((category) => (
          <label key={category} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value={category}
              checked={selectedCategory === category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 