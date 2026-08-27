"use client";

import { useState } from "react";
import { X, Bug, ShieldAlert, Cpu, Layers } from "lucide-react";
import { Priority, Severity } from "@prisma/client";

interface CreateIssueModalProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function CreateIssueModal({
  onClose,
  onSubmit,
}: CreateIssueModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectKey, setProjectKey] = useState("CORE");
  const [component, setComponent] = useState("Auth & ACL");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [severity, setSeverity] = useState<Severity>(Severity.NORMAL);
  const [environment, setEnvironment] = useState("");
  const [version, setVersion] = useState("v2.0.0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const payload = {
      title,
      description,
      projectKey,
      component,
      priority,
      severity,
      environment,
      version,
    };

    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/5">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                File New Bug Report
              </h2>
              <p className="text-xs text-zinc-400">
                Provide issue context, environmental setup, and severity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* Summary / Title */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold flex items-center gap-1">
              Bug Summary <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Memory leak during concurrent state transitions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/10 focus:outline-none transition-all"
            />
          </div>

          {/* Project & Component Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-rose-400" /> Project
              </label>
              <select
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-rose-500/50 focus:outline-none"
              >
                <option value="CORE">CORE - Core Infrastructure</option>
                <option value="UI">UI - Frontend & Visuals</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center gap-1">
                Component
              </label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-rose-500/50 focus:outline-none"
              >
                <option value="Auth & ACL">Auth & ACL</option>
                <option value="Database Engine">Database Engine</option>
                <option value="State Machine">State Machine</option>
                <option value="Kanban Board">Kanban Board</option>
              </select>
            </div>
          </div>

          {/* Priority & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-rose-500/50 focus:outline-none"
              >
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
                <option value={Priority.URGENT}>Urgent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-rose-500/50 focus:outline-none"
              >
                <option value={Severity.TRIVIAL}>Trivial</option>
                <option value={Severity.MINOR}>Minor</option>
                <option value={Severity.NORMAL}>Normal</option>
                <option value={Severity.MAJOR}>Major</option>
                <option value={Severity.CRITICAL}>Critical</option>
                <option value={Severity.BLOCKER}>Blocker</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold flex items-center gap-1">
              Detailed Description / Reproduction Steps <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what happened, steps to reproduce, and expected behavior..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/10 focus:outline-none transition-all font-mono"
            />
          </div>

          {/* System & Environment Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-zinc-400" /> Environment Details
              </label>
              <input
                type="text"
                placeholder="e.g. Node v20.20 / macOS 15"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold">Affected Version</label>
              <input
                type="text"
                placeholder="e.g. v2.0.0-beta"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-semibold text-xs transition shadow-lg shadow-rose-500/15"
            >
              Submit Bug Report
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}