"use client";

import { useState } from "react";

type SiteRecord = {
  status: string;
  docsLink: string;
};

type CompanySitesBoardProps = {
  sites: string[];
};

const STORAGE_KEY = "crisp-company-sites";

const sitePurposeByUrl: Record<string, string> = {
  "https://ai.crispai.ca": "AI tools and automation solutions",
};

const siteStatusByUrl: Record<string, string> = {
  "https://ai.crispai.ca": "Live",
};

const siteDocsLinkByUrl: Record<string, string> = {
  "https://ai.crispai.ca/api/leads": "https://ai.crispai.ca/api/leads",
};

const fieldLabels: Record<keyof SiteRecord, string> = {
  status: "Status",
  docsLink: "Docs Link",
};

const fieldPlaceholders: Record<keyof SiteRecord, string> = {
  status: "Live, in progress, archived, needs review...",
  docsLink: "Docs, notes page, or management URL",
};

function createEmptyRecord(): SiteRecord {
  return {
    status: "",
    docsLink: "",
  };
}

function createSiteRecords(sites: string[]) {
  return Object.fromEntries(sites.map((site) => [site, createEmptyRecord()]));
}

function formatSavedAt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitialRecords(sites: string[]) {
  if (typeof window === "undefined") {
    return createSiteRecords(sites);
  }

  const storedRecords = window.localStorage.getItem(STORAGE_KEY);

  if (!storedRecords) {
    return createSiteRecords(sites);
  }

  try {
    const parsedRecords = JSON.parse(storedRecords) as Record<string, SiteRecord>;

    return Object.fromEntries(
      sites.map((site) => [site, parsedRecords[site] ?? createEmptyRecord()]),
    );
  } catch {
    return createSiteRecords(sites);
  }
}

function getInitialSavedAt() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(`${STORAGE_KEY}:saved-at`) ?? "";
}

function getSiteLabel(site: string) {
  const hostname = new URL(site).hostname.replace(".crispai.ca", "");
  return hostname
    .split(".")
    .join(" ")
    .split(/[-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CompanySitesBoard({
  sites,
}: CompanySitesBoardProps) {
  const [records, setRecords] = useState<Record<string, SiteRecord>>(() =>
    getInitialRecords(sites),
  );
  const [query, setQuery] = useState("");
  const [savedAt, setSavedAt] = useState<string>(() => getInitialSavedAt());

  function updateSiteRecord(
    site: string,
    field: keyof SiteRecord,
    value: string,
  ) {
    const nextRecords = {
      ...records,
      [site]: {
        ...(records[site] ?? createEmptyRecord()),
        [field]: value,
      },
    };

    const nextSavedAt = formatSavedAt(new Date());
    setRecords(nextRecords);
    setSavedAt(nextSavedAt);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    window.localStorage.setItem(`${STORAGE_KEY}:saved-at`, nextSavedAt);
  }

  const filteredSites = sites.filter((site) => {
    const siteLabel = getSiteLabel(site).toLowerCase();
    const siteData = records[site];
    const haystack = [
      site,
      siteLabel,
      sitePurposeByUrl[site],
      siteData?.status,
      siteData?.docsLink,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  });

  const completedSites = sites.filter((site) => {
    const siteData = records[site];

    if (!siteData) {
      return false;
    }

    return Object.values(siteData).some((value) => value.trim().length > 0);
  }).length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(193,233,255,0.92)_40%,_rgba(121,196,255,0.75)_100%)] px-4 py-8 text-sky-950 sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/65 p-6 shadow-[0_30px_90px_-40px_rgba(2,132,199,0.65)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">
                Crisp AI Web Directory
              </p>
              <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-sky-950 sm:text-5xl">
                Company websites, ownership, and operational notes in one place
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-sky-900/75 sm:text-lg">
                Each site has its own section so you can track purpose, owner,
                status, admin links, and any extra context. Entries save in this
                browser automatically.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-sky-950 px-5 py-4 text-white">
                <p className="text-sm text-sky-100/75">Total Sites</p>
                <p className="mt-2 text-3xl font-semibold">{sites.length}</p>
              </div>
              <div className="rounded-2xl bg-sky-100 px-5 py-4">
                <p className="text-sm text-sky-700">Updated Records</p>
                <p className="mt-2 text-3xl font-semibold">{completedSites}</p>
              </div>
              <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-sky-200">
                <p className="text-sm text-sky-700">Last Saved</p>
                <p className="mt-2 text-sm font-medium text-sky-950">
                  {savedAt || "Waiting for first edit"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-white/70 p-4 shadow-[0_18px_50px_-32px_rgba(14,116,144,0.8)] backdrop-blur sm:p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-sky-800">
              Search websites or notes
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by site name, owner, purpose, or notes"
              className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60"
            />
          </label>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {filteredSites.map((site, index) => {
            const siteData = records[site] ?? createEmptyRecord();
            const siteLabel = getSiteLabel(site);
            const sitePurpose = sitePurposeByUrl[site] ?? "Purpose not added yet";
            const siteStatus = siteStatusByUrl[site] ?? siteData.status;

            return (
              <article
                key={site}
                className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/80 p-5 shadow-[0_20px_60px_-38px_rgba(3,105,161,0.9)] backdrop-blur"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-300 via-cyan-400 to-sky-600" />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">
                        Site {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-sky-950">
                        {siteLabel}
                      </h2>
                    </div>

                    <a
                      href={site}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-sky-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
                    >
                      Open Website
                    </a>
                  </div>

                  <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
                    {site}
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-sky-200">
                    <p className="text-sm font-semibold text-sky-800">Purpose</p>
                    <p className="mt-2 text-sm leading-6 text-sky-900">
                      {sitePurpose}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-semibold text-sky-800">
                        Status
                      </span>
                      <input
                        value={siteStatus}
                        onChange={(event) =>
                          updateSiteRecord(site, "status", event.target.value)
                        }
                        placeholder={fieldPlaceholders.status}
                        className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-sky-950 outline-none transition placeholder:text-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60"
                      />
                    </label>

                    {(
                      Object.keys(fieldLabels).filter(
                        (field) => field !== "status",
                      ) as Array<keyof SiteRecord>
                    ).map((field) => {
                      const inputClasses =
                        "w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-sky-950 outline-none transition placeholder:text-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60";

                      return (
                        <label key={field}>
                          <span className="mb-2 block text-sm font-semibold text-sky-800">
                            {fieldLabels[field]}
                          </span>

                          <input
                            value={siteData[field]}
                            onChange={(event) =>
                              updateSiteRecord(site, field, event.target.value)
                            }
                            placeholder={fieldPlaceholders[field]}
                            className={inputClasses}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredSites.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-sky-300 bg-white/70 px-6 py-12 text-center text-sky-800">
            No websites matched your search.
          </div>
        ) : null}
      </section>
    </main>
  );
}
