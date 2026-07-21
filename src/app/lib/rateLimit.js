const store = new Map();

function getClientIp(req) {
    const xff = req.headers.get("x-forwarded-for");

    if (xff) {
        return xff.split(",")[0].trim();
    }

    return req.headers.get("x-real-ip") || "unknown";
}

function cleanup() {
    const now = Date.now();

    for (const [key, value] of store.entries()) {
        if (now >= value.resetAt) {
            store.delete(key);
        }
    }
}

export function rateLimit({
    req,
    key = null,
    limit,
    windowMs,
    name = "default",
}) {
    cleanup();

    const clientKey = key ?? getClientIp(req);
    const bucketKey = `${name}:${clientKey}`;

    const now = Date.now();
    const bucket = store.get(bucketKey);

    // First request
    if (!bucket) {
        const resetAt = now + windowMs;

        store.set(bucketKey, {
            count: 1,
            resetAt,
        });

        return {
            allowed: true,
            remaining: limit - 1,
            resetAt,
        };
    }

    // Time window expired
    if (now >= bucket.resetAt) {
        bucket.count = 1;
        bucket.resetAt = now + windowMs;

        store.set(bucketKey, bucket);

        return {
            allowed: true,
            remaining: limit - 1,
            resetAt: bucket.resetAt,
        };
    }

    // Limit reached
    if (bucket.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: bucket.resetAt,
        };
    }

    // Count this request
    bucket.count++;

    return {
        allowed: true,
        remaining: limit - bucket.count,
        resetAt: bucket.resetAt,
    };
}