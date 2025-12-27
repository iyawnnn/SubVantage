"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CalendarDays, AlertCircle, Leaf } from "lucide-react";
import { SpendingChart } from "./SpendingChart";
import { CategoryChart } from "./CategoryChart";
import { UpcomingBills } from "./UpcomingBills";
import { SubscriptionTable } from "./SubscriptionTable";
import { InsightsCard, ForecastWidget } from "./Insights"; // GraveyardCard removed
import { formatCurrency } from "@/lib/currency-helper";
import { StaggerContainer, StaggerItem } from "./DashboardMotion";

interface DashboardDataProps {
  subs: any[];
  monthlyBurn: number;
  annualProjection: number;
  activeTrials: number;
  totalSaved: number;
  currency: string;
}

// --- 1. Stats Section ---
export function StatsSection({
  monthlyBurn,
  annualProjection,
  activeTrials,
  totalSaved,
  currency,
}: DashboardDataProps) {
  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mb-8">
        <StaggerItem>
          <StatCard 
            title="Monthly Burn" 
            value={formatCurrency(monthlyBurn, currency)} 
            icon={<Banknote className="h-5 w-5 text-blue-500" />} 
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Annual Projection" 
            value={formatCurrency(annualProjection, currency)} 
            icon={<CalendarDays className="h-5 w-5 text-violet-500" />} 
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Active Trials" 
            value={activeTrials.toString()} 
            icon={<AlertCircle className="h-5 w-5 text-orange-500" />} 
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Monthly Savings" 
            value={formatCurrency(totalSaved, currency)} 
            icon={<Leaf className="h-5 w-5 text-emerald-500" />} 
          />
        </StaggerItem>
      </div>
    </StaggerContainer>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// --- 2. Insights Section ---
export function InsightsSection({ redundancy, runway, currency }: { redundancy: any[]; runway: any; currency: string; }) {
  if (redundancy.length === 0 && !runway) return null;

  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
        {redundancy.length > 0 && (
          <StaggerItem className="h-full">
            <InsightsCard redundancies={redundancy} currency={currency} />
          </StaggerItem>
        )}
        <div className={redundancy.length > 0 ? "" : "col-span-2"}>
          <StaggerItem className="h-full">
             <ForecastWidget d30={runway.d30} d60={runway.d60} d90={runway.d90} currency={currency} />
          </StaggerItem>
        </div>
      </div>
    </StaggerContainer>
  );
}

// --- 3. Charts Section ---
export function ChartsSection({ subs, rates, currency }: { subs: any[]; rates: any; currency: string; }) {
  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 mb-8">
        <div className="md:col-span-8">
          <StaggerItem>
            <div className="min-h-[400px]">
              <SpendingChart data={subs} />
            </div>
          </StaggerItem>
        </div>
        <div className="md:col-span-4 space-y-6">
          <StaggerItem>
            <div className="min-h-[300px]">
              <CategoryChart subs={subs} rates={rates} currency={currency} />
            </div>
          </StaggerItem>
          <StaggerItem>
            <UpcomingBills data={subs} rates={rates} currency={currency} />
          </StaggerItem>
        </div>
      </div>
    </StaggerContainer>
  );
}

// --- 4. Table Section ---
export function TableSection({ subs, rates, currency }: { subs: any[], rates: any, currency: string }) {
  return (
    <StaggerContainer>
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionTable data={subs} rates={rates} baseCurrency={currency} />
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}