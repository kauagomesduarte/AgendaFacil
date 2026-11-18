import assert from "node:assert/strict";
import test from "node:test";
import {
    appointmentFitsSchedule,
    getLocalDateTime,
    isValidIanaTimeZone,
    localDateTimeToInstant
} from "./scheduleTime.js";

test("validates IANA time zones", () => {
    assert.equal(isValidIanaTimeZone("America/Sao_Paulo"), true);
    assert.equal(isValidIanaTimeZone("Not/A_Timezone"), false);
});

test("converts a local schedule time using its company time zone", () => {
    const instant = localDateTimeToInstant(
        "2026-11-18",
        9 * 60,
        "America/Sao_Paulo"
    );

    assert.ok(instant);
    assert.equal(instant.toISOString(), "2026-11-18T12:00:00.000Z");
    assert.deepEqual(getLocalDateTime(instant, "America/Sao_Paulo"), {
        year: 2026,
        month: 11,
        day: 18,
        weekday: 3,
        minuteOfDay: 9 * 60
    });
});

test("rejects nonexistent local times during a daylight-saving transition", () => {
    assert.equal(
        localDateTimeToInstant("2026-03-08", 2 * 60 + 30, "America/New_York"),
        null
    );
});

test("requires an appointment to fit inside one schedule interval", () => {
    const schedule = {
        dayOfWeek: 3,
        startMinute: 9 * 60,
        endMinute: 10 * 60
    };
    const startAt = new Date("2026-11-18T12:00:00.000Z");

    assert.equal(
        appointmentFitsSchedule(
            startAt,
            new Date("2026-11-18T13:00:00.000Z"),
            schedule,
            "America/Sao_Paulo"
        ),
        true
    );
    assert.equal(
        appointmentFitsSchedule(
            startAt,
            new Date("2026-11-18T13:01:00.000Z"),
            schedule,
            "America/Sao_Paulo"
        ),
        false
    );
});
