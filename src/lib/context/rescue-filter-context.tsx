"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface RescueFilterState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  isBeneficiaryOnly: boolean;
  setIsBeneficiaryOnly: (val: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: "distance" | "expiry" | "portions";
  setSortBy: (sort: "distance" | "expiry" | "portions") => void;
  resetFilters: () => void;
}

const RescueFilterContext = createContext<RescueFilterState | undefined>(undefined);

export function RescueFilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [isBeneficiaryOnly, setIsBeneficiaryOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"distance" | "expiry" | "portions">("expiry");

  return (
    <RescueFilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        radiusKm,
        setRadiusKm,
        isBeneficiaryOnly,
        setIsBeneficiaryOnly,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy: (sort) => setSortBy(sort === "distance" ? "expiry" : sort),
        resetFilters: () => {
          setSearchQuery("");
          setRadiusKm(10);
          setIsBeneficiaryOnly(false);
          setSelectedCategory("all");
          setSortBy("expiry");
        },
      }}
    >
      {children}
    </RescueFilterContext.Provider>
  );
}

export function useRescueFilter() {
  const context = useContext(RescueFilterContext);
  if (!context) {
    throw new Error("useRescueFilter must be used within a RescueFilterProvider");
  }
  return context;
}
