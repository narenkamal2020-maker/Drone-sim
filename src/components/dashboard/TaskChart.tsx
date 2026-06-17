"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ITask } from "@/models/Task";
import { PieChart as PieIcon } from "lucide-react";

interface TaskChartProps {
  tasks: ITask[];
}

const CHART_COLORS = {
  todo: "#0EA5E9",
  inprogress: "#F59E0B",
  done: "#10B981",
};

const CHART_LABELS = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

function CustomLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (percent === undefined || percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.55;
  const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
  const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function TaskChart({ tasks }: TaskChartProps) {
  const [mounted, setMounted] = useState(false);
  // Animate in after mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "inprogress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const data = [
    { name: CHART_LABELS.todo, value: todoCount, key: "todo" },
    { name: CHART_LABELS.inprogress, value: inProgressCount, key: "inprogress" },
    { name: CHART_LABELS.done, value: doneCount, key: "done" },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center gap-2">
        <PieIcon className="h-4 w-4 text-sky-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Task Distribution
        </h3>
      </div>

      <div className="p-4">
        {tasks.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-[var(--text-muted)] text-xs text-center">
            <div>
              <PieIcon className="h-10 w-10 mx-auto mb-2 opacity-20" strokeWidth={1.5} />
              <p>No tasks to visualize yet</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={CustomLabel}
                isAnimationActive={mounted}
                animationBegin={0}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={CHART_COLORS[entry.key as keyof typeof CHART_COLORS]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  backdropFilter: "blur(8px)",
                }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TaskChart;
