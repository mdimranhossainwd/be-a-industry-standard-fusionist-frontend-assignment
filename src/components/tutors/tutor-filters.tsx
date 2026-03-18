"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface TutorFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  categories: Array<{ id: string; name: string }>;
}

export function TutorFilters({
  onSearch,
  onCategoryChange,
  onPriceRangeChange,
  categories,
}: TutorFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onPriceRangeChange(values[0], values[1]);
  };

  const handleReset = () => {
    setSearchQuery("");
    setPriceRange([0, 200]);
    setSelectedCategory("all");
    onSearch("");
    onCategoryChange("all");
    onPriceRangeChange(0, 200);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 md:p-5 lg:p-6 rounded-2xl shadow-lg border border-gray-100 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-0.5 sm:mb-1 md:mb-2">
        <h2 className="text-base sm:text-lg md:text-xl font-bold  ">
          Filters Tutor
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-gray-500 hover:text-gray-700 h-7 sm:h-8 text-xs sm:text-sm"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Reset
        </Button>
      </div>

      <div>
        <h3 className="font-semibold mb-1.5 sm:mb-2 md:mb-3 text-xs sm:text-sm md:text-base text-gray-700">
          Search
        </h3>
        <div className="flex gap-1.5 sm:gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-9 sm:h-10"
          />
          <Button
            onClick={handleSearch}
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-1.5 sm:mb-2 md:mb-3 text-xs sm:text-sm md:text-base text-gray-700">
          Select By Category
        </h3>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 sm:h-10 text-xs sm:text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-1.5 sm:mb-2 md:mb-3 text-xs sm:text-sm md:text-base text-gray-700">
          Price:{" "}
          <span className=" text-xs sm:text-sm md:text-base">
            ${priceRange[0]}-${priceRange[1]}/hr
          </span>
        </h3>
        <Slider
          min={0}
          max={200}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-2 sm:mt-3 md:mt-4"
        />
      </div>
    </div>
  );
}
