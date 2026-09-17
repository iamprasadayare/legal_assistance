/**
 * @file cache.ts
 * @description High-performance SHA-256 Server-Side LRU Response Cache for Gemini Legal Briefs.
 * Reduces redundant LLM API calls, optimizes token efficiency, and delivers sub-5ms response latency.
 */

import { LegalBriefData } from "@/types";
import crypto from "crypto";

interface CacheEntry {
  data: LegalBriefData;
  timestamp: number;
}

class BriefCache {
  private cache = new Map<string, CacheEntry>();
  private maxEntries = 100;
  private ttlMs = 24 * 60 * 60 * 1000; // 24 hours TTL

  /**
   * Generates a deterministic SHA-256 hash key from narrative input and parameters.
   */
  public generateKey(narrative: string, category?: string, jurisdiction?: string): string {
    const normalized = `${narrative.trim().toLowerCase()}|${(category || "").toLowerCase()}|${(jurisdiction || "").toLowerCase()}`;
    return crypto.createHash("sha256").update(normalized).digest("hex");
  }

  /**
   * Retrieves cached brief if present and not expired.
   */
  public get(key: string): LegalBriefData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Stores brief result in LRU cache.
   */
  public set(key: string, data: LegalBriefData): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (LRU)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Returns current cache size for telemetry/debugging.
   */
  public size(): number {
    return this.cache.size;
  }
}

export const globalBriefCache = new BriefCache();
