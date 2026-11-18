export interface LocalDateTime {
    year: number;
    month: number;
    day: number;
    weekday: number;
    minuteOfDay: number;
}

const weekdayNumbers: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7
};

function pad(value: number): string {
    return String(value).padStart(2, "0");
}

function localDateKey(parts: LocalDateTime): string {
    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function isValidIanaTimeZone(timeZone: string): boolean {
    try {
        new Intl.DateTimeFormat("en-US", { timeZone });
        return true;
    } catch (error) {
        if (error instanceof RangeError) return false;
        throw error;
    }
}

export function getLocalDateTime(date: Date, timeZone: string): LocalDateTime {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts.map(part => [part.type, part.value])
    );
    const weekday = weekdayNumbers[values.weekday ?? ""];

    if (!weekday) {
        throw new RangeError("Could not resolve local weekday.");
    }

    const hour = Number(values.hour);
    const minute = Number(values.minute);

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        weekday,
        minuteOfDay: hour * 60 + minute
    };
}

export function appointmentFitsSchedule(
    startAt: Date,
    endAt: Date,
    schedule: { dayOfWeek: number; startMinute: number; endMinute: number },
    timeZone: string
): boolean {
    const start = getLocalDateTime(startAt, timeZone);
    const end = getLocalDateTime(endAt, timeZone);
    let endMinute = end.minuteOfDay;
    const sameLocalDay = localDateKey(start) === localDateKey(end);

    if (!sameLocalDay && end.minuteOfDay === 0) {
        const nextDay = new Date(Date.UTC(start.year, start.month - 1, start.day + 1));
        if (localDateKey(end) === nextDay.toISOString().slice(0, 10)) {
            endMinute = 1440;
        }
    }

    if (!sameLocalDay && endMinute !== 1440) return false;
    if (startAt.getUTCSeconds() !== 0 || startAt.getUTCMilliseconds() !== 0 ||
        endAt.getUTCSeconds() !== 0 || endAt.getUTCMilliseconds() !== 0) {
        return false;
    }

    return start.weekday === schedule.dayOfWeek &&
        start.minuteOfDay >= schedule.startMinute &&
        endMinute <= schedule.endMinute &&
        endMinute > start.minuteOfDay;
}

export function localDateTimeToInstant(
    date: string,
    minuteOfDay: number,
    timeZone: string
): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const dateCheck = new Date(Date.UTC(year, month - 1, day));
    if (
        dateCheck.getUTCFullYear() !== year ||
        dateCheck.getUTCMonth() + 1 !== month ||
        dateCheck.getUTCDate() !== day ||
        minuteOfDay < 0 ||
        minuteOfDay > 1440
    ) {
        return null;
    }

    const localDate = minuteOfDay === 1440
        ? new Date(Date.UTC(year, month - 1, day + 1))
        : dateCheck;
    const localMinute = minuteOfDay === 1440 ? 0 : minuteOfDay;
    const desiredWallTime = Date.UTC(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate(),
        Math.floor(localMinute / 60),
        localMinute % 60
    );

    let candidate = new Date(desiredWallTime);
    for (let attempt = 0; attempt < 4; attempt += 1) {
        const local = getLocalDateTime(candidate, timeZone);
        const representedWallTime = Date.UTC(
            local.year,
            local.month - 1,
            local.day,
            Math.floor(local.minuteOfDay / 60),
            local.minuteOfDay % 60
        );
        const difference = desiredWallTime - representedWallTime;
        if (difference === 0) return candidate;
        candidate = new Date(candidate.getTime() + difference);
    }

    const finalLocal = getLocalDateTime(candidate, timeZone);
    return Date.UTC(
        finalLocal.year,
        finalLocal.month - 1,
        finalLocal.day,
        Math.floor(finalLocal.minuteOfDay / 60),
        finalLocal.minuteOfDay % 60
    ) === desiredWallTime
        ? candidate
        : null;
}
