#!/usr/bin/env python3
"""Generate a large, varied Viva Insights CSV for the smoke test.

Standard library only. Deterministic (random.seed(42)). Writes
test/viva-large.csv next to this script: ~200 persons x 16 weekly rows
across 4 organizations and 3 FunctionTypes, with a realistic mix of
power / habitual / novice / low / non usage profiles.

The smoke test only asserts that the file parses without throwing and
that every person is assigned one of the five valid tiers, so exact
per-person tiers are intentionally NOT pinned here.
"""

import csv
import os
import random

SEED = 42
NUM_PERSONS = 200
NUM_WEEKS = 16
START_DATE = (2025, 1, 6)  # Monday
ORGS = ["Contoso Ltd", "Fabrikam Inc", "Northwind Traders", "Adventure Works"]
FUNCTIONS = ["Sales", "Engineering", "Marketing"]
REGIONS = ["North America", "Europe", "Asia Pacific"]
APPS = ["Word", "Excel", "Teams", "Outlook", "PowerPoint", "OneNote"]

HEADERS = [
    "PersonId",
    "MetricDate",
    "Total Copilot actions taken",
    "Total Copilot active days",
    "Total Copilot enabled days",
    "Copilot assisted hours",
    "Intelligent recap actions taken",
    "Organization",
    "FunctionType",
    "Region",
] + ["Copilot actions taken in " + a for a in APPS]

# Profile -> function producing a plausible weekly total for that profile.
PROFILES = ["power", "habitual", "novice", "low", "non"]


def week_dates():
    """Return NUM_WEEKS ISO 'YYYY-MM-DD 00:00:00' strings, 7 days apart."""
    import datetime

    base = datetime.date(*START_DATE)
    out = []
    for i in range(NUM_WEEKS):
        d = base + datetime.timedelta(days=7 * i)
        out.append(d.strftime("%Y-%m-%d 00:00:00"))
    return out


def weekly_total(profile, rng):
    """Sample one week's Total Copilot actions for a given profile."""
    if profile == "power":
        return rng.randint(20, 60)
    if profile == "habitual":
        return rng.randint(8, 19)
    if profile == "novice":
        return rng.randint(1, 7)
    if profile == "low":
        # Mostly zero weeks so the 12-week mean lands under 1.
        return rng.choice([0, 0, 0, 0, 1])
    return 0  # non


def split_across_apps(total, rng):
    """Partition an integer total across the app columns so they sum to total."""
    remaining = total
    parts = []
    for _ in range(len(APPS) - 1):
        take = rng.randint(0, remaining)
        parts.append(take)
        remaining -= take
    parts.append(remaining)
    rng.shuffle(parts)
    return parts


def main():
    rng = random.Random(SEED)
    dates = week_dates()
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "viva-large.csv")

    with open(out_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(HEADERS)
        for p in range(1, NUM_PERSONS + 1):
            person_id = "L%04d" % p
            org = ORGS[p % len(ORGS)]
            fn = FUNCTIONS[p % len(FUNCTIONS)]
            region = REGIONS[p % len(REGIONS)]
            profile = rng.choice(PROFILES)
            for date in dates:
                total = weekly_total(profile, rng)
                active_days = 0 if total == 0 else rng.randint(1, 5)
                enabled_days = 5
                assist_hours = 0 if total == 0 else round(rng.uniform(0.2, 4.0), 1)
                recap = 0 if total == 0 else rng.randint(0, 3)
                app_parts = split_across_apps(total, rng)
                writer.writerow(
                    [person_id, date, total, active_days, enabled_days, assist_hours, recap, org, fn, region]
                    + app_parts
                )

    print("wrote %s (%d persons x %d weeks)" % (out_path, NUM_PERSONS, NUM_WEEKS))


if __name__ == "__main__":
    main()
