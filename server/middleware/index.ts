import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User as SelectUser } from "@shared/schema";
import { verifyToken } from "../auth";

export interface AuthenticatedRequest extends Request {
    user?: SelectUser;
}

// Re-export verifyToken for convenience
export { verifyToken };

// Middleware to verify WooCommerce webhook signatures using constant-time comparison
export function verifyWebhookSignature(req: Request, res: Response, next: NextFunction) {
    const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("WOOCOMMERCE_WEBHOOK_SECRET is not configured");
        return res.status(500).json({ error: "Webhook secret not configured" });
    }

    const signature = req.headers['x-wc-webhook-signature'] as string;

    if (!signature) {
        console.error("Webhook signature missing");
        return res.status(401).json({ error: "Webhook signature missing" });
    }

    // Use the raw body buffer captured by middleware for accurate signature verification
    const rawBody = (req as any).rawBody as Buffer;

    if (!rawBody) {
        console.error("Raw body not available for signature verification");
        return res.status(500).json({ error: "Webhook verification error" });
    }

    // Compute HMAC-SHA256 signature using the raw body
    const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('base64');

    // Use constant-time comparison to prevent timing attacks
    try {
        const signatureBuffer = Buffer.from(signature, 'base64');
        const computedBuffer = Buffer.from(computedSignature, 'base64');

        // Ensure buffers are same length before comparing
        if (signatureBuffer.length !== computedBuffer.length) {
            console.error("Invalid webhook signature (length mismatch)");
            return res.status(401).json({ error: "Invalid webhook signature" });
        }

        if (!crypto.timingSafeEqual(signatureBuffer, computedBuffer)) {
            console.error("Invalid webhook signature");
            return res.status(401).json({ error: "Invalid webhook signature" });
        }
    } catch (error) {
        console.error("Signature verification error:", error);
        return res.status(401).json({ error: "Invalid webhook signature" });
    }

    next();
}
