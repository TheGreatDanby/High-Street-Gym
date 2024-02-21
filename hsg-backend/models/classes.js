export function Classes(
    id,
    Name,
    Description,
    Duration,
    Timeslot,
    Location,
) {
    return {
        id,
        Name,
        Description,
        Duration,
        Timeslot,
        Location
    }
}


export function Session(
    id,
    classSessionId,
    sessionDate,
    participants,
    Trainer,
) {
    return {
        id,
        classSessionId,
        sessionDate,
        participants,
        Trainer,
    }
}






